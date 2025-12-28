import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://parezqsstinqzfrnvwgx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcmV6cXNzdGlucXpmcm52d2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjMyODAsImV4cCI6MjA3NjE5OTI4MH0.hWwJ0CDGvQRvu_ZbYD7TlUg15Kq3rQwADG-nO34-Ynk";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
