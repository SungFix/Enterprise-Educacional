drop policy if exists ee_feedback_deny_public on public.ee_feedback;
create policy ee_feedback_deny_public on public.ee_feedback for all to anon,authenticated using(false) with check(false);
drop policy if exists ee_feedback_rate_limits_deny_public on public.ee_feedback_rate_limits;
create policy ee_feedback_rate_limits_deny_public on public.ee_feedback_rate_limits for all to anon,authenticated using(false) with check(false);
