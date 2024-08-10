import { createClient } from "@supabase/supabase-js";
import Airtable from "airtable";

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_API_KEY || ""
);

// Airtable setup
const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
  process.env.AIRTABLE_BASE_ID || ""
);

export { supabase, airtableBase };
