import type { APIRoute } from "astro";
import { site } from "@data/site";
import { contactLimits } from "@data/settings";
import { SUBJECTS } from "@data/contact/subjects";

/**
 * Contact form endpoint (docs/systems/contact.md). Validates the message,
 * escapes every field before it goes into the email, and sends it through
 * Resend. Failures answer with a plain message, never internals.
 *
 * The page's script asks for JSON. A browser posting the form without script
 * gets a page instead: /thank-you when it was sent, /contact/not-sent when it
 * wasn't, so a reader never sees raw JSON or a false "sent" (KHP §1.1, §7.8).
 */
export const prerender = false;

const LIMITS = contactLimits;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const field = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export const POST: APIRoute = async ({ request }) => {
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
  const answer = (status: number, body: { success: boolean; error?: string }) =>
    wantsJson
      ? json(status, body)
      : new Response(null, { status: 303, headers: { Location: body.success ? "/thank-you" : "/contact/not-sent" } });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return answer(400, { success: false, error: "Invalid form data" });
  }

  // A filled honeypot means a bot; answer as if it worked and send nothing.
  if (field(form, "website")) return answer(200, { success: true });

  const name = field(form, "name");
  const email = field(form, "email");
  const subjectKey = field(form, "subject");
  const message = field(form, "message");
  const subject = SUBJECTS.find((s) => s.value === subjectKey)?.label;

  if (!name || !email || !subject || !message) {
    return answer(400, { success: false, error: "All fields are required" });
  }
  if (!EMAIL.test(email) || email.length > LIMITS.email) {
    return answer(400, { success: false, error: "Invalid email address" });
  }
  if (name.length > LIMITS.name || message.length > LIMITS.message) {
    return answer(400, { success: false, error: "Message is too long" });
  }

  const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return answer(503, { success: false, error: "Email service not configured" });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `${site.name} <contact@kennethharoldpanis.com>`,
      to: site.email,
      replyTo: email,
      subject: `Contact form: ${subject}`,
      text: `${name} <${email}>\n${subject}\n\n${message}`,
      html: `
        <h2>New message from the contact form</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });
    if (error) throw new Error(error.message);
    return answer(200, { success: true });
  } catch (error) {
    console.error("[contact] send failed:", error instanceof Error ? error.message : error);
    return answer(502, { success: false, error: "Failed to send email" });
  }
};
