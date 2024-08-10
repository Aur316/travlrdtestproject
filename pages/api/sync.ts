import type { NextApiRequest, NextApiResponse } from "next";
import { syncAirtableToSupabase } from "../../lib/syncData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await syncAirtableToSupabase();
    res.status(200).json({ message: "Sync initiated" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
