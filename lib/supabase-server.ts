import { createClient } from "@supabase/supabase-js";

type AbreUsaDatabase = {
  public: {
    Tables: {
      orders: {
        Row: { id: string; protocol_number: string };
        Insert: {
          service_type: string;
          status: string;
          approved_at: string;
          onboarding_entry_mode?: "manual" | "document_assisted";
          document_extraction_status?:
            | "not_started"
            | "pending"
            | "completed"
            | "failed";
          extracted_applicant_data?: Record<string, unknown>;
          extracted_address_data?: Record<string, unknown>;
          extraction_confidence?: number | null;
          user_confirmed_extracted_data?: boolean;
          agent_summary?: string | null;
          missing_information_flags?: string[];
        };
        Update: {
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      applicants: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          name: string;
          email: string;
          phone: string;
          residential_street?: string | null;
          residential_city?: string | null;
          residential_state?: string | null;
          residential_zip?: string | null;
        };
        Update: never;
        Relationships: [];
      };
      llcs: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          legal_name: string;
          state: string;
          business_activity_label: string;
          principal_street: string;
          principal_city: string;
          principal_state: string;
          principal_zip: string;
          principal_same_as_applicant_address?: boolean;
          management_type: string;
          member_count: number;
        };
        Update: never;
        Relationships: [];
      };
      members: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          member_index: number;
          full_name: string;
          address: string;
          ownership_percentage: number;
        };
        Update: never;
        Relationships: [];
      };
      registered_agents: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          choice: string | null;
          name: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
        };
        Update: never;
        Relationships: [];
      };
      ein_details: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          reason_for_applying: string | null;
          entity_type: string | null;
          responsible_party_name: string;
          responsible_party_passport_number: string;
          start_date: string;
          fiscal_closing_month: string;
        };
        Update: never;
        Relationships: [];
      };
      generated_forms: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          form_type: string;
          customer_approved: boolean;
        };
        Update: never;
        Relationships: [];
      };
      documents: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          document_type: string;
          file_name: string;
          mime_type: string;
          storage_path: string;
          retention_category?: string;
          retention_status?: string;
          deletion_status?: string;
        };
        Update: {
          retention_eligible_at?: string;
          retention_status?: string;
          deletion_status?: string;
          deleted_at?: string;
          deleted_by?: string;
          deletion_reason?: string;
          deletion_audit_id?: string;
        };
        Relationships: [];
      };
      audit_events: {
        Row: Record<string, unknown>;
        Insert: {
          order_id?: string | null;
          document_id?: string | null;
          actor_id?: string | null;
          actor_email?: string | null;
          actor_type: string;
          event_type: string;
          event_source: string;
          result: string;
          reason?: string | null;
          metadata?: Record<string, unknown>;
          error_message?: string | null;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let serverClient: ReturnType<typeof createClient<AbreUsaDatabase>> | null = null;

export function getSupabaseServerClient() {
  if (serverClient) return serverClient;

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase server environment variables. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for server-side persistence.",
    );
  }

  serverClient = createClient<AbreUsaDatabase>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClient;
}
