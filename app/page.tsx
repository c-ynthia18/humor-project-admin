import AuthButton from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
export const instant = false;
export default async function Home() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); return <main className="min-h-screen px-6 py-20 text-center"><p className="mb-3 text-xs font-black tracking-[.2em] text-[#68764d]">PRIVATE CONTROL ROOM</p><h1 className="display text-5xl font-black">Cat-alyst Admin</h1><p className="mx-auto mt-5 max-w-lg text-[#68764d]">A protected dashboard for profiles, AI creations, and community ratings.</p><div className="mt-8">{user ? <Link className="rounded-full bg-[#435020] px-5 py-3 font-bold text-[#fff8e8]" href="/admin">Open dashboard</Link> : <AuthButton />}</div></main>; }
