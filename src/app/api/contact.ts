/**
 * Sends the contact form to /api/contact and throws unless the server says it
 * was sent, so the form never reports a failed send as sent (KHP §1.1).
 * Its own module, not in stores.ts, so the contact page doesn't load the
 * search stores to post a form.
 */
export async function sendContact(form: FormData): Promise<void> {
  let result: { success?: boolean; error?: string } | null = null;
  try {
    const res = await fetch("/api/contact", { method: "POST", body: form, headers: { Accept: "application/json" } });
    result = await res.json();
  } catch {
    throw new Error("Failed to send message");
  }
  if (!result?.success) throw new Error(result?.error || "Failed to send message");
}
