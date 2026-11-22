import { z } from "zod";

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  subjectMax: 120,
  messageMin: 20,
  messageMax: 2000,
  /** Submissions faster than this after the form appears are treated as bots. */
  minFillMs: 3000,
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.nameMin, "Informe seu nome (mínimo de 2 caracteres).")
    .max(CONTACT_LIMITS.nameMax, "O nome pode ter até 80 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido, como nome@empresa.com.")
    .max(254, "E-mail muito longo."),
  subject: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.subjectMax, "O assunto pode ter até 120 caracteres.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.messageMin, "Escreva uma mensagem com pelo menos 20 caracteres.")
    .max(CONTACT_LIMITS.messageMax, "A mensagem pode ter até 2000 caracteres."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type SpamSignals = {
  /** Hidden field humans never fill. */
  honeypot: string;
  /** Timestamp (ms) when the form became interactive. */
  startedAt: number;
  now: number;
};

export function isLikelySpam({ honeypot, startedAt, now }: SpamSignals): boolean {
  if (honeypot.trim().length > 0) return true;
  if (now - startedAt < CONTACT_LIMITS.minFillMs) return true;
  return false;
}

function composeBody(input: ContactInput): string {
  return [
    `Olá, Giselle! Meu nome é ${input.name}.`,
    "",
    input.message,
    "",
    `Responder para: ${input.email}`,
  ].join("\n");
}

export function buildMailtoUrl(to: string, input: ContactInput): string {
  const subject = input.subject?.trim() || `Contato pelo portfólio — ${input.name}`;
  const params = new URLSearchParams({ subject, body: composeBody(input) });
  // URLSearchParams encodes spaces as "+", which some mail clients show literally.
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}

export function buildWhatsAppUrl(phoneDigits: string, input: ContactInput): string {
  const subjectLine = input.subject?.trim() ? `*${input.subject.trim()}*\n\n` : "";
  const text = `${subjectLine}${composeBody(input)}`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
}
