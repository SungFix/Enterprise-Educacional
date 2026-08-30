-- Epoch Education — banco dedicado de feedbacks v50
-- O navegador não recebe SELECT/INSERT direto. Envios passam pela Edge Function submit-feedback.

create table if not exists public.ee_feedback (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'geral' check (category in ('geral','conteudo','playground','bug','visual','sugestao')),
  rating smallint check (rating between 1 and 5),
  message text not null check (char_length(trim(message)) between 5 and 2000),
  page text not null default '' check (char_length(page) <= 200),
  app_version integer not null default 50 check (app_version between 1 and 9999),
  created_at timestamptz not null default now()
);
alter table public.ee_feedback alter column app_version set default 50;
alter table public.ee_feedback enable row level security;
revoke all on table public.ee_feedback from anon, authenticated;
revoke insert (category, rating, message, page, app_version) on table public.ee_feedback from anon, authenticated;
drop policy if exists ee_feedback_insert_public on public.ee_feedback;
drop policy if exists ee_feedback_deny_public on public.ee_feedback;
create policy ee_feedback_deny_public on public.ee_feedback for all to anon, authenticated using (false) with check (false);
create index if not exists ee_feedback_created_at_idx on public.ee_feedback (created_at desc);

create table if not exists public.ee_feedback_rate_limits (
  key_hash text primary key check (char_length(key_hash) = 64),
  window_start timestamptz not null default now(),
  request_count integer not null default 1 check (request_count >= 0),
  last_seen timestamptz not null default now()
);
alter table public.ee_feedback_rate_limits enable row level security;
revoke all on table public.ee_feedback_rate_limits from anon, authenticated;
drop policy if exists ee_feedback_rate_limits_deny_public on public.ee_feedback_rate_limits;
create policy ee_feedback_rate_limits_deny_public on public.ee_feedback_rate_limits for all to anon, authenticated using (false) with check (false);

create or replace function public.ee_feedback_consume_rate_limit(p_key_hash text, p_limit integer default 3, p_window_seconds integer default 600)
returns boolean language plpgsql security definer set search_path = pg_catalog, public as $$
declare v_allowed boolean := false; v_now timestamptz := clock_timestamp();
begin
  if p_key_hash is null or char_length(p_key_hash) <> 64 or p_limit < 1 or p_window_seconds < 30 then return false; end if;
  insert into public.ee_feedback_rate_limits as rl (key_hash, window_start, request_count, last_seen)
  values (p_key_hash, v_now, 1, v_now)
  on conflict (key_hash) do update set
    window_start = case when rl.window_start <= v_now - make_interval(secs => p_window_seconds) then v_now else rl.window_start end,
    request_count = case when rl.window_start <= v_now - make_interval(secs => p_window_seconds) then 1 else rl.request_count + 1 end,
    last_seen = v_now
  returning request_count <= p_limit into v_allowed;
  return coalesce(v_allowed, false);
end;
$$;
revoke all on function public.ee_feedback_consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.ee_feedback_consume_rate_limit(text, integer, integer) to service_role;
comment on table public.ee_feedback is 'Feedbacks anonimos enviados pelo site Epoch Education.';
comment on table public.ee_feedback_rate_limits is 'Rate limit interno do endpoint de feedback do Epoch Education.';
