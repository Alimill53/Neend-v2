// Explicit schema contract while hosted type regeneration is unavailable.
import type { Json } from '@/integrations/supabase/types';
export type CommerceSchema = {
  public: {
    Tables: {
      newsletter_requests: {
        Row: { id: string; email: string; consent_version: string; requested_at: string; status: string };
        Insert: { id?: string; email: string; consent_version: string; requested_at?: string; status?: string };
        Update: { email?: string; consent_version?: string; status?: string };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      consume_request_limit: { Args: { p_key: string; p_limit: number; p_seconds: number }; Returns: boolean };
      change_guest_cart: { Args: { p_hash: string; p_product?: string | undefined; p_delta?: number }; Returns: Json };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};