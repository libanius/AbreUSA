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
        };
        Update: never;
        Relationships: [];
      };
      applicants: {
        Row: Record<string, unknown>;
        Insert: {
          order_id: string;
          name: string;
          email: string;
          phone: string;
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
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  serverClient = createClient<AbreUsaDatabase>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClient;
}
