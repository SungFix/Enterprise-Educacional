-- Enterprise Educacional — sincronização opcional em nuvem
-- Execute no SQL Editor do seu projeto Supabase.

create table if not exists public.ee_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.ee_user_data enable row level security;

create policy "ee_user_data_select_own"
on public.ee_user_data for select
using (auth.uid() = user_id);

create policy "ee_user_data_insert_own"
on public.ee_user_data for insert
with check (auth.uid() = user_id);

create policy "ee_user_data_update_own"
on public.ee_user_data for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "ee_user_data_delete_own"
on public.ee_user_data for delete
using (auth.uid() = user_id);

create or replace function public.ee_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ee_user_data_touch on public.ee_user_data;
create trigger ee_user_data_touch
before update on public.ee_user_data
for each row execute procedure public.ee_touch_updated_at();
