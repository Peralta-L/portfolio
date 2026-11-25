import { problemSchema, type ContactRequest } from "@/types/api";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export const isContactConfigured = API_URL.length > 0;

export type ContactField = Exclude<keyof ContactRequest, "website">;
export type FieldErrors = Partial<Record<ContactField, string>>;

export type SubmitResult = { ok: true } | { ok: false; message: string; fieldErrors?: FieldErrors };

/**
 * Posts the contact form to the Spring Boot API. The generous timeout covers
 * free-tier cold starts, which can take close to a minute.
 */
export async function submitContact(payload: ContactRequest): Promise<SubmitResult> {
  if (!isContactConfigured) {
    return { ok: false, message: "The contact form is not configured yet. Please reach out via the links instead." };
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(70_000),
    });
  } catch {
    return { ok: false, message: "Couldn't reach the server. Check your connection and try again." };
  }

  if (response.ok) return { ok: true };

  const problem = problemSchema.safeParse(await response.json().catch(() => null));
  if (response.status === 429) {
    return { ok: false, message: "You've sent several messages recently. Please try again later." };
  }
  if (response.status === 400 && problem.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: problem.data.errors as FieldErrors | undefined,
    };
  }
  return { ok: false, message: "Something went wrong on our side. Please try again later." };
}
