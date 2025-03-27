import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dftgdnxeyljzdxmfyzfk.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdGdkbnhleWxqemR4bWZ5emZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODkwMjAsImV4cCI6MjA1ODY2NTAyMH0.w3cI6vhWGY_d6AOMDd0fik4Y5fkM78UrQhqduVxtzGw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
