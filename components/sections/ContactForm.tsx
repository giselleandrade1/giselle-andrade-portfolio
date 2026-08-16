"use client";

import { useId, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";

import { Icon } from "@/components/ui/Icon";
import type { Messages } from "@/i18n";

import styles from "./contact-form.module.css";

type ContactFormProps = {
  email: string;
  messages: Messages["contact"]["form"];
};

type FieldName = "name" | "email" | "subject" | "message";
type FieldErrors = Partial<Record<FieldName, FieldName>>;
type FormStatus = "idle" | "invalid" | "opened";

const fieldNames: readonly FieldName[] = ["name", "email", "subject", "message"];

function isFieldName(value: string): value is FieldName {
  return fieldNames.some((fieldName) => fieldName === value);
}

function validateField(field: FieldName, value: string): FieldName | undefined {
  const trimmedValue = value.trim();

  if (field === "name" && trimmedValue.length < 2) return field;
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return field;
  }
  if (field === "subject" && trimmedValue.length < 3) return field;
  if (field === "message" && trimmedValue.length < 12) {
    return field;
  }

  return undefined;
}

export function ContactForm({ email, messages }: ContactFormProps) {
  const idPrefix = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.currentTarget.name;
    if (!isFieldName(field)) return;

    const errorCode = validateField(field, event.currentTarget.value);
    setErrors((current) => ({ ...current, [field]: errorCode }));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.currentTarget.name;
    if (!isFieldName(field) || !errors[field]) return;

    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setStatus("idle");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };
    const nextErrors: FieldErrors = {};
    const nameError = validateField("name", values.name);
    const emailError = validateField("email", values.email);
    const subjectError = validateField("subject", values.subject);
    const messageError = validateField("message", values.message);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (subjectError) nextErrors.subject = subjectError;
    if (messageError) nextErrors.message = messageError;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("invalid");
      return;
    }

    setErrors({});
    setStatus("opened");
    const body = `${messages.mailBodyName}: ${values.name}\n${messages.mailBodyEmail}: ${values.email}\n\n${values.message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
  }

  const statusMessage =
    status === "invalid"
      ? messages.invalidStatus
      : status === "opened"
        ? messages.openedStatus
        : "";

  const errorId = (field: FieldName) => `${idPrefix}-${field}-error`;

  return (
    <div className={styles.formPanel} data-contact-form-layout data-reveal>
      <div className={styles.formIntro}>
        <p>{messages.eyebrow}</p>
        <h3>{messages.title}</h3>
        <span>{messages.description}</span>
      </div>

      <form aria-label={messages.ariaLabel} className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor={`${idPrefix}-name`}>{messages.fields.name.label}</label>
            <input
              aria-describedby={errors.name ? errorId("name") : undefined}
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              id={`${idPrefix}-name`}
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={messages.fields.name.placeholder}
              required
              type="text"
            />
            <span className={styles.fieldError} id={errorId("name")}>
              {errors.name ? messages.errors[errors.name] : ""}
            </span>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${idPrefix}-email`}>{messages.fields.email.label}</label>
            <input
              aria-describedby={errors.email ? errorId("email") : undefined}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              id={`${idPrefix}-email`}
              inputMode="email"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder={messages.fields.email.placeholder}
              required
              type="email"
            />
            <span className={styles.fieldError} id={errorId("email")}>
              {errors.email ? messages.errors[errors.email] : ""}
            </span>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-subject`}>{messages.fields.subject.label}</label>
          <input
            aria-describedby={errors.subject ? errorId("subject") : undefined}
            aria-invalid={Boolean(errors.subject)}
            id={`${idPrefix}-subject`}
            name="subject"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={messages.fields.subject.placeholder}
            required
            type="text"
          />
          <span className={styles.fieldError} id={errorId("subject")}>
            {errors.subject ? messages.errors[errors.subject] : ""}
          </span>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${idPrefix}-message`}>{messages.fields.message.label}</label>
          <textarea
            aria-describedby={errors.message ? errorId("message") : undefined}
            aria-invalid={Boolean(errors.message)}
            id={`${idPrefix}-message`}
            maxLength={2000}
            name="message"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={messages.fields.message.placeholder}
            required
            rows={6}
          />
          <span className={styles.fieldError} id={errorId("message")}>
            {errors.message ? messages.errors[errors.message] : ""}
          </span>
        </div>

        <div className={styles.formFooter}>
          <button className={styles.submitButton} type="submit">
            {messages.submit}
            <Icon name="mail" size="md" />
          </button>
          <p aria-atomic="true" aria-live="polite" className={styles.formStatus} role="status">
            {statusMessage}
          </p>
        </div>
      </form>
    </div>
  );
}
