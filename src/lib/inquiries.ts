import { isSupabaseConfigured, submitToSupabase } from "./supabase";

/**
 * ARCHE CREATIVE STUDIOS — Inquiry Delivery Pipeline
 *
 * Contact enquiries can be delivered to:
 * 1. Supabase database table `contact_submissions` (primary client-side database).
 * 2. Web3Forms (email webhook backup).
 * 3. Mailto fallback to archecreativestudios@gmail.com (honest fallback, never silent loss).
 */

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  service: string;
  projectDetails: string;
}

export type SendResult =
  | { ok: true; provider?: "supabase" | "web3forms" }
  | { ok: false; reason: "unconfigured" | "network" | "rejected"; status?: number; error?: string };

const WEB3FORMS_ACCESS_KEY = "";
const WEB3FORMS_SUBMIT_URL = "https://api.web3forms.com/submit";

type ViteEnv = { env?: Record<string, string | undefined> };

export function web3FormsAccessKey(): string {
  const env = (import.meta as unknown as ViteEnv).env;
  return (WEB3FORMS_ACCESS_KEY || env?.VITE_WEB3FORMS_ACCESS_KEY || "").trim();
}

export function mailtoFallbackUrl(p: ContactFormPayload): string {
  const subject = encodeURIComponent(`Project Enquiry — ${p.service} — ${p.name}`);
  const body = encodeURIComponent(
    `Hello ARCHE Team,\n\nName: ${p.name}\nEmail: ${p.email}\nPhone: ${p.phone || "Not provided"}\nService: ${p.service}\n\nProject Details:\n${p.projectDetails}\n\nSent from www.archecreativestudios.com`
  );
  return `mailto:archecreativestudios@gmail.com?subject=${subject}&body=${body}`;
}

export async function submitContactEnquiry(p: ContactFormPayload): Promise<SendResult> {
  // 1. Primary: If Supabase is configured, submit entry to Supabase table
  if (isSupabaseConfigured()) {
    try {
      const supaRes = await submitToSupabase(p);
      if (supaRes.ok) {
        return { ok: true, provider: "supabase" };
      }
      console.warn("Supabase insert did not succeed:", supaRes.error);
    } catch (err) {
      console.error("Supabase attempt failed:", err);
    }
  }

  // 2. Secondary: If Web3Forms access key is configured, submit via Web3Forms
  const accessKey = web3FormsAccessKey();
  if (accessKey) {
    const body: Record<string, string> = {
      access_key: accessKey,
      subject: `New ARCHE Project Enquiry — ${p.service} (${p.name})`,
      from_name: p.name,
      email: p.email,
      replyto: p.email,
      phone: p.phone || "N/A",
      service: p.service,
      message: p.projectDetails,
      to: "archecreativestudios@gmail.com",
      source: "ARCHE Creative Studios Contact Page",
    };

    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 12000);

    try {
      const res = await fetch(WEB3FORMS_SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });

      let result: { success?: boolean; message?: string } | undefined;
      try {
        result = (await res.json()) as { success?: boolean; message?: string };
      } catch {
        result = undefined;
      }

      if (res.ok && result?.success) {
        return { ok: true, provider: "web3forms" };
      }

      return { ok: false, reason: "rejected", status: res.status };
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return { ok: false, reason: "network", status: 408 };
      }
      return { ok: false, reason: "network" };
    } finally {
      window.clearTimeout(timer);
    }
  }

  // 3. Fallback: If neither Supabase nor Web3Forms is configured, return unconfigured
  return { ok: false, reason: "unconfigured" };
}
