-- Week 7 admin data model. Run in the same Supabase project as Meme Caption Lab.
create table if not exists public.terms (
  id uuid primary key default gen_random_uuid(), key text not null unique, value text not null, description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.llm_providers (
  id uuid primary key default gen_random_uuid(), name text not null unique, api_base_url text, is_active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.llm_models (
  id uuid primary key default gen_random_uuid(), provider_id uuid references public.llm_providers(id) on delete set null, name text not null, context_window integer, is_active boolean not null default true, created_at timestamptz not null default now(), unique(provider_id, name)
);
create table if not exists public.prompt_chains (
  id uuid primary key default gen_random_uuid(), name text not null unique, description text, model_id uuid references public.llm_models(id) on delete set null, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.prompt_chain_steps (
  id uuid primary key default gen_random_uuid(), prompt_chain_id uuid not null references public.prompt_chains(id) on delete cascade, step_order integer not null, role text not null default 'user', template text not null, created_at timestamptz not null default now(), unique(prompt_chain_id, step_order)
);
create table if not exists public.prompt_chain_mix (
  id uuid primary key default gen_random_uuid(), prompt_chain_id uuid not null references public.prompt_chains(id) on delete cascade, term_id uuid references public.terms(id) on delete set null, label text not null, weight integer not null default 100 check (weight between 0 and 100), updated_at timestamptz not null default now()
);
create table if not exists public.allowed_signup_domains (
  id uuid primary key default gen_random_uuid(), domain text not null unique, is_active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.whitelisted_email_addresses (
  id uuid primary key default gen_random_uuid(), email text not null unique, note text, created_at timestamptz not null default now()
);
create table if not exists public.generation_requests (
  id uuid primary key default gen_random_uuid(), requester_id uuid references auth.users(id) on delete set null, prompt text not null, prompt_chain_id uuid references public.prompt_chains(id) on delete set null, model_id uuid references public.llm_models(id) on delete set null, status text not null default 'completed', created_at timestamptz not null default now()
);
create table if not exists public.llm_responses (
  id uuid primary key default gen_random_uuid(), generation_request_id uuid not null references public.generation_requests(id) on delete cascade, model_id uuid references public.llm_models(id) on delete set null, response_text text not null, latency_ms integer, created_at timestamptz not null default now()
);
create table if not exists public.ai_generation_examples (
  id uuid primary key default gen_random_uuid(), title text not null, input_prompt text not null, expected_output text not null, prompt_chain_id uuid references public.prompt_chains(id) on delete set null, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.terms enable row level security;
alter table public.llm_providers enable row level security;
alter table public.llm_models enable row level security;
alter table public.prompt_chains enable row level security;
alter table public.prompt_chain_steps enable row level security;
alter table public.prompt_chain_mix enable row level security;
alter table public.allowed_signup_domains enable row level security;
alter table public.whitelisted_email_addresses enable row level security;
alter table public.generation_requests enable row level security;
alter table public.llm_responses enable row level security;
alter table public.ai_generation_examples enable row level security;

grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
