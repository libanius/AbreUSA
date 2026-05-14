create table if not exists public.customer_dashboard_rate_limits (
  identifier    text        primary key,
  attempt_count integer     not null default 0 check (attempt_count >= 0),
  window_start  timestamptz not null default now(),
  blocked_until timestamptz,
  updated_at    timestamptz not null default now()
);

create index if not exists customer_dashboard_rate_limits_blocked_until_idx
  on public.customer_dashboard_rate_limits(blocked_until);

create or replace function public.check_customer_dashboard_rate_limit(
  p_identifier text,
  p_max_attempts integer default 10,
  p_window_seconds integer default 900,
  p_block_seconds integer default 900
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_row public.customer_dashboard_rate_limits%rowtype;
  v_window interval := make_interval(secs => p_window_seconds);
  v_block interval := make_interval(secs => p_block_seconds);
  v_retry_after integer := 0;
begin
  if p_identifier is null or length(trim(p_identifier)) = 0 then
    return jsonb_build_object(
      'allowed', false,
      'retry_after_seconds', greatest(p_block_seconds, 1),
      'reason', 'invalid_identifier'
    );
  end if;

  insert into public.customer_dashboard_rate_limits(identifier, attempt_count, window_start, updated_at)
  values (p_identifier, 0, v_now, v_now)
  on conflict (identifier) do nothing;

  select *
    into v_row
    from public.customer_dashboard_rate_limits
   where identifier = p_identifier
   for update;

  if v_row.blocked_until is not null and v_row.blocked_until > v_now then
    v_retry_after := greatest(ceil(extract(epoch from (v_row.blocked_until - v_now)))::integer, 1);

    return jsonb_build_object(
      'allowed', false,
      'retry_after_seconds', v_retry_after,
      'reason', 'blocked'
    );
  end if;

  if v_row.window_start <= v_now - v_window then
    update public.customer_dashboard_rate_limits
       set attempt_count = 1,
           window_start = v_now,
           blocked_until = null,
           updated_at = v_now
     where identifier = p_identifier;

    return jsonb_build_object(
      'allowed', true,
      'remaining', greatest(p_max_attempts - 1, 0),
      'reason', 'allowed'
    );
  end if;

  v_row.attempt_count := v_row.attempt_count + 1;

  if v_row.attempt_count > p_max_attempts then
    update public.customer_dashboard_rate_limits
       set attempt_count = v_row.attempt_count,
           blocked_until = v_now + v_block,
           updated_at = v_now
     where identifier = p_identifier;

    return jsonb_build_object(
      'allowed', false,
      'retry_after_seconds', greatest(p_block_seconds, 1),
      'reason', 'limit_exceeded'
    );
  end if;

  update public.customer_dashboard_rate_limits
     set attempt_count = v_row.attempt_count,
         blocked_until = null,
         updated_at = v_now
   where identifier = p_identifier;

  return jsonb_build_object(
    'allowed', true,
    'remaining', greatest(p_max_attempts - v_row.attempt_count, 0),
    'reason', 'allowed'
  );
end;
$$;

alter table public.customer_dashboard_rate_limits enable row level security;

revoke all on public.customer_dashboard_rate_limits from anon, authenticated;
revoke all on function public.check_customer_dashboard_rate_limit(text, integer, integer, integer) from anon, authenticated;
grant execute on function public.check_customer_dashboard_rate_limit(text, integer, integer, integer) to service_role;
