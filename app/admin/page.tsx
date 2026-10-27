import { requireAdmin } from "@/lib/require-admin";
import { adminClient } from "@/lib/supabase/admin";
import AdminMedia from "./media";
export const instant = false;

export default async function AdminPage() {
  await requireAdmin();
  const db = adminClient();
  const [profilesResult, generationsResult, votesResult] = await Promise.all([
    db.from("profiles").select("id, first_name, last_name, created_at").order("created_at", { ascending: false }).limit(30),
    db.from("generations").select("id, creator_id, caption, prompt, image_path, created_at").order("created_at", { ascending: false }).limit(60),
    db.from("votes").select("generation_id, user_id, value, created_at").order("created_at", { ascending: false }).limit(100),
  ]);
  const profiles = profilesResult.data;
  const generations = generationsResult.data;
  const votes = votesResult.data;
  const databaseErrors = [profilesResult.error, generationsResult.error, votesResult.error].filter((error): error is { message: string } => error !== null).map((error) => error.message);
  const scoreFor = (id: string) => (votes ?? []).filter((vote) => vote.generation_id === id).reduce((total, vote) => total + vote.value, 0);
  const media = (generations ?? []).map((item) => ({ ...item, score: scoreFor(item.id), imageUrl: item.image_path ? db.storage.from("memes").getPublicUrl(item.image_path).data.publicUrl : null }));
  const best = [...media].sort((a, b) => b.score - a.score)[0];
  const upvotes = (votes ?? []).filter((vote) => vote.value === 1).length;
  const downvotes = (votes ?? []).filter((vote) => vote.value === -1).length;
  return <main className="min-h-screen p-6 sm:p-10"><div className="mx-auto max-w-7xl"><header className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black tracking-[.18em] text-[#68764d]">SUPERADMIN ONLY</p><h1 className="display text-5xl font-black">Cat-alyst control room</h1></div><p className="rounded-full bg-[#e9edce] px-4 py-2 text-sm font-bold">Live database view</p></header>{databaseErrors.length > 0 && <div className="mb-6 rounded-2xl border-2 border-[#b94b38] bg-[#fff0ed] p-4 text-sm text-[#8e1722]"><b>Database connection problem:</b> {databaseErrors[0]}. Check that <code>SUPABASE_SERVICE_ROLE_KEY</code> belongs to the same Supabase project as <code>NEXT_PUBLIC_SUPABASE_URL</code>.</div>}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Profiles", profiles?.length ?? 0], ["AI creations", generations?.length ?? 0], ["Upvotes", upvotes], ["Downvotes", downvotes]].map(([label, value]) => <div key={String(label)} className="rounded-3xl border-2 border-[#d5c586] bg-[#fff8e8] p-5"><p className="text-sm font-bold text-[#68764d]">{label}</p><p className="display mt-1 text-4xl font-black">{value}</p></div>)}</section><section className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-3xl border-2 border-[#d5c586] bg-[#fff8e8] p-6"><p className="text-xs font-black tracking-[.16em] text-[#68764d]">TOP LAUGH</p><h2 className="display text-3xl font-black">{best ? `${best.score} points` : "No ratings yet"}</h2><p className="mt-3 text-sm">{best?.caption ?? "Upload and rate memes to populate this stat."}</p></div><div className="rounded-3xl bg-[#435020] p-6 text-[#fff8e8]"><p className="text-xs font-black tracking-[.16em] text-[#dce7b7]">RATING MOOD</p><p className="display mt-2 text-3xl font-black">{upvotes >= downvotes ? "The crowd is laughing" : "The crowd is selective"}</p><p className="mt-3 text-sm text-[#e9edce]">{upvotes} upvotes versus {downvotes} downvotes</p></div></section><AdminMedia initialMedia={media} profiles={profiles ?? []} votes={votes ?? []} /></div></main>;
}
