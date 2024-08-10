import { airtableBase, supabase } from "./clients";

let retryCount = 0;
const maxRetries = 5;
let isRetrying = false;

export function subscribeToSupabaseChanges() {
  if (isRetrying) return;
  isRetrying = true;

  const airtableTable = process.env.AIRTABLE_TABLE_NAME || "";
  console.log("Airtable table name:", airtableTable);

  const channel = supabase
    .channel("public:travlrd")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "travlrd" },
      async (payload: any) => {
        console.log("Change received!", payload);
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const { title, image, short_description } = payload.new;
          console.log("Inserting/updating record in Airtable:", {
            title,
            image,
            short_description,
          });

          try {
            const filterFormula = `AND({title} = "${title}", {image} = "${image}", {short_description} = "${short_description}")`;
            console.log("Filter formula:", filterFormula);

            const existingRecords = await airtableBase(airtableTable)
              .select({
                filterByFormula: filterFormula,
              })
              .all();

            console.log("Existing records found:", existingRecords.length);

            if (existingRecords.length === 0) {
              await airtableBase(airtableTable).create([
                {
                  fields: {
                    title: title || "",
                    image: image || "",
                    short_description: short_description || "",
                  },
                },
              ]);
              console.log("Record inserted into Airtable.");
            } else {
              console.log("Duplicate record found. Skipping insert.");
            }
          } catch (error) {
            console.error("Error during Airtable operation:", error);
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Successfully subscribed to Supabase changes");
        retryCount = 0;
        isRetrying = false;
      } else if (status === "CLOSED") {
        console.error("Subscription closed");
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(() => {
            isRetrying = false;
            subscribeToSupabaseChanges();
          }, 2000);
        } else {
          console.error("Max retries reached. Subscription failed.");
          isRetrying = false;
        }
      }
    });

  return channel;
}
