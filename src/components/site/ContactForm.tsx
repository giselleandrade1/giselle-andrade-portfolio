import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Mail, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profile } from "@/data/profile";
import {
  CONTACT_LIMITS,
  buildMailtoUrl,
  buildWhatsAppUrl,
  contactSchema,
  isLikelySpam,
  type ContactInput,
} from "@/lib/contact";

type Channel = "email" | "whatsapp";
type Feedback = { tone: "ok" | "error"; text: string } | null;

const fieldClass =
  "h-11 rounded-xl border-input bg-background/60 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring md:text-sm";

export function ContactForm() {
  const startedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [channel, setChannel] = useState<Channel>("email");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
    shouldFocusError: true,
  });

  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = (data: ContactInput) => {
    if (isLikelySpam({ honeypot, startedAt: startedAt.current, now: Date.now() })) {
      setFeedback({
        tone: "error",
        text: "Não foi possível preparar a mensagem. Aguarde alguns segundos e tente novamente.",
      });
      return;
    }
    try {
      if (channel === "whatsapp") {
        // "noopener" in the features string makes window.open return null even on success,
        // so open normally and detach the opener manually.
        const win = window.open(buildWhatsAppUrl(profile.whatsapp, data), "_blank");
        if (!win) throw new Error("popup-blocked");
        win.opener = null;
        setFeedback({
          tone: "ok",
          text: "O WhatsApp foi aberto em uma nova aba com sua mensagem pronta. É só confirmar o envio por lá.",
        });
      } else {
        window.location.href = buildMailtoUrl(profile.email, data);
        setFeedback({
          tone: "ok",
          text: `Seu aplicativo de e-mail deve abrir com a mensagem preenchida. Se nada acontecer, escreva direto para ${profile.email}.`,
        });
      }
    } catch {
      setFeedback({
        tone: "error",
        text: `Não conseguimos abrir o aplicativo. Você pode escrever para ${profile.email} ou tentar a outra opção.`,
      });
    }
  };

  const errorId = (name: keyof ContactInput) => `contact-${name}-error`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass space-y-5 rounded-3xl p-5 sm:p-8"
    >
      <fieldset>
        <legend className="mb-3 text-sm font-medium">Como você prefere enviar?</legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup">
          {(
            [
              { id: "email", label: "E-mail", Icon: Mail },
              { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
            ] as const
          ).map(({ id, label, Icon }) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                channel === id
                  ? "border-lavender/60 bg-imperial/40 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <input
                type="radio"
                name="channel"
                value={id}
                checked={channel === id}
                onChange={() => setChannel(id)}
                className="sr-only"
              />
              <Icon className="size-4" aria-hidden /> {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nome</Label>
          <Input
            id="contact-name"
            autoComplete="name"
            className={fieldClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? errorId("name") : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <p id={errorId("name")} className="text-sm text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">E-mail</Label>
          <Input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={fieldClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? errorId("email") : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id={errorId("email")} className="text-sm text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">
          Assunto <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="contact-subject"
          className={fieldClass}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? errorId("subject") : undefined}
          {...register("subject")}
        />
        {errors.subject ? (
          <p id={errorId("subject")} className="text-sm text-destructive">
            {errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor="contact-message">Mensagem</Label>
          <span className="font-mono text-xs text-muted-foreground" aria-live="polite">
            {messageLength}/{CONTACT_LIMITS.messageMax}
          </span>
        </div>
        <Textarea
          id="contact-message"
          rows={6}
          maxLength={CONTACT_LIMITS.messageMax}
          className="min-h-36 rounded-xl border-input bg-background/60 text-base text-foreground placeholder:text-muted-foreground/70 md:text-sm"
          placeholder="Conte sobre a vaga, o projeto ou a oportunidade."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? errorId("message") : undefined}
          {...register("message")}
        />
        {errors.message ? (
          <p id={errorId("message")} className="text-sm text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Site</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
        {channel === "whatsapp" ? <MessageCircle aria-hidden /> : <Mail aria-hidden />}
        {channel === "whatsapp" ? "Abrir no WhatsApp" : "Abrir no e-mail"}
      </Button>

      <div aria-live="polite" role="status">
        {feedback ? (
          <p
            className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
              feedback.tone === "ok"
                ? "border-success/30 bg-success/10 text-foreground"
                : "border-destructive/40 bg-destructive/10 text-foreground"
            }`}
          >
            {feedback.tone === "error" ? (
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
            ) : null}
            {feedback.text}
          </p>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        Nada é armazenado neste site: a mensagem é aberta no seu e-mail ou WhatsApp para você
        revisar e enviar.
      </p>
    </form>
  );
}
