import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const query = "GameLayer gamification API";
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing SERPAPI_KEY in environment." });
    }

    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&engine=google&api_key=${apiKey}`;
    const r = await fetch(url);
    const data = await r.json();
    const results = data.organic_results || [];
    const found = results.some((r: any) => (r.link || "").includes("gamelayer.io"));
    const timestamp = new Date().toISOString();
    const payload = { query, found, timestamp };

    // write to /tmp (ephemeral on Vercel, fine for demo)
    try {
      fs.writeFileSync(path.join("/tmp", "last_check.json"), JSON.stringify(payload));
    } catch {}

    res.status(200).json(payload);
  } catch (err: any) {
    res.status(500).json({ error: "Check failed", details: err.message });
  }
}

