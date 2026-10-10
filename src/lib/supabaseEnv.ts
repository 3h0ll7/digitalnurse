/**
 * Supabase settings for browser calls. Both values are public by design.
 * The URL falls back to the project in supabase/config.toml so a build without
 * env vars still reaches the right project instead of "undefined/functions/...".
 */
const FALLBACK_URL = "https://gugdclgdpuyhykrjyhph.supabase.co";

export const resolveSupabaseUrl = (value: string | undefined) => (value && value.trim() ? value.trim().replace(/\/+$/, "") : FALLBACK_URL);

export const SUPABASE_URL = resolveSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_PUBLISHABLE_KEY: string | undefined = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || undefined;
