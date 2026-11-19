import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface ContactSubmission {
  id?: number | string;
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  project_details: string;
  source?: string;
  created_at?: string;
}

type ViteEnv = { env?: Record<string, string | undefined> };

export const DEFAULT_SUPABASE_URL = "https://oiehjulozbktlapmctsr.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_VFCbkxMC6AhePvJ6N6fVUA_bT4cVkyi";

export function getSupabaseEnv() {
  const env = (import.meta as unknown as ViteEnv).env || {};
  const url = (env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY
  ).trim();
  return { url, anonKey };
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) return null;
  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return cachedClient;
  } catch (err) {
    console.warn("Failed to initialize Supabase client:", err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}

export async function submitToSupabase(payload: {
  name: string;
  email: string;
  phone?: string;
  service: string;
  projectDetails: string;
}): Promise<{ ok: true } | { ok: false; error: string; unconfigured?: boolean }> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, error: "Supabase credentials are not configured", unconfigured: true };
  }

  const record: ContactSubmission = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim() || null,
    service: payload.service.trim(),
    project_details: payload.projectDetails.trim(),
    source: "Arche Creative Studios Contact Form",
  };

  try {
    const { error } = await client
      .from("contact_submissions")
      .insert([record]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during submission";
    console.error("Supabase submission exception:", err);
    return { ok: false, error: message };
  }
}
