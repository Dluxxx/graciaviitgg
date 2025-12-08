import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bgiwwpvpgcjoyfojusep.supabase.co",       // ganti
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaXd3cHZwZ2Nqb3lmb2p1c2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTM1NDEsImV4cCI6MjA4MDc2OTU0MX0.l4KOfvlDACLyHIqSsPIViVExq0GK9TcQq7KU2VVSKGw"                    // ganti
);
