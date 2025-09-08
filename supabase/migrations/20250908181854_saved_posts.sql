create table if not exists public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  title text null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Activer RLS et autoriser insert/select public (anonyme)
alter table public.saved_posts enable row level security;

create policy "Allow anonymous select" on public.saved_posts
  for select using (true);

create policy "Allow anonymous insert" on public.saved_posts
  for insert with check (true);