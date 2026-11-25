"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isContactConfigured, submitContact, type ContactField, type FieldErrors } from "@/lib/contact";
import { contactRequestSchema } from "@/types/api";

type Status = "idle" | "submitting" | "success" | "error";

const fields: { name: ContactField; label: string; autoComplete?: string; type?: string; maxLength: number }[] = [
  { name: "name", label: "Name", autoComplete: "name", maxLength: 100 },
  { name: "email", label: "Email", autoComplete: "email", type: "email", maxLength: 254 },
  { name: "subject", label: "Subject", maxLength: 150 },
];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [slow, setSlow] = useState(false);

  // The free-tier API sleeps when idle; tell people why the first send is slow.
  useEffect(() => {
    if (status !== "submitting") return;
    const timer = window.setTimeout(() => setSlow(true), 4000);
    return () => {
      window.clearTimeout(timer);
      setSlow(false);
    };
  }, [status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = contactRequestSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as ContactField;
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      // Focus by name: aria-invalid isn't rendered yet at this point.
      const firstInvalid = (["name", "email", "subject", "message"] as const).find((f) => fieldErrors[f]);
      if (firstInvalid) form.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage("");
    const result = await submitContact(parsed.data);

    if (result.ok) {
      form.reset();
      setStatus("success");
      setMessage("Thanks! Your message is in. I'll get back to you soon.");
    } else {
      setErrors(result.fieldErrors ?? {});
      setStatus("error");
      setMessage(result.message);
    }
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby="form-status">
      {!isContactConfigured ? (
        <p className="rounded-[3px] border border-border-strong bg-muted px-4 py-3 text-sm text-foreground">
          The contact form isn&apos;t connected yet. Please use the links on this page in the meantime.
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.name === "subject" ? "space-y-2 sm:col-span-2" : "space-y-2"}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              required
              disabled={submitting}
              aria-invalid={errors[field.name] ? true : undefined}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
            <FieldError id={`${field.name}-error`} message={errors[field.name]} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          maxLength={5000}
          required
          disabled={submitting}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* Honeypot: visually hidden and skipped by keyboard and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto" data-mood="excited">
          {submitting ? <Loader2 className="animate-spin" /> : <Send />}
          {submitting ? "Sending…" : "Send message"}
        </Button>
        <p
          id="form-status"
          role="status"
          aria-live="polite"
          className={
            status === "success"
              ? "flex items-center gap-2 text-sm text-success"
              : status === "error"
                ? "text-sm text-danger"
                : "text-sm text-muted-foreground"
          }
        >
          {status === "success" ? <CheckCircle2 aria-hidden="true" className="size-4" /> : null}
          {submitting && slow ? "Waking up the server, this can take a few seconds…" : message}
        </p>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-danger">
      {message}
    </p>
  );
}
