alter table invite_reward_redemptions
  add column if not exists pro_days integer,
  add column if not exists reward_ledger_entry_id bigint,
  add column if not exists reward_event_id bigint,
  add column if not exists subscription_id bigint,
  add column if not exists receipt_id bigint,
  add column if not exists requested_at timestamptz not null default now(),
  add column if not exists completed_at timestamptz,
  add column if not exists failed_at timestamptz,
  add column if not exists failure_reason text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'invite_reward_redemptions_reward_ledger_entry_fk'
  ) then
    alter table invite_reward_redemptions
      add constraint invite_reward_redemptions_reward_ledger_entry_fk
      foreign key (reward_ledger_entry_id) references invite_reward_ledger(id) on delete set null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'invite_reward_redemptions_reward_event_fk'
  ) then
    alter table invite_reward_redemptions
      add constraint invite_reward_redemptions_reward_event_fk
      foreign key (reward_event_id) references invite_reward_events(id) on delete set null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'invite_reward_redemptions_subscription_fk'
  ) then
    alter table invite_reward_redemptions
      add constraint invite_reward_redemptions_subscription_fk
      foreign key (subscription_id) references member_subscriptions(id) on delete set null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'invite_reward_redemptions_receipt_fk'
  ) then
    alter table invite_reward_redemptions
      add constraint invite_reward_redemptions_receipt_fk
      foreign key (receipt_id) references purchase_receipts(id) on delete set null;
  end if;
end $$;

alter table invite_reward_redemptions
  drop constraint if exists invite_reward_redemptions_status_check;

alter table invite_reward_redemptions
  add constraint invite_reward_redemptions_status_check
  check (status in ('requested', 'completed', 'failed'));

alter table invite_reward_redemptions
  drop constraint if exists invite_reward_redemptions_pro_days_check;

alter table invite_reward_redemptions
  add constraint invite_reward_redemptions_pro_days_check
  check (pro_days is null or pro_days > 0);

create index if not exists idx_invite_reward_redemptions_user_requested_at
  on invite_reward_redemptions(user_id, requested_at desc);
create index if not exists idx_invite_reward_redemptions_status_requested_at
  on invite_reward_redemptions(status, requested_at desc);

create table if not exists invite_program_mode_audit (
  id bigserial primary key,
  changed_by_user_id bigint not null references users(id) on delete cascade,
  from_mode text not null,
  to_mode text not null,
  reason text,
  meta_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (from_mode in ('off', 'earn_only', 'live', 'paused')),
  check (to_mode in ('off', 'earn_only', 'live', 'paused'))
);

create index if not exists idx_invite_program_mode_audit_created_at
  on invite_program_mode_audit(created_at desc);
