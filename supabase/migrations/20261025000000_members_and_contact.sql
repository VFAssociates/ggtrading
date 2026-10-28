-- GG Trading: member accounts (with the plan they signed up for) and contact form messages.
-- Run once in the Supabase SQL editor of the GG Trading project.

-- One row per account, created automatically when someone signs up (Google or email).
create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  email            text,
  full_name        text,
  plan             text check (plan in ('free', 'pro', 'elite')),
  plan_selected_at timestamptz,
  created_at       timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Members can read their own profile. Changes go through the membership function only.
create policy "Members read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Contact form messages. No policies: only the contact function (service role) reads or writes them.
create table public.contact_messages (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users (id) on delete set null,
  name       text not null,
  email      text not null,
  message    text not null,
  ip_hash    text,             -- for rate limiting; the raw IP isn't stored
  emailed    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create index contact_messages_ip_recent on public.contact_messages (ip_hash, created_at);
