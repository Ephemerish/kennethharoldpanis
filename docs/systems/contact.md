# Contact

Standards: KHP §1.1, §1.3, §4.1, §4.6, §4.9, §6.2, §6.4, §8.5

## Purpose

`/contact` lets a reader send a message that arrives as an email, and lists
the other ways to reach the owner. This system owns the form, the subjects,
the send call, the endpoint and the email link obfuscation. The social links
come from `src/data/site.ts` ([Frame and navigation](frame-and-navigation.md)).

## Implementation

- `src/app/pages/contact/Contact.astro`: `PageSection` with `PageHeader` ("Let's Connect", with a subtitle naming roles, freelance work and collaborations), the form beside `ContactSidebar`, and a `Toaster` (`client:idle`, top right, rich colours, close button).
- `src/app/pages/contact/ContactForm.astro`: a `floating` `Card` with "Send me a message", then a `Form` (`#contact-form`, `method="post"`) of `Field`s, each a label above its control with an `error-600` asterisk: `Input` name (`maxlength` 120), `Input` email (254), the subject Select, `Textarea` message (5000), all `required`. A hidden honeypot `website` field, and a `Button` `type="submit"` `variant="gradient"` "Send Message". A page script wires the form once per page on `astro:page-load` (`data-wired`): it shows "Sending..." and disables the button, calls `sendContact`, then toasts "Message sent successfully!" and resets the form, or toasts "Failed to send message".
- `src/app/pages/contact/SubjectSelect.tsx`: the Select (Radix) from `@ui/components/form/Select`, with `name="subject"` and `required`, hydrated `client:load`; clears on the form's `reset` event.
- `src/app/pages/contact/ContactSidebar.astro`: `GetInTouchCard` (email through `EmailLink`, location, response time), `SocialLinksCard` (LinkedIn, GitHub) and `CtaCard` (the brand card "Ready to work together?": a line built from the current role in `src/data/bio/experience.ts`, "<title> at <org>", and `onBrand` chips of that role's tech).
- `src/data/contact/subjects.ts`: `SUBJECTS`, the only subjects the form offers and the endpoint accepts.
- `src/app/api/stores.ts` `sendContact(form)`: a plain `fetch` POST to `/api/contact`. Throws with the server's words when `success` is not true, or "Failed to send message" when the request or JSON fails. It replaced a nanoquery mutator because `mutate()` swallowed errors, so a failed send showed as sent.
- `src/pages/api/contact.ts`: `prerender = false`. Reads form data; a filled honeypot answers success and sends nothing. Requires every field and a known subject, an email matching a simple pattern, and the limits in `contactLimits` from `src/data/settings.ts` (name 120, email 254, message 5000). Escapes every field before it goes into the HTML email. Sends through Resend from `contact@kennethharoldpanis.com` to `site.email` with `replyTo` set to the sender.
- `src/app/shared/EmailLink.astro`: the address is split into `data-email-user` and `data-email-domain` and joined into a `mailto:` link on `astro:page-load`, so the server HTML never holds it. Used by the contact sidebar and the footer.

## Must stay true

1. A failed send never shows as sent. Any non-success answer or network error reaches the reader as an error toast (KHP §1.1, §6.4).
2. On failure the reader keeps what they typed. The form resets only after success.
3. Answers are short and plain: "All fields are required", "Invalid email address", "Message is too long", "Email service not configured" (503), "Failed to send email" (502). Never a stack trace or a provider message (KHP §8.5).
4. Every user field is HTML-escaped before it goes into the email body.
5. The subject must be one of `SUBJECTS`. The form and the endpoint read the same list (KHP §1.3).
6. The subject is the Radix Select (KHP §1.4, §4.6), server-rendered with `client:load` so it shows with the page. It submits through Radix's own `name` and `required`, given only once hydrated, so the server markup holds no hidden required field; without script a `NativeSelect` inside `NoScript` takes its place (KHP §7.8). Never `client:only`: the field would appear late.
15. The send call is `src/app/api/contact.ts`, its own module, so the contact page doesn't load the search stores to post a form.
7. The honeypot stays hidden from people and assistive tech (a `hidden`, `aria-hidden` wrapper, and `tabindex="-1"` on the field).
8. A missing `RESEND_API_KEY` answers 503 and logs on the server.
9. The real email address is never in the server-rendered HTML.
10. Each field has a visible label above it (KHP §4.1).
11. Only a real send shows the success toast or the `/thank-you` page. No URL or query string can show it: `/thank-you` is reached only by the endpoint's redirect after a send (or the honeypot), and is `noindex`.
13. The form works without script: it has `action="/api/contact"`; the endpoint answers a request that doesn't ask for JSON with a 303 to `/thank-you` or `/contact/not-sent`, and `/contact/not-sent` gives the address to email instead (KHP §1.1, §7.8). The page's script sends `Accept: application/json` and gets JSON as before.
14. `security.allowedDomains` in `astro.config.mjs` lists every host the site answers on. Without it Astro treats requests as coming from "localhost" and its same-origin check refuses every form post with 403. A new domain is added there before it goes live.
12. The call-to-action card's role comes from the current timeline entry, never typed in the card (KHP §1.3, §6.6). It links to `/bio` for the tech instead of repeating thirty chips (KHP §1.7).

## Before changing

- Send a real message with `RESEND_API_KEY` set, and one with it unset. Check the toasts and that the text stays after a failure.
- Try an empty subject, a bad email and a long message.
- Navigate to `/contact` by view transition and check the form sends once, not twice.
- Related: [Frame and navigation](frame-and-navigation.md), [Search](search.md) (`stores.ts`).

## Checks

- `pnpm test:e2e` ([Testing](testing.md)), with `/api/contact` answered by the test: the form won't send with empty fields; it says "Message sent successfully!" and clears only when the answer is a success; on a 502 it says "Failed to send message" and keeps the message.
- None for the endpoint itself: its validation, escaping, honeypot and the Resend call.

## Known limits

- Before November 16, 2026 `security.allowedDomains` was not set, so with Astro 5.18 every form post to `/api/contact` from the live site was refused with 403 ("Cross-site POST form submissions are forbidden"). The JavaScript form tests stub the endpoint, so they couldn't see it; `tests/e2e/resilience.spec.ts` now posts to the real endpoint.

- The error toast always says "Please try again or email me directly."; the server's reason is not shown.
- No rate limiting on `/api/contact`; the honeypot is the only bot defence.
- Without JavaScript the form posts natively and the reader lands on the raw JSON answer.
- The sender address is written in the endpoint, not read from `site.ts`. The location and response time are written in `GetInTouchCard.astro`.
- Without JavaScript, `EmailLink` renders an `<a>` with no `href`.
- With no current role in `experience.ts`, `CtaCard` falls back to the words "Software Engineer" and shows no chips.

## Change checklist

- [ ] Every "Must stay true" item still holds.
- [ ] A success and a failure were sent and seen.
- [ ] This file and its row in docs/systems.md match the code.
- [ ] Unchecked paths and open gaps are written down.
