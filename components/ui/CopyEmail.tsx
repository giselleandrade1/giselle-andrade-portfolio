"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

export type CopyEmailProps = {
  email: string;
};

type CopyStatus = "idle" | "copying" | "copied" | "error";

function copyWithFallback(value: string): boolean {
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto 0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
    activeElement?.focus();
  }
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall back for denied clipboard permissions and non-secure contexts.
    }
  }

  if (!copyWithFallback(value)) {
    throw new Error("Clipboard access is unavailable.");
  }
}

export function CopyEmail({ email }: CopyEmailProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<number | null>(null);
  const feedbackId = useId();

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  async function handleCopy() {
    if (status === "copying") return;

    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    setStatus("copying");

    try {
      await copyToClipboard(email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    resetTimer.current = window.setTimeout(() => setStatus("idle"), 2800);
  }

  const visibleLabel =
    status === "copying"
      ? "Copying…"
      : status === "copied"
        ? "Copied"
        : status === "error"
          ? "Try again"
          : "Copy email";
  const feedback =
    status === "copied"
      ? "Email address copied to the clipboard."
      : status === "error"
        ? "The email address could not be copied. Please try again."
        : "";

  return (
    <span className={styles.copyEmail}>
      <button
        aria-describedby={feedbackId}
        aria-label={`${visibleLabel}: ${email}`}
        className={styles.copyButton}
        data-status={status}
        disabled={status === "copying"}
        onClick={handleCopy}
        type="button"
      >
        <Icon name={status === "copied" ? "check" : "copy"} size="md" />
        <span aria-hidden="true">{visibleLabel}</span>
      </button>
      <span
        aria-atomic="true"
        aria-live="polite"
        className={styles.srOnly}
        id={feedbackId}
        role="status"
      >
        {feedback}
      </span>
    </span>
  );
}
