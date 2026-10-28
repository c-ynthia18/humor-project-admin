-- The caption app reads this function on every authenticated generation request.
create or replace function public.get_active_llm_model()
returns text
language sql stable security definer set search_path = public as $$
  select m.name
  from public.llm_models m
  join public.llm_providers p on p.id = m.provider_id
  where m.is_active = true and p.is_active = true and lower(p.name) = 'google'
  order by m.created_at desc
  limit 1;
$$;
grant execute on function public.get_active_llm_model() to authenticated;

insert into public.llm_providers (name, api_base_url, is_active)
values ('Google', 'https://generativelanguage.googleapis.com', true)
on conflict (name) do update set is_active = true;

insert into public.llm_models (provider_id, name, context_window, is_active)
select id, 'gemini-3.6-flash', 32000, true
from public.llm_providers where name = 'Google'
on conflict (provider_id, name) do update set is_active = true;
