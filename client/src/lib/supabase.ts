import { createClient } from "@supabase/supabase-js";

// Public values for the GG Trading Supabase project. The publishable key is meant for browsers:
// it can only do what row level security and the edge functions allow.
const url = import.meta.env.VITE_SUPABASE_URL || "https://gbiribpgeolhwfsduluy.supabase.co";
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_xuID-odUByyz5UDS89jKkA_FI4pwUQc";

export const supabase = createClient(url, publishableKey);

export type Plan = "free" | "pro" | "elite";
export const PLAN_NAMES: Record<Plan, string> = { free: "Free", pro: "Pro", elite: "Elite" };

/** Calls an edge function and turns its { error } answer into a thrown Error with a readable message. */
export async function callFunction<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let message = "Something went wrong. Please try again.";
    const response = (error as { context?: Response }).context;
    if (response && typeof response.json === "function") {
      try {
        message = (await response.json()).error ?? message;
      } catch {
        // keep the generic message
      }
    }
    throw new Error(message);
  }
  return data as T;
}
