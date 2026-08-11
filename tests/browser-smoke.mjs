import { writeFile } from "node:fs/promises";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const debugUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9223";
const screenshotPath = process.env.SCREENSHOT_PATH;
const screenshotOffset = Number(process.env.SCREENSHOT_OFFSET ?? 0);

const viewports = [
  [320, 568],
  [375, 667],
  [480, 800],
  [768, 1024],
  [1024, 768],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
];

class CdpClient {
  constructor(webSocketUrl) {
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(webSocketUrl);
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const listeners = this.listeners.get(message.method) ?? [];
      listeners.forEach((listener) => listener(message.params));
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  waitFor(method, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const listeners = this.listeners.get(method) ?? [];
      const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeout);
      const listener = (params) => {
        clearTimeout(timer);
        const current = this.listeners.get(method) ?? [];
        this.listeners.set(method, current.filter((item) => item !== listener));
        resolve(params);
      };
      listeners.push(listener);
      this.listeners.set(method, listeners);
    });
  }

  close() {
    this.socket.close();
  }
}

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function main() {
  const targetResponse = await fetch(`${debugUrl}/json/new?${encodeURIComponent(baseUrl)}`, {
    method: "PUT",
  });
  if (!targetResponse.ok) throw new Error(`Could not create Chrome target: ${targetResponse.status}`);

  const target = await targetResponse.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  const consoleErrors = [];
  const networkErrors = [];
  let ignoreExpectedNetworkFailures = false;

  client.on("Runtime.exceptionThrown", (event) => {
    consoleErrors.push(event.exceptionDetails?.exception?.description ?? event.exceptionDetails?.text);
  });
  client.on("Log.entryAdded", (event) => {
    if (event.entry.level === "error") consoleErrors.push(event.entry.text);
  });
  client.on("Network.responseReceived", (event) => {
    if (event.response.status >= 400 && event.response.url.startsWith(baseUrl)) {
      networkErrors.push(`${event.response.status} ${event.response.url}`);
    }
  });
  client.on("Network.loadingFailed", (event) => {
    if (!event.canceled && !ignoreExpectedNetworkFailures) networkErrors.push(event.errorText);
  });

  await Promise.all([
    client.send("Page.enable"),
    client.send("Runtime.enable"),
    client.send("Network.enable"),
    client.send("Log.enable"),
  ]);

  async function navigate(url = baseUrl) {
    const loaded = client.waitFor("Page.loadEventFired");
    await client.send("Page.navigate", { url });
    try {
      await loaded;
    } catch (error) {
      throw new Error(`Navigation to ${url} did not complete`, { cause: error });
    }
    await pause(250);
  }

  async function evaluate(expression) {
    const result = await client.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    }
    return result.result.value;
  }

  const results = [];

  for (const [width, height] of viewports) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await navigate();

    const audit = await evaluate(`(() => {
      const visible = (element) => {
        const style = getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0;
      };
      const overflow = [...document.body.querySelectorAll("*")]
        .filter((element) => visible(element) && element.getAttribute("aria-hidden") !== "true")
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return { element, rect };
        })
        .filter(({ rect }) => rect.width > 1 && (rect.left < -1 || rect.right > innerWidth + 1))
        .map(({ element, rect }) => ({
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: String(element.className).slice(0, 90),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        }))
        .slice(0, 8);
      const headings = [...document.querySelectorAll("h1,h2,h3")].map((heading) => Number(heading.tagName[1]));
      const headingJumps = headings.filter((level, index) => index > 0 && level - headings[index - 1] > 1);
      const unsafeExternalLinks = [...document.querySelectorAll('a[target="_blank"]')]
        .filter((link) => !link.relList.contains("noopener") || !link.relList.contains("noreferrer"))
        .length;
      const brokenImages = [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src);
      const smallButtons = [...document.querySelectorAll("button")]
        .filter((button) => visible(button))
        .map((button) => {
          const rect = button.getBoundingClientRect();
          return { label: button.getAttribute("aria-label") || button.textContent.trim(), width: rect.width, height: rect.height };
        })
        .filter((button) => button.width < 44 || button.height < 44);
      return {
        innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow,
        lang: document.documentElement.lang,
        h1Count: document.querySelectorAll("h1").length,
        hasMain: Boolean(document.querySelector("main#main-content")),
        headingJumps: headingJumps.length,
        unsafeExternalLinks,
        brokenImages,
        smallButtons,
      };
    })()`);

    const failures = [];
    if (audit.scrollWidth > audit.innerWidth) failures.push(`scrollWidth ${audit.scrollWidth} > ${audit.innerWidth}`);
    if (audit.overflow.length) failures.push(`overflowing elements: ${JSON.stringify(audit.overflow)}`);
    if (audit.lang !== "en") failures.push(`lang is ${audit.lang}`);
    if (audit.h1Count !== 1) failures.push(`expected one h1, found ${audit.h1Count}`);
    if (!audit.hasMain) failures.push("main landmark missing");
    if (audit.headingJumps) failures.push(`${audit.headingJumps} heading-level jumps`);
    if (audit.unsafeExternalLinks) failures.push(`${audit.unsafeExternalLinks} unsafe external links`);
    if (audit.brokenImages.length) failures.push(`broken images: ${audit.brokenImages.join(", ")}`);
    if (audit.smallButtons.length) failures.push(`small buttons: ${JSON.stringify(audit.smallButtons)}`);
    results.push({ width, height, failures });
  }

  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 320,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await navigate();

  await evaluate(`document.querySelector('[aria-controls="mobile-navigation"]').focus()`);
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    nativeVirtualKeyCode: 13,
    text: "\r",
    unmodifiedText: "\r",
    windowsVirtualKeyCode: 13,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
  });
  await pause(350);
  const openMenu = await evaluate(`(() => ({
    expanded: document.querySelector('[aria-controls="mobile-navigation"]').getAttribute("aria-expanded"),
    bodyLocked: document.body.dataset.menuOpen,
    dialogVisible: getComputedStyle(document.querySelector('[role="dialog"]')).visibility !== "hidden",
    focusedLabel: document.activeElement?.getAttribute("aria-label"),
  }))()`);
  if (
    openMenu.expanded !== "true" ||
    openMenu.bodyLocked !== "true" ||
    !openMenu.dialogVisible ||
    openMenu.focusedLabel !== "Close navigation menu"
  ) {
    throw new Error(`Mobile menu did not open accessibly: ${JSON.stringify(openMenu)}`);
  }

  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  await pause(350);
  const closedMenu = await evaluate(`(() => ({
    expanded: document.querySelector('[aria-controls="mobile-navigation"]').getAttribute("aria-expanded"),
    bodyLocked: document.body.dataset.menuOpen ?? null,
    focusReturned: document.activeElement === document.querySelector('[aria-controls="mobile-navigation"]'),
  }))()`);
  if (closedMenu.expanded !== "false" || closedMenu.bodyLocked !== null || !closedMenu.focusReturned) {
    throw new Error(`Mobile menu did not close accessibly: ${JSON.stringify(closedMenu)}`);
  }

  const themeBefore = await evaluate(`(() => {
    const button = document.querySelector('button[title*="theme"]');
    const rootStyle = getComputedStyle(document.documentElement);
    button.focus();
    return {
      theme: document.documentElement.dataset.theme,
      background: rootStyle.getPropertyValue("--background").trim(),
      surface: rootStyle.getPropertyValue("--surface-glass").trim(),
    };
  })()`);
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: " ",
    code: "Space",
    nativeVirtualKeyCode: 32,
    text: " ",
    unmodifiedText: " ",
    windowsVirtualKeyCode: 32,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: " ",
    code: "Space",
    windowsVirtualKeyCode: 32,
  });
  await pause(100);
  const themeAfter = await evaluate(`(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    return {
      theme: document.documentElement.dataset.theme,
      stored: localStorage.getItem("theme"),
      background: rootStyle.getPropertyValue("--background").trim(),
      surface: rootStyle.getPropertyValue("--surface-glass").trim(),
    };
  })()`);
  const themes = { before: themeBefore, after: themeAfter };
  if (
    themeBefore.theme === themeAfter.theme ||
    themeAfter.theme !== themeAfter.stored ||
    themeBefore.background === themeAfter.background ||
    themeBefore.surface === themeAfter.surface
  ) {
    throw new Error(`Theme toggle did not persist: ${JSON.stringify(themes)}`);
  }

  await evaluate(`document.querySelector('button[aria-label^="Copy email"]').focus()`);
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: " ",
    code: "Space",
    nativeVirtualKeyCode: 32,
    text: " ",
    unmodifiedText: " ",
    windowsVirtualKeyCode: 32,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: " ",
    code: "Space",
    windowsVirtualKeyCode: 32,
  });
  await pause(150);
  const copyEmail = await evaluate(`(() => {
    const button = document.querySelector("button[data-status]");
    const feedbackId = button?.getAttribute("aria-describedby");
    return {
      label: button?.getAttribute("aria-label"),
      feedback: feedbackId ? document.getElementById(feedbackId)?.textContent?.trim() : null,
    };
  })()`);
  if (!copyEmail.label?.startsWith("Copied") || !copyEmail.feedback?.includes("copied")) {
    throw new Error(`Copy email feedback failed: ${JSON.stringify(copyEmail)}`);
  }

  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 640,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate();
  const zoom200Equivalent = await evaluate(`(() => ({
    physicalWidth: 1280,
    effectiveCssWidth: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clippedControls: [...document.querySelectorAll("button, a")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) !== 0 &&
          (rect.left < -1 || rect.right > innerWidth + 1);
      })
      .length,
  }))()`);
  if (
    zoom200Equivalent.effectiveCssWidth !== 640 ||
    zoom200Equivalent.scrollWidth > zoom200Equivalent.effectiveCssWidth ||
    zoom200Equivalent.clippedControls > 0
  ) {
    throw new Error(`200% zoom equivalent did not reflow: ${JSON.stringify(zoom200Equivalent)}`);
  }

  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 320,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await navigate();
  const longText = await evaluate(`(async () => {
    const heading = document.querySelector("h1");
    const projectTitle = document.querySelector("[data-project-card] h3");
    heading.textContent = "GiselleAndradeFullStackDeveloperWithAnIntentionallyLongUnbrokenHeading";
    projectTitle.textContent = "AnIntentionallyLongUnbrokenProjectNameThatMustWrapWithoutOverflow";
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      headingRight: Math.round(heading.getBoundingClientRect().right),
      projectRight: Math.round(projectTitle.getBoundingClientRect().right),
    };
  })()`);
  if (
    longText.scrollWidth > longText.innerWidth ||
    longText.headingRight > longText.innerWidth + 1 ||
    longText.projectRight > longText.innerWidth + 1
  ) {
    throw new Error(`Long text caused overflow: ${JSON.stringify(longText)}`);
  }

  ignoreExpectedNetworkFailures = true;
  await client.send("Network.setBlockedURLs", {
    urls: ["*/_next/image?*", "*/images/*", "*/projects/*"],
  });
  await navigate();
  await pause(300);
  const missingImages = await evaluate(`(() => {
    const portrait = document.querySelector('img[alt="Portrait of Giselle Andrade"]');
    const projectFrame = document.querySelector("[data-project-card] img")?.parentElement;
    return {
      portraitAlt: portrait?.alt,
      portraitFrameHeight: Math.round(portrait?.parentElement?.getBoundingClientRect().height ?? 0),
      projectFrameHeight: Math.round(projectFrame?.getBoundingClientRect().height ?? 0),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
    };
  })()`);
  await client.send("Network.setBlockedURLs", { urls: [] });
  ignoreExpectedNetworkFailures = false;
  if (
    !missingImages.portraitAlt ||
    missingImages.portraitFrameHeight <= 0 ||
    missingImages.projectFrameHeight <= 0 ||
    missingImages.scrollWidth > missingImages.innerWidth
  ) {
    throw new Error(`Missing-image fallback lost content or layout: ${JSON.stringify(missingImages)}`);
  }

  await client.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  await navigate();
  const slowJavaScript = await evaluate(`(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    sectionCount: document.querySelectorAll("main > section").length,
    primaryActions: document.querySelectorAll('a[href="#projects"], a[href="#contact"]').length,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth,
  }))()`);
  await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  if (
    !slowJavaScript.h1 ||
    slowJavaScript.sectionCount !== 9 ||
    slowJavaScript.primaryActions < 2 ||
    slowJavaScript.scrollWidth > slowJavaScript.innerWidth
  ) {
    throw new Error(`Slow-JavaScript rendering failed: ${JSON.stringify(slowJavaScript)}`);
  }

  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate("about:blank");
  await navigate(`${baseUrl}/#projects`);
  await pause(1200);
  const hashNavigation = await evaluate(`(() => {
    const section = document.querySelector("#projects");
    const header = document.querySelector("header");
    const sectionRect = section.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    return {
      hash: location.hash,
      scrollY: Math.round(scrollY),
      sectionTop: Math.round(sectionRect.top),
      sectionBottom: Math.round(sectionRect.bottom),
      sectionVisible: sectionRect.top < innerHeight && sectionRect.bottom > 0,
      headerVisible: headerRect.top >= -1 && headerRect.bottom > 0,
      headingText: section.querySelector("h2")?.textContent?.trim() ?? "",
    };
  })()`);
  if (
    hashNavigation.hash !== "#projects" ||
    !hashNavigation.sectionVisible ||
    !hashNavigation.headerVisible ||
    !hashNavigation.headingText
  ) {
    throw new Error(`Hash navigation failed: ${JSON.stringify(hashNavigation)}`);
  }

  const projectFilter = await evaluate(`(async () => {
    const buttons = [...document.querySelectorAll('[aria-controls="project-list"]')];
    const javaButton = buttons.find((button) => button.textContent.trim() === "Java");
    javaButton.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const filteredCount = [...document.querySelectorAll("[data-project-card]")]
      .filter((card) => !card.hidden).length;
    const status = document.querySelector('[aria-live="polite"][role="status"]')?.textContent?.trim();
    const javaPressed = javaButton.getAttribute("aria-pressed");
    buttons.find((button) => button.textContent.trim() === "All").click();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const restoredCount = [...document.querySelectorAll("[data-project-card]")]
      .filter((card) => !card.hidden).length;
    return { filteredCount, restoredCount, status, javaPressed };
  })()`);
  if (
    projectFilter.filteredCount !== 1 ||
    projectFilter.restoredCount !== 6 ||
    projectFilter.javaPressed !== "true" ||
    !projectFilter.status?.includes("1 project in Java")
  ) {
    throw new Error(`Project filtering failed: ${JSON.stringify(projectFilter)}`);
  }

  if (screenshotPath) {
    if (Number.isFinite(screenshotOffset) && screenshotOffset !== 0) {
      await evaluate(`window.scrollBy({ top: ${screenshotOffset}, behavior: "instant" })`);
      await pause(100);
    }
    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));
  }

  await navigate("about:blank");
  await navigate(`${baseUrl}/#contact`);
  await pause(900);
  const contactValidation = await evaluate(`(async () => {
    const form = document.querySelector('form[aria-label="Email contact form"]');
    form.requestSubmit();
    await new Promise((resolve) => setTimeout(resolve, 50));
    const invalidFields = [...form.querySelectorAll('[aria-invalid="true"]')];
    const status = form.querySelector('[role="status"]')?.textContent?.trim() ?? "";
    return {
      invalidCount: invalidFields.length,
      invalidNames: invalidFields.map((field) => field.getAttribute("name")),
      status,
    };
  })()`);
  if (
    contactValidation.invalidCount !== 4 ||
    !contactValidation.invalidNames.includes("name") ||
    !contactValidation.invalidNames.includes("email") ||
    !contactValidation.invalidNames.includes("subject") ||
    !contactValidation.invalidNames.includes("message") ||
    !contactValidation.status.includes("review the highlighted fields")
  ) {
    throw new Error(`Contact validation failed: ${JSON.stringify(contactValidation)}`);
  }

  await navigate("about:blank");
  await navigate(`${baseUrl}/#process`);
  await evaluate(`document.querySelector("#process").scrollIntoView({ behavior: "instant", block: "start" })`);
  await pause(150);
  const processNavigation = await evaluate(`(() => ({
    stepCount: document.querySelectorAll("#process li").length,
    activeLabel: document.querySelector('nav[aria-label="Primary navigation"] [aria-current="location"]')?.textContent?.trim() ?? "",
    sectionPositions: [...document.querySelectorAll("main > section")].map((section) => ({
      id: section.id,
      top: Math.round(section.getBoundingClientRect().top),
      bottom: Math.round(section.getBoundingClientRect().bottom),
    })),
  }))()`);
  if (processNavigation.stepCount !== 6 || processNavigation.activeLabel !== "Journey") {
    throw new Error(`Process section or active navigation failed: ${JSON.stringify(processNavigation)}`);
  }

  await navigate("about:blank");
  await navigate(`${baseUrl}/#github`);
  await evaluate(`document.querySelector("#github").scrollIntoView({ behavior: "instant", block: "start" })`);
  await pause(150);
  const githubNavigation = await evaluate(`(() => ({
    activeLabel: document.querySelector('nav[aria-label="Primary navigation"] [aria-current="location"]')?.textContent?.trim() ?? "",
    githubVisible: document.querySelector("#github")?.getBoundingClientRect().top < innerHeight,
  }))()`);
  if (githubNavigation.activeLabel !== "Projects" || !githubNavigation.githubVisible) {
    throw new Error(`GitHub active navigation failed: ${JSON.stringify(githubNavigation)}`);
  }

  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await navigate();
  const reducedMotion = await evaluate(`(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    glowDisplay: getComputedStyle(document.querySelector('.pointerGlow')).display,
    pendingReveal: document.querySelectorAll('[data-reveal-state="pending"]').length,
  }))()`);
  if (
    reducedMotion.scrollBehavior !== "auto" ||
    reducedMotion.glowDisplay !== "none" ||
    reducedMotion.pendingReveal !== 0
  ) {
    throw new Error(`Reduced-motion behavior failed: ${JSON.stringify(reducedMotion)}`);
  }

  await client.send("Emulation.setEmulatedMedia", { features: [] });

  const failedViewports = results.filter((result) => result.failures.length > 0);
  if (failedViewports.length || consoleErrors.length || networkErrors.length) {
    throw new Error(
      JSON.stringify({ failedViewports, consoleErrors, networkErrors }, null, 2),
    );
  }

  console.log(JSON.stringify({
    viewports: results,
    menu: { openMenu, closedMenu },
    themes,
    copyEmail,
    zoom200Equivalent,
    longText,
    missingImages,
    slowJavaScript,
    hashNavigation,
    projectFilter,
    contactValidation,
    processNavigation,
    githubNavigation,
    reducedMotion,
  }, null, 2));
  client.close();
  await fetch(`${debugUrl}/json/close/${target.id}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
