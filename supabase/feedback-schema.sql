-- Epoch Education — banco dedicado de feedbacks
-- Use em um projeto Supabase separado do backend de sincronização de usuários.

create table if not exists public.ee_feedback (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'geral' check (category in ('geral','conteudo','playground','bug','visual','sugestao')),
  rating smallint check (rating between 1 and 5),
  message text not null check (char_length(trim(message)) between 5 and 2000),
  page text not null default '' check (char_length(page) <= 200),
  app_version integer not null default 49 check (app_version between 1 and 9999),
  created_at timestamptz not null default now()
);
alter table public.ee_feedback enable row level security;
revoke all on table public.ee_feedback from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant insert (category, rating, message, page, app_version) on table public.ee_feedback to anon, authenticated;
drop policy if exists ee_feedback_insert_public on public.ee_feedback;
create policy ee_feedback_insert_public on public.ee_feedback for insert to anon, authenticated
with check (
  category in ('geral','conteudo','playground','bug','visual','sugestao')
  and (rating is null or rating between 1 and 5)
  and char_length(trim(message)) between 5 and 2000
  and char_length(page) <= 200
  and app_version between 1 and 9999
);
create index if not exists ee_feedback_created_at_idx on public.ee_feedback (created_at desc);
comment on table public.ee_feedback is 'Feedbacks anonimos enviados pelo site Epoch Education.';
