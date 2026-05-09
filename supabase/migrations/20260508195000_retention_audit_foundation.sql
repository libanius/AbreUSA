-- AbreUSA Retention Metadata And Audit Event Foundation
-- P8-T09 implementation artifact.
--
-- Scope:
-- - Add retention metadata to existing document rows.
-- - Add operational audit_events table.
-- - Keep physical file deletion out of scope.
-- - Keep Vercel Cron out of scope.

alter table public.documents
  add column if not exists retention_category text not null default 'sensitive_upload'
    check (
      retention_category in (
        'sensitive_upload',
        'generated_operational_file',
        'customer_metadata'
      )
    ),
  add column if not exists retention_eligible_at timestamptz,
  add column if not exists retention_status text not null default 'active'
    check (
      retention_status in (
        'active',
        'eligible_for_deletion',
        'deletion_pending',
        'deleted',
        'retained_by_exception'
      )
    ),
  add column if not exists deletion_status text not null default 'not_applicable'
    check (
      deletion_status in (
        'not_applicable',
        'pending',
        'success',
        'failed',
        'skipped',
        'manually_deferred'
      )
    ),
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by text,
  add column if not exists deletion_reason text,
  add column if not exists deletion_audit_id uuid;

create table if not exists public.audit_events (
  id            uuid        primary key default gen_random_uuid(),
  order_id      uuid        references public.orders(id) on delete set null,
  document_id   uuid        references public.documents(id) on delete set null,
  actor_id      uuid,
  actor_email   text,
  actor_type    text        not null check (actor_type in ('admin', 'system', 'automation')),
  event_type    text        not null check (
                              event_type in (
                                'document_signed_url_created',
                                'document_open_intent',
                                'document_download_intent',
                                'document_marked_eligible_for_deletion',
                                'document_deletion_attempted',
                                'document_deleted',
                                'document_deletion_failed',
                                'order_status_updated',
                                'admin_login',
                                'admin_logout'
                              )
                            ),
  event_source  text        not null check (
                              event_source in (
                                'admin_portal',
                                'api_route',
                                'vercel_cron',
                                'manual_sop'
                              )
                            ),
  result        text        not null check (
                              result in ('success', 'failed', 'skipped', 'manually_deferred')
                            ),
  reason        text,
  metadata      jsonb       not null default '{}'::jsonb,
  error_message text,
  created_at    timestamptz not null default now()
);

create index if not exists documents_retention_status_idx
  on public.documents(retention_status, retention_eligible_at);

create index if not exists audit_events_order_id_created_at_idx
  on public.audit_events(order_id, created_at desc);

create index if not exists audit_events_document_id_created_at_idx
  on public.audit_events(document_id, created_at desc);

alter table public.audit_events enable row level security;
revoke all on public.audit_events from anon, authenticated;
