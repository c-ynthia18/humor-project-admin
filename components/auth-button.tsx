"use client";
import { createClient } from "@/lib/supabase/browser";
export default function AuthButton() { async function login() { await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } }); } return <button onClick={login} className="rounded-full bg-[#435020] px-5 py-3 font-bold text-[#fff8e8]">Sign in with Google</button>; }
