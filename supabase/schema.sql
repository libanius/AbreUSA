-- AbreUSA Order Persistence Schema
-- Minimum persistence boundary for approved orders.
--
-- Blocked tables (not included):
--   (all tables now implemented; retention period and reviewer access model remain Phase 7 decisions)
--
-- RLS policies are not defined here; configure before production deployment.
-- Apply in the Supabase SQL editor before running P6-T04.

-- Collision-resistant protocol counter (run this before creating the orders table,
-- or alter the column default if orders already exists).
create sequence if not exists order_protocol_seq start 1;

create table if not exists orders (
  id               uuid        primary key default gen_random_uuid(),
  protocol_number  text        not null unique
                               default ('AUS-' || to_char(now(), 'YYYY') || '-'
                                        || lpad(nextval('order_protocol_seq')::text, 4, '0')),
  service_type     text        not null check (service_type in ('complete_llc_ein', 'florida_llc')),
  status           text        not null default 'approved' check (
                                 status in (
                                   'draft', 'awaiting_documents', 'ready_for_review', 'customer_reviewing',
                                   'approved', 'internal_review', 'submitted', 'completed', 'blocked'
                                 )
                               ),
  approved_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists llcs (
  id                      uuid        primary key default gen_random_uuid(),
  order_id                uuid        not null references orders(id) on delete cascade,
  legal_name              text        not null,
  state                   text        not null default 'FL',
  business_activity_label text        not null,
  principal_street        text        not null,
  principal_city          text        not null,
  principal_state         text        not null,
  principal_zip           text        not null,
  principal_same_as_applicant_address boolean not null default false,
  management_type         text        not null default 'member_managed',
  member_count            integer     not null,
  created_at              timestamptz not null default now()
);

create table if not exists members (
  id                   uuid        primary key default gen_random_uuid(),
  order_id             uuid        not null references orders(id) on delete cascade,
  member_index         integer     not null,
  full_name            text        not null,
  address              text        not null,
  ownership_percentage numeric     not null,
  created_at           timestamptz not null default now()
);

create table if not exists registered_agents (
  id       uuid        primary key default gen_random_uuid(),
  order_id uuid        not null references orders(id) on delete cascade,
  choice   text        not null check (choice in ('abreusa', 'self', 'other')),
  name     text,
  address  text,
  city     text,
  state    text,
  zip      text,
  created_at timestamptz not null default now()
);

create table if not exists ein_details (
  id                               uuid        primary key default gen_random_uuid(),
  order_id                         uuid        not null references orders(id) on delete cascade,
  reason_for_applying              text        not null,
  entity_type                      text        not null,
  responsible_party_name           text        not null,
  responsible_party_passport_number text       not null,
  start_date                       text        not null,
  fiscal_closing_month             text        not null,
  created_at                       timestamptz not null default now()
);

create table if not exists generated_forms (
  id                uuid        primary key default gen_random_uuid(),
  order_id          uuid        not null references orders(id) on delete cascade,
  form_type         text        not null check (form_type in ('florida_articles_of_organization', 'irs_ss4')),
  customer_approved boolean     not null default false,
  generated_at      timestamptz not null default now()
);

create table if not exists applicants (
  id         uuid        primary key default gen_random_uuid(),
  order_id   uuid        not null references orders(id) on delete cascade,
  name       text        not null,
  email      text        not null,
  phone      text        not null,
  residential_street text,
  residential_city   text,
  residential_state  text,
  residential_zip    text,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id             uuid        primary key default gen_random_uuid(),
  order_id       uuid        not null references orders(id) on delete cascade,
  document_type  text        not null check (document_type in ('passport', 'us_address_proof')),
  file_name      text        not null,
  mime_type      text        not null,
  storage_path   text        not null,
  retention_category text    not null default 'sensitive_upload' check (
                               retention_category in (
                                 'sensitive_upload',
                                 'generated_operational_file',
                                 'customer_metadata'
                               )
                             ),
  retention_eligible_at timestamptz,
  retention_status text      not null default 'active' check (
                               retention_status in (
                                 'active',
                                 'eligible_for_deletion',
                                 'deletion_pending',
                                 'deleted',
                                 'retained_by_exception'
                               )
                             ),
  deletion_status text       not null default 'not_applicable' check (
                               deletion_status in (
                                 'not_applicable',
                                 'pending',
                                 'success',
                                 'failed',
                                 'skipped',
                                 'manually_deferred'
                               )
                             ),
  deleted_at     timestamptz,
  deleted_by     text,
  deletion_reason text,
  deletion_audit_id uuid,
  created_at     timestamptz not null default now()
);

create table if not exists audit_events (
  id            uuid        primary key default gen_random_uuid(),
  order_id      uuid        references orders(id) on delete set null,
  document_id   uuid        references documents(id) on delete set null,
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
  on documents(retention_status, retention_eligible_at);

create index if not exists audit_events_order_id_created_at_idx
  on audit_events(order_id, created_at desc);

create index if not exists audit_events_document_id_created_at_idx
  on audit_events(document_id, created_at desc);
