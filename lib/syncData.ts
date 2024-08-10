import { airtableBase, supabase } from "./clients";

export async function syncAirtableToSupabase() {
  console.log("Starting syncAirtableToSupabase...");
  const airtableTable = process.env.AIRTABLE_TABLE_NAME || "";
  console.log("Airtable table:", airtableTable);

  const airtableRecords = await airtableBase(airtableTable).select().all();
  console.log("Airtable records fetched:", airtableRecords.length);

  for (const record of airtableRecords) {
    const { title, image, short_description } = record.fields;
    console.log("Processing record:", title);

    const { data, error } = await supabase
      .from("travlrd")
      .select("*")
      .eq("title", title);

    if (error) {
      console.error("Error fetching from Supabase:", error);
      continue;
    }

    if (data.length === 0) {
      console.log("Inserting new record into Supabase:", title);
      await supabase
        .from("travlrd")
        .insert({ title, image, short_description });
    } else {
      console.log("Updating existing record in Supabase:", title);
      await supabase
        .from("travlrd")
        .update({ image, short_description })
        .eq("title", title);
    }
  }
  console.log("syncAirtableToSupabase finished.");
}

export async function startSync() {
  await syncAirtableToSupabase();
}
