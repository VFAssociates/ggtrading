// Shared by the contact and membership functions: CORS, the service-role client, and EmailJS.
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://ggtrading.io,https://www.ggtrading.io,http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

export const SITE_NAME = Deno.env.get("SITE_NAME") ?? "GG Trading";
// Where contact messages and signup notices go. admin@vftech.io for now; set ADMIN_EMAIL to change it.
export const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "admin@vftech.io";

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]!,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export const preflight = (req: Request) => new Response(null, { status: 204, headers: corsHeaders(req) });

export const json = (req: Request, status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });

export const serviceClient = () =>
  createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

/** The signed-in user behind the request's bearer token, or null for visitors. */
export async function requestUser(req: Request) {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token || token.startsWith("sb_")) return null; // the publishable key, not a user session
  const { data } = await serviceClient().auth.getUser(token);
  return data.user ?? null;
}

export interface Email {
  to: string;
  toName?: string;
  subject: string;
  message: string;
  replyTo?: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Sends emails through EmailJS, one per second (its rate limit). Two templates cover everything:
 * EMAILJS_TEMPLATE_USER for people who used the site, EMAILJS_TEMPLATE_ADMIN for VFTech.
 * Both take {{to_email}}, {{to_name}}, {{subject}}, {{message}} and {{reply_to}}.
 * Returns false if EmailJS isn't set up yet or any send failed; the data is saved either way.
 */
export async function sendEmails(emails: { template: "user" | "admin"; email: Email }[]): Promise<boolean> {
  const serviceId = Deno.env.get("EMAILJS_SERVICE_ID");
  const publicKey = Deno.env.get("EMAILJS_PUBLIC_KEY");
  const privateKey = Deno.env.get("EMAILJS_PRIVATE_KEY");
  const templates = { user: Deno.env.get("EMAILJS_TEMPLATE_USER"), admin: Deno.env.get("EMAILJS_TEMPLATE_ADMIN") };
  if (!serviceId || !publicKey || !privateKey || !templates.user || !templates.admin) {
    console.warn("EmailJS isn't configured yet; not sending emails.");
    return false;
  }

  let allSent = true;
  for (const [i, { template, email }] of emails.entries()) {
    if (i > 0) await sleep(1100);
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templates[template],
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: email.to,
          to_name: email.toName ?? "",
          subject: email.subject,
          message: email.message,
          reply_to: email.replyTo ?? ADMIN_EMAIL,
          site_name: SITE_NAME,
        },
      }),
    });
    if (!res.ok) {
      allSent = false;
      console.error(`EmailJS ${template} email failed: ${res.status} ${await res.text()}`);
    }
  }
  return allSent;
}
