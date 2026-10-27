import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function requireAdmin() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/"); const { data } = await supabase.from("profiles").select("is_superadmin").eq("id", user.id).maybeSingle(); if (!data?.is_superadmin) redirect("/not-authorized"); return user; }
export async function verifyAdmin() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return null; const { data } = await supabase.from("profiles").select("is_superadmin").eq("id", user.id).maybeSingle(); return data?.is_superadmin ? user : null; }
