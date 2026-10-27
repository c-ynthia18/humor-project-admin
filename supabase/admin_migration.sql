alter table public.profiles add column if not exists is_superadmin boolean not null default false;
-- Replace the email with your own Google sign-in email, then run this once to bootstrap access:
-- update public.profiles set is_superadmin = true where id = (select id from auth.users where email = 'YOUR_GOOGLE_EMAIL');
