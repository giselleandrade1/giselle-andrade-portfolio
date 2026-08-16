import { mkdir, writeFile } from "node:fs/promises";

const requestedBaseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const siteOrigin = new URL(requestedBaseUrl).origin;
const locales = ["en-US", "pt-BR", "es-ES"];
const defaultLocale = "en-US";
const localizedUrl = (locale = defaultLocale, hash = "") => `${siteOrigin}/${locale}${hash}`;
const baseUrl = localizedUrl();
const debugUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9223";
const screenshotPath = process.env.SCREENSHOT_PATH;
const screenshotDirectory = process.env.SCREENSHOT_DIR;
const screenshotOffset = Number(process.env.SCREENSHOT_OFFSET ?? 0);
const sectionScreenshotDirectory = process.env.SECTION_SCREENSHOT_DIR;
const sectionScreenshotWidth = Number(process.env.SECTION_SCREENSHOT_WIDTH ?? 1440);
const sectionScreenshotHeight = Number(process.env.SECTION_SCREENSHOT_HEIGHT ?? 900);
const sectionScreenshotTheme = process.env.SECTION_SCREENSHOT_THEME;
const sectionScreenshotLocale = locales.includes(process.env.SECTION_SCREENSHOT_LOCALE)
  ? process.env.SECTION_SCREENSHOT_LOCALE
  : defaultLocale;

const localeExpectations = {
  "en-US": {
    greeting: "Hello, I'm",
    home: "Home",
    resume: "Resume",
    formLabel: "Email contact form",
    closeMenu: "Close navigation menu",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    flag: "/icons/flags/us.svg",
    title: "Giselle Andrade | Full Stack Developer",
  },
  "pt-BR": {
    greeting: "Olá, eu sou",
    home: "Início",
    resume: "Currículo",
    formLabel: "Formulário de contato por e-mail",
    closeMenu: "Fechar menu de navegação",
    themeToDark: "Mudar para o tema escuro",
    themeToLight: "Mudar para o tema claro",
    flag: "/icons/flags/br.svg",
    title: "Giselle Andrade | Desenvolvedora Full Stack",
  },
  "es-ES": {
    greeting: "Hola, soy",
    home: "Inicio",
    resume: "Currículum",
    formLabel: "Formulario de contacto por correo electrónico",
    closeMenu: "Cerrar menú de navegación",
    themeToDark: "Cambiar al tema oscuro",
    themeToLight: "Cambiar al tema claro",
    flag: "/icons/flags/es.svg",
    title: "Giselle Andrade | Desarrolladora Full Stack",
  },
};

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
  client.on("Runtime.consoleAPICalled", (event) => {
    if (event.type !== "error") return;
    consoleErrors.push(
      event.args
        .map((argument) => argument.value ?? argument.description ?? "Unknown console error")
        .join(" "),
    );
  });
  client.on("Log.entryAdded", (event) => {
    if (event.entry.level === "error") consoleErrors.push(event.entry.text);
  });
  client.on("Network.responseReceived", (event) => {
    if (event.response.status >= 400 && event.response.url.startsWith(siteOrigin)) {
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

  const ssrLocales = [];
  for (const locale of locales) {
    const response = await fetch(localizedUrl(locale), {
      headers: { cookie: `locale=${locale}` },
    });
    const html = await response.text();
    const redirectResponse = await fetch(siteOrigin, {
      headers: { cookie: `locale=${locale}` },
      redirect: "manual",
    });
    const redirectLocation = redirectResponse.headers.get("location");
    const audit = {
      locale,
      status: response.status,
      hasLang: html.includes(`lang="${locale}"`),
      hasTitle: html.includes(localeExpectations[locale].title),
      alternateCount: (html.match(/hreflang=/gi) ?? []).length,
      redirectStatus: redirectResponse.status,
      redirectLocation,
    };
    ssrLocales.push(audit);

    if (
      audit.status !== 200 ||
      !audit.hasLang ||
      !audit.hasTitle ||
      audit.alternateCount < 4 ||
      ![307, 308].includes(audit.redirectStatus) ||
      !redirectLocation?.endsWith(`/${locale}`)
    ) {
      throw new Error(`Localized SSR or preference redirect failed: ${JSON.stringify(audit)}`);
    }
  }

  const results = [];

  if (screenshotDirectory) await mkdir(screenshotDirectory, { recursive: true });

  for (const locale of locales) {
    const expectation = localeExpectations[locale];

    for (const [width, height] of viewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 768,
      });
      await navigate(localizedUrl(locale));

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
          return {
            isCompactHeaderControl: button.matches("[data-theme-toggle], [data-language-toggle]"),
            label: button.getAttribute("aria-label") || button.textContent.trim(),
            width: rect.width,
            height: rect.height,
          };
        })
        .filter((button) => {
          const minimum = button.isCompactHeaderControl && innerWidth >= 992 ? 36 : 44;
          return button.width < minimum || button.height < minimum;
        });
      const heroCopy = document.querySelector("[data-hero-copy]");
      const heroVisual = document.querySelector("[data-hero-visual]");
      const heroHeadline = heroCopy?.querySelector("p:last-child");
      const portrait = document.querySelector("[data-portrait]");
      const headlineRect = heroHeadline?.getBoundingClientRect();
      const visualRect = heroVisual?.getBoundingClientRect();
      const portraitRect = portrait?.getBoundingClientRect();
      const mobileHero = {
        domOrder: heroCopy?.nextElementSibling === heroVisual,
        headlineToVisualGap: headlineRect && visualRect
          ? Math.round(visualRect.top - headlineRect.bottom)
          : null,
        portraitWidth: portraitRect ? Math.round(portraitRect.width) : null,
      };
      const typeScale = {
        hero: Number.parseFloat(getComputedStyle(document.querySelector("h1")).fontSize),
        section: Number.parseFloat(getComputedStyle(document.querySelector("#about h2")).fontSize),
        contact: Number.parseFloat(getComputedStyle(document.querySelector("#contact h2")).fontSize),
      };
      const themeButton = document.querySelector("[data-theme-toggle]");
      const languageButton = document.querySelector("[data-language-toggle]");
      const headerActions = themeButton?.parentElement;
      const actionChildren = headerActions ? [...headerActions.children] : [];
      const languageRoot = languageButton?.parentElement;
      const resume = headerActions?.querySelector("a[download]");
      const menu = headerActions?.querySelector('[aria-controls="mobile-navigation"]');
      const prose = document.querySelector("#about h2")?.parentElement?.querySelector("p");
      const proseStyle = prose ? getComputedStyle(prose) : null;
      const languageFlag = languageButton?.querySelector("img");
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
        mobileHero,
        typeScale,
        localeCopy: {
          greeting: document.querySelector("[data-hero-copy] > p")?.textContent?.trim(),
          home: document.querySelector('nav a[href="#home"]')?.textContent?.trim(),
          resume: resume?.textContent?.trim(),
          formLabel: document.querySelector("form")?.getAttribute("aria-label"),
          flagPath: languageFlag ? new URL(languageFlag.src).pathname : null,
        },
        languageButtonCount: document.querySelectorAll("[data-language-toggle]").length,
        headerOrder: {
          theme: actionChildren.indexOf(themeButton),
          language: actionChildren.indexOf(languageRoot),
          resume: actionChildren.indexOf(resume),
          menu: actionChildren.indexOf(menu),
          resumeVisible: resume ? visible(resume) : false,
          menuVisible: menu ? visible(menu) : false,
        },
        prose: {
          textAlign: proseStyle?.textAlign,
          textAlignLast: proseStyle?.textAlignLast,
          hyphens: proseStyle?.hyphens,
          overflowWrap: proseStyle?.overflowWrap,
          wordBreak: proseStyle?.wordBreak,
        },
      };
    })()`);

    const failures = [];
    if (audit.scrollWidth > audit.innerWidth) failures.push(`scrollWidth ${audit.scrollWidth} > ${audit.innerWidth}`);
    if (audit.overflow.length) failures.push(`overflowing elements: ${JSON.stringify(audit.overflow)}`);
    if (audit.lang !== locale) failures.push(`lang is ${audit.lang}, expected ${locale}`);
    if (audit.h1Count !== 1) failures.push(`expected one h1, found ${audit.h1Count}`);
    if (!audit.hasMain) failures.push("main landmark missing");
    if (audit.headingJumps) failures.push(`${audit.headingJumps} heading-level jumps`);
    if (audit.unsafeExternalLinks) failures.push(`${audit.unsafeExternalLinks} unsafe external links`);
    if (audit.brokenImages.length) failures.push(`broken images: ${audit.brokenImages.join(", ")}`);
    if (audit.smallButtons.length) failures.push(`small buttons: ${JSON.stringify(audit.smallButtons)}`);
    if (audit.typeScale.hero > 104.5) failures.push(`hero heading is ${audit.typeScale.hero}px`);
    if (audit.typeScale.section > 60.5) failures.push(`section heading is ${audit.typeScale.section}px`);
    if (audit.typeScale.contact > 84.5) failures.push(`contact heading is ${audit.typeScale.contact}px`);
    if (audit.languageButtonCount !== 1) failures.push(`expected one language button, found ${audit.languageButtonCount}`);
    if (audit.localeCopy.greeting !== expectation.greeting) failures.push(`greeting is ${audit.localeCopy.greeting}`);
    if (audit.localeCopy.home !== expectation.home) failures.push(`home label is ${audit.localeCopy.home}`);
    if (audit.localeCopy.formLabel !== expectation.formLabel) failures.push(`form label is ${audit.localeCopy.formLabel}`);
    if (audit.localeCopy.flagPath !== expectation.flag) failures.push(`flag is ${audit.localeCopy.flagPath}`);
    if (
      audit.prose.textAlign !== "justify" ||
      audit.prose.textAlignLast !== "left" ||
      audit.prose.hyphens !== "auto" ||
      audit.prose.overflowWrap !== "break-word" ||
      audit.prose.wordBreak !== "normal"
    ) {
      failures.push(`prose alignment is ${JSON.stringify(audit.prose)}`);
    }
    if (width >= 1180) {
      if (
        !(audit.headerOrder.theme < audit.headerOrder.language && audit.headerOrder.language < audit.headerOrder.resume) ||
        !audit.headerOrder.resumeVisible ||
        audit.headerOrder.menuVisible ||
        audit.localeCopy.resume !== expectation.resume
      ) {
        failures.push(`desktop header order is ${JSON.stringify(audit.headerOrder)}`);
      }
    } else if (
      !(audit.headerOrder.theme < audit.headerOrder.language && audit.headerOrder.language < audit.headerOrder.menu) ||
      audit.headerOrder.resumeVisible ||
      !audit.headerOrder.menuVisible
    ) {
      failures.push(`mobile header order is ${JSON.stringify(audit.headerOrder)}`);
    }
    if (width <= 768) {
      const portraitRanges = {
        320: [220, 250],
        375: [240, 280],
        480: [280, 330],
        768: [320, 390],
      };
      const [minimumPortrait, maximumPortrait] = portraitRanges[width];
      if (!audit.mobileHero.domOrder) failures.push("hero visual is not immediately after the headline group in the DOM");
      if (
        audit.mobileHero.headlineToVisualGap === null ||
        audit.mobileHero.headlineToVisualGap < 0 ||
        audit.mobileHero.headlineToVisualGap > 56
      ) {
        failures.push(`headline-to-photo gap is ${audit.mobileHero.headlineToVisualGap}px`);
      }
      if (
        audit.mobileHero.portraitWidth === null ||
        audit.mobileHero.portraitWidth < minimumPortrait ||
        audit.mobileHero.portraitWidth > maximumPortrait
      ) {
        failures.push(`portrait width is ${audit.mobileHero.portraitWidth}px`);
      }
    }
    results.push({ locale, width, height, failures });

    if (screenshotDirectory) {
      await pause(700);
      const screenshot = await client.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      await writeFile(
        `${screenshotDirectory}/${locale}-${width}x${height}.png`,
        Buffer.from(screenshot.data, "base64"),
      );
      }
    }
  }

  if (sectionScreenshotDirectory) {
    await mkdir(sectionScreenshotDirectory, { recursive: true });
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: sectionScreenshotWidth,
      height: sectionScreenshotHeight,
      deviceScaleFactor: 1,
      mobile: sectionScreenshotWidth < 768,
    });
    await navigate(localizedUrl(sectionScreenshotLocale));

    if (sectionScreenshotTheme === "dark" || sectionScreenshotTheme === "light") {
      await evaluate(`(() => {
        const desiredTheme = ${JSON.stringify(sectionScreenshotTheme)};
        if (document.documentElement.dataset.theme !== desiredTheme) {
          document.querySelector("button[data-theme-toggle]").click();
        }
      })()`);
      await pause(300);
    }

    const sectionIds = await evaluate(`[
      ...document.querySelectorAll("main > section[id]")
    ].map((section) => section.id)`);

    for (const sectionId of sectionIds) {
      await evaluate(`(() => {
        document.documentElement.style.scrollBehavior = "auto";
        document.getElementById(${JSON.stringify(sectionId)}).scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      })()`);
      await pause(700);
      const screenshot = await client.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
      });
      await writeFile(
        `${sectionScreenshotDirectory}/${sectionScreenshotLocale}-${sectionId}.png`,
        Buffer.from(screenshot.data, "base64"),
      );
    }
  }

  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 320,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await navigate();
  await pause(500);

  await evaluate(`document.querySelector('[aria-controls="mobile-navigation"]').focus()`);
  await evaluate(`document.activeElement.click()`);
  await pause(350);
  const openMenu = await evaluate(`(() => ({
    expanded: document.querySelector('[aria-controls="mobile-navigation"]').getAttribute("aria-expanded"),
    bodyLocked: document.body.dataset.menuOpen,
    dialogVisible: getComputedStyle(document.querySelector('[role="dialog"]')).visibility !== "hidden",
    focusedLabel: document.activeElement?.getAttribute("aria-label"),
    backgroundInert: [document.querySelector("[data-header-bar]"), document.querySelector("main"), document.querySelector("footer")]
      .every((region) => region?.inert),
  }))()`);
  if (
    openMenu.expanded !== "true" ||
    openMenu.bodyLocked !== "true" ||
    !openMenu.dialogVisible ||
    !openMenu.backgroundInert ||
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

  await evaluate(`document.querySelector(".skipLink").focus()`);
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
  await pause(100);
  const skipLink = await evaluate(`(() => ({
    hash: location.hash,
    activeId: document.activeElement?.id,
  }))()`);
  if (skipLink.hash !== "#main-content" || skipLink.activeId !== "main-content") {
    throw new Error(`Skip link did not move focus to main content: ${JSON.stringify(skipLink)}`);
  }

  await evaluate(`localStorage.removeItem("theme")`);
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "light" }],
  });
  await navigate();

  async function readThemeState() {
    return evaluate(`(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      const buttons = [...document.querySelectorAll("button[data-theme-toggle]")];
      const button = buttons[0];
      const icons = button ? [...button.querySelectorAll("svg")].map((icon) => icon.parentElement) : [];
      const rect = button?.getBoundingClientRect();
      return {
        theme: document.documentElement.dataset.theme,
        resolved: document.documentElement.dataset.resolvedTheme,
        device: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
        colorScheme: document.documentElement.style.colorScheme,
        stored: localStorage.getItem("theme"),
        buttonCount: buttons.length,
        legacyOptionCount: document.querySelectorAll('[data-theme-selector], input[name="theme-preference"]').length,
        tagName: button?.tagName,
        label: button?.getAttribute("aria-label"),
        title: button?.getAttribute("title"),
        targetWidth: rect?.width ?? 0,
        targetHeight: rect?.height ?? 0,
        sunOpacity: icons[0] ? Number.parseFloat(getComputedStyle(icons[0]).opacity) : null,
        moonOpacity: icons[1] ? Number.parseFloat(getComputedStyle(icons[1]).opacity) : null,
        background: rootStyle.getPropertyValue("--background").trim(),
        surface: rootStyle.getPropertyValue("--surface-glass").trim(),
        themeColors: [...document.querySelectorAll('meta[name="theme-color"]')]
          .map((meta) => meta.getAttribute("content")),
      };
    })()`);
  }

  async function waitForThemeState(expected, label) {
    let state;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      state = await readThemeState();
      if (Object.entries(expected).every(([key, value]) => state[key] === value)) {
        await pause(400);
        return readThemeState();
      }
      await pause(50);
    }
    throw new Error(`${label}: ${JSON.stringify(state)}`);
  }

  await pause(300);
  const initialSystemLight = await readThemeState();
  if (
    initialSystemLight.theme !== "light" ||
    initialSystemLight.resolved !== "light" ||
    initialSystemLight.device !== "light" ||
    initialSystemLight.colorScheme !== "light" ||
    initialSystemLight.stored !== null ||
    initialSystemLight.buttonCount !== 1 ||
    initialSystemLight.legacyOptionCount !== 0 ||
    initialSystemLight.tagName !== "BUTTON" ||
    initialSystemLight.label !== "Switch to dark theme" ||
    initialSystemLight.title !== initialSystemLight.label ||
    initialSystemLight.targetWidth < 44 ||
    initialSystemLight.targetHeight < 44 ||
    initialSystemLight.sunOpacity > 0.01 ||
    initialSystemLight.moonOpacity < 0.99 ||
    initialSystemLight.background !== "#f6f8fc" ||
    initialSystemLight.surface === "#050c18d6" ||
    initialSystemLight.themeColors.length === 0 ||
    initialSystemLight.themeColors.some((color) => color !== "#f6f8fc")
  ) {
    throw new Error(`Initial system light theme failed: ${JSON.stringify(initialSystemLight)}`);
  }

  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "dark" }],
  });
  const initialSystemDark = await waitForThemeState(
    { theme: "dark", resolved: "dark", device: "dark", colorScheme: "dark", stored: null },
    "Theme did not follow the device before a manual choice",
  );
  if (
    initialSystemDark.label !== "Switch to light theme" ||
    initialSystemDark.title !== initialSystemDark.label ||
    initialSystemDark.buttonCount !== 1 ||
    initialSystemDark.sunOpacity < 0.99 ||
    initialSystemDark.moonOpacity > 0.01 ||
    initialSystemDark.background !== "#030711" ||
    initialSystemDark.surface === initialSystemLight.surface ||
    initialSystemDark.themeColors.length === 0 ||
    initialSystemDark.themeColors.some((color) => color !== "#030711")
  ) {
    throw new Error(`Initial system dark theme failed: ${JSON.stringify(initialSystemDark)}`);
  }

  await evaluate(`document.querySelector("button[data-theme-toggle]").focus()`);
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
  const explicitLight = await waitForThemeState(
    { theme: "light", resolved: "light", device: "dark", stored: "light" },
    "Explicit light theme did not apply",
  );
  if (
    explicitLight.colorScheme !== "light" ||
    explicitLight.background !== "#f6f8fc" ||
    explicitLight.label !== "Switch to dark theme" ||
    explicitLight.title !== explicitLight.label ||
    explicitLight.sunOpacity > 0.01 ||
    explicitLight.moonOpacity < 0.99 ||
    explicitLight.themeColors.length === 0 ||
    explicitLight.themeColors.some((color) => color !== "#f6f8fc")
  ) {
    throw new Error(`Explicit light theme failed: ${JSON.stringify(explicitLight)}`);
  }

  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "light" }],
  });
  const lightOverrideOnLightSystem = await waitForThemeState(
    { theme: "light", resolved: "light", device: "light", stored: "light" },
    "Light override was lost when the device changed to light",
  );
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "dark" }],
  });
  const lightOverrideOnDarkSystem = await waitForThemeState(
    { theme: "light", resolved: "light", device: "dark", stored: "light" },
    "Light override was lost when the device changed to dark",
  );

  await navigate();
  const persistedLight = await waitForThemeState(
    {
      theme: "light",
      resolved: "light",
      device: "dark",
      stored: "light",
      label: "Switch to dark theme",
    },
    "Persisted light state did not settle",
  );
  if (
    persistedLight.theme !== "light" ||
    persistedLight.resolved !== "light" ||
    persistedLight.device !== "dark" ||
    persistedLight.stored !== "light" ||
    persistedLight.label !== "Switch to dark theme" ||
    persistedLight.buttonCount !== 1
  ) {
    throw new Error(`Explicit theme did not persist after navigation: ${JSON.stringify(persistedLight)}`);
  }

  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "light" }],
  });
  await waitForThemeState(
    { theme: "light", resolved: "light", device: "light", stored: "light" },
    "Persisted light override was lost when the device changed",
  );
  await evaluate(`document.querySelector("button[data-theme-toggle]").click()`);
  const explicitDark = await waitForThemeState(
    { theme: "dark", resolved: "dark", device: "light", stored: "dark" },
    "Explicit dark theme did not apply",
  );
  if (
    explicitDark.colorScheme !== "dark" ||
    explicitDark.background !== "#030711" ||
    explicitDark.label !== "Switch to light theme" ||
    explicitDark.title !== explicitDark.label ||
    explicitDark.sunOpacity < 0.99 ||
    explicitDark.moonOpacity > 0.01 ||
    explicitDark.themeColors.length === 0 ||
    explicitDark.themeColors.some((color) => color !== "#030711")
  ) {
    throw new Error(`Explicit dark theme failed: ${JSON.stringify(explicitDark)}`);
  }

  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "dark" }],
  });
  const darkOverrideOnDarkSystem = await waitForThemeState(
    { theme: "dark", resolved: "dark", device: "dark", stored: "dark" },
    "Dark override was lost when the device changed to dark",
  );
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "light" }],
  });
  const darkOverrideOnLightSystem = await waitForThemeState(
    { theme: "dark", resolved: "dark", device: "light", stored: "dark" },
    "Dark override was lost when the device changed to light",
  );

  await navigate();
  const persistedDark = await waitForThemeState(
    {
      theme: "dark",
      resolved: "dark",
      device: "light",
      stored: "dark",
      label: "Switch to light theme",
    },
    "Persisted dark state did not settle",
  );
  if (
    persistedDark.theme !== "dark" ||
    persistedDark.resolved !== "dark" ||
    persistedDark.device !== "light" ||
    persistedDark.stored !== "dark" ||
    persistedDark.label !== "Switch to light theme"
  ) {
    throw new Error(`Dark theme did not persist after refresh: ${JSON.stringify(persistedDark)}`);
  }

  await evaluate(`localStorage.removeItem("theme")`);
  await navigate();
  const freshSystemLight = await waitForThemeState(
    { theme: "light", device: "light", stored: null, label: "Switch to dark theme" },
    "Fresh system light state did not settle",
  );
  if (
    freshSystemLight.theme !== "light" ||
    freshSystemLight.device !== "light" ||
    freshSystemLight.stored !== null ||
    freshSystemLight.label !== "Switch to dark theme"
  ) {
    throw new Error(`Fresh system light session failed: ${JSON.stringify(freshSystemLight)}`);
  }

  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "dark" }],
  });
  await navigate();
  const freshSystemDark = await waitForThemeState(
    { theme: "dark", device: "dark", stored: null, label: "Switch to light theme" },
    "Fresh system dark state did not settle",
  );
  if (
    freshSystemDark.theme !== "dark" ||
    freshSystemDark.resolved !== "dark" ||
    freshSystemDark.device !== "dark" ||
    freshSystemDark.stored !== null ||
    freshSystemDark.label !== "Switch to light theme" ||
    freshSystemDark.background !== "#030711" ||
    freshSystemDark.themeColors.length === 0 ||
    freshSystemDark.themeColors.some((color) => color !== "#030711")
  ) {
    throw new Error(`Fresh system dark session failed: ${JSON.stringify(freshSystemDark)}`);
  }

  const themes = {
    initialSystemLight,
    initialSystemDark,
    explicitLight,
    lightOverrideOnLightSystem,
    lightOverrideOnDarkSystem,
    persistedLight,
    explicitDark,
    darkOverrideOnDarkSystem,
    darkOverrideOnLightSystem,
    persistedDark,
    freshSystemLight,
    freshSystemDark,
  };

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
  await navigate(`${baseUrl}#projects`);
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
  await navigate(`${baseUrl}#contact`);
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
  await navigate(`${baseUrl}#process`);
  await evaluate(`document.querySelector("#process").scrollIntoView({ behavior: "instant", block: "start" })`);
  await pause(500);
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
  await navigate(`${baseUrl}#github`);
  await evaluate(`(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.querySelector("#github").scrollIntoView({ behavior: "instant", block: "start" });
  })()`);
  await pause(500);
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

  async function readLocaleState() {
    return evaluate(`(() => {
      const button = document.querySelector("[data-language-toggle]");
      const flag = button?.querySelector("img");
      return {
        pathname: location.pathname,
        hash: location.hash,
        lang: document.documentElement.lang,
        stored: localStorage.getItem("locale"),
        navigationPending: sessionStorage.getItem("portfolio:locale-navigation"),
        cookie: document.cookie,
        greeting: document.querySelector("[data-hero-copy] > p")?.textContent?.trim(),
        buttonCount: document.querySelectorAll("[data-language-toggle]").length,
        expanded: button?.getAttribute("aria-expanded"),
        flagPath: flag ? new URL(flag.src).pathname : null,
        theme: document.documentElement.dataset.theme,
        themeLabel: document.querySelector("[data-theme-toggle]")?.getAttribute("aria-label"),
        scrollY: Math.round(scrollY),
        innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    })()`);
  }

  async function waitForLocale(expectedLocale, label) {
    let state;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      state = await readLocaleState();
      const expectation = localeExpectations[expectedLocale];
      if (
        state.pathname === `/${expectedLocale}` &&
        state.lang === expectedLocale &&
        state.greeting === expectation.greeting &&
        state.flagPath === expectation.flag
      ) {
        return state;
      }
      await pause(50);
    }
    throw new Error(`${label}: ${JSON.stringify(state)}`);
  }

  async function selectLocaleByClick(locale) {
    await evaluate(`document.querySelector("[data-language-toggle]").click()`);
    await pause(80);
    await evaluate(`document.querySelector('[role="menuitemradio"][lang=${JSON.stringify(locale)}]').click()`);
    await waitForLocale(locale, `Locale ${locale} did not apply`);
    let state;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      state = await readLocaleState();
      if (state.navigationPending === null) return state;
      await pause(50);
    }
    throw new Error(`Locale navigation state was not restored: ${JSON.stringify(state)}`);
  }

  await evaluate(`(() => {
    localStorage.removeItem("locale");
    document.cookie = "locale=; Path=/; Max-Age=0; SameSite=Lax";
  })()`);
  await navigate(siteOrigin);
  const defaultLocaleState = await waitForLocale("en-US", "The first visit did not use en-US");
  if (defaultLocaleState.buttonCount !== 1 || !defaultLocaleState.cookie.includes("locale=en-US")) {
    throw new Error(`Default locale state failed: ${JSON.stringify(defaultLocaleState)}`);
  }

  await navigate("about:blank");
  await navigate(localizedUrl("en-US", "#about"));
  await evaluate(`(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.querySelector("#about").scrollIntoView({ behavior: "instant", block: "start" });
  })()`);
  const scrollBeforeLocaleChange = await evaluate(`Math.round(scrollY)`);
  const portugueseAfterSelection = await selectLocaleByClick("pt-BR");
  if (
    portugueseAfterSelection.hash !== "#about" ||
    portugueseAfterSelection.scrollY < Math.max(80, scrollBeforeLocaleChange * 0.45) ||
    portugueseAfterSelection.stored !== "pt-BR" ||
    !portugueseAfterSelection.cookie.includes("locale=pt-BR")
  ) {
    throw new Error(`Locale change did not preserve state: ${JSON.stringify({ scrollBeforeLocaleChange, portugueseAfterSelection })}`);
  }

  await evaluate(`document.querySelector("[data-language-toggle]").focus()`);
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowDown", code: "ArrowDown" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowDown", code: "ArrowDown" });
  await pause(100);
  const keyboardOpen = await evaluate(`(() => ({
    expanded: document.querySelector("[data-language-toggle]")?.getAttribute("aria-expanded"),
    optionCount: document.querySelectorAll('[role="menuitemradio"]').length,
    focusedRole: document.activeElement?.getAttribute("role"),
  }))()`);
  if (keyboardOpen.expanded !== "true" || keyboardOpen.optionCount !== 3 || keyboardOpen.focusedRole !== "menuitemradio") {
    throw new Error(`Language menu keyboard open failed: ${JSON.stringify(keyboardOpen)}`);
  }
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  await pause(80);
  const keyboardEscape = await evaluate(`(() => ({
    expanded: document.querySelector("[data-language-toggle]")?.getAttribute("aria-expanded"),
    focusReturned: document.activeElement === document.querySelector("[data-language-toggle]"),
  }))()`);
  if (keyboardEscape.expanded !== "false" || !keyboardEscape.focusReturned) {
    throw new Error(`Language menu Escape failed: ${JSON.stringify(keyboardEscape)}`);
  }

  await evaluate(`document.querySelector("[data-language-toggle]").click()`);
  await evaluate(`document.querySelector("main").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))`);
  await pause(80);
  const clickOutside = await evaluate(`(() => ({
    expanded: document.querySelector("[data-language-toggle]")?.getAttribute("aria-expanded"),
    menuExists: Boolean(document.querySelector('[role="menu"]')),
  }))()`);
  if (clickOutside.expanded !== "false" || clickOutside.menuExists) {
    throw new Error(`Language menu click-outside failed: ${JSON.stringify(clickOutside)}`);
  }

  await evaluate(`document.querySelector("[data-language-toggle]").focus()`);
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown", key: " ", code: "Space", nativeVirtualKeyCode: 32,
    text: " ", unmodifiedText: " ", windowsVirtualKeyCode: 32,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32,
  });
  await pause(100);
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "End", code: "End" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "End", code: "End" });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyDown", key: "Enter", code: "Enter", nativeVirtualKeyCode: 13,
    text: "\r", unmodifiedText: "\r", windowsVirtualKeyCode: 13,
  });
  await client.send("Input.dispatchKeyEvent", {
    type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13,
  });
  const spanishAfterKeyboard = await waitForLocale("es-ES", "Keyboard locale selection did not apply");
  if (spanishAfterKeyboard.stored !== "es-ES" || !spanishAfterKeyboard.cookie.includes("locale=es-ES")) {
    throw new Error(`Keyboard locale persistence failed: ${JSON.stringify(spanishAfterKeyboard)}`);
  }

  const themeLocaleCombinations = [];
  for (const locale of locales) {
    await navigate(localizedUrl(locale));
    for (const theme of ["dark", "light"]) {
      await evaluate(`(() => {
        if (document.documentElement.dataset.theme !== ${JSON.stringify(theme)}) {
          document.querySelector("[data-theme-toggle]").click();
        }
      })()`);
      const state = await waitForThemeState(
        { theme, stored: theme },
        `${theme} + ${locale} did not apply`,
      );
      const localeState = await readLocaleState();
      const expectedThemeLabel = theme === "dark"
        ? localeExpectations[locale].themeToLight
        : localeExpectations[locale].themeToDark;
      const combination = {
        locale,
        theme,
        lang: localeState.lang,
        label: state.label,
        scrollWidth: localeState.scrollWidth,
        innerWidth: localeState.innerWidth,
      };
      themeLocaleCombinations.push(combination);
      if (
        combination.lang !== locale ||
        combination.label !== expectedThemeLabel ||
        combination.scrollWidth > combination.innerWidth
      ) {
        throw new Error(`Theme and locale combination failed: ${JSON.stringify(combination)}`);
      }
    }
  }

  await selectLocaleByClick("pt-BR");
  await evaluate(`(() => {
    if (document.documentElement.dataset.theme !== "dark") {
      document.querySelector("[data-theme-toggle]").click();
    }
  })()`);
  await waitForThemeState({ theme: "dark", stored: "dark" }, "Dark Portuguese setup failed");
  await navigate(siteOrigin);
  const persistedDarkPortuguese = await waitForLocale("pt-BR", "Dark Portuguese locale did not persist");
  if (
    persistedDarkPortuguese.theme !== "dark" ||
    persistedDarkPortuguese.stored !== "pt-BR" ||
    persistedDarkPortuguese.themeLabel !== localeExpectations["pt-BR"].themeToLight
  ) {
    throw new Error(`Dark + Portuguese persistence failed: ${JSON.stringify(persistedDarkPortuguese)}`);
  }

  await selectLocaleByClick("es-ES");
  await evaluate(`(() => {
    if (document.documentElement.dataset.theme !== "light") {
      document.querySelector("[data-theme-toggle]").click();
    }
  })()`);
  await waitForThemeState({ theme: "light", stored: "light" }, "Light Spanish setup failed");
  await navigate(siteOrigin);
  const persistedLightSpanish = await waitForLocale("es-ES", "Light Spanish locale did not persist");
  if (
    persistedLightSpanish.theme !== "light" ||
    persistedLightSpanish.stored !== "es-ES" ||
    persistedLightSpanish.themeLabel !== localeExpectations["es-ES"].themeToDark
  ) {
    throw new Error(`Light + Spanish persistence failed: ${JSON.stringify(persistedLightSpanish)}`);
  }

  const failedViewports = results.filter((result) => result.failures.length > 0);
  if (failedViewports.length || consoleErrors.length || networkErrors.length) {
    throw new Error(
      JSON.stringify({ failedViewports, consoleErrors, networkErrors }, null, 2),
    );
  }

  console.log(JSON.stringify({
    ssrLocales,
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
    language: {
      defaultLocaleState,
      portugueseAfterSelection,
      keyboardOpen,
      keyboardEscape,
      clickOutside,
      spanishAfterKeyboard,
      persistedDarkPortuguese,
      persistedLightSpanish,
    },
    themeLocaleCombinations,
  }, null, 2));
  client.close();
  await fetch(`${debugUrl}/json/close/${target.id}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
