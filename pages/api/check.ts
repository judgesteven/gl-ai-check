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
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing SERPAPI_KEY environment variable." });
    }

    const queries = [
      "gamification platform",
      "gamification API",
      "gamification API platform",
      "gamification tools for developers",
      "add gamification to app",
      "missions and achievements API",
      "user engagement platform",
      "user engagement API",
      "loyalty gamification platform",
      "customer retention gamification",
      "gamification for user engagement"
    ];

    const checked: Array<{ query: string; rank: number | null }> = [];
    let found = false;
    let foundQuery: string | null = null;

    for (const q of queries) {
      const url = `https://serpapi.com/search.json?q=${encodeURIComponent(q)}&engine=google&num=100&api_key=${apiKey}`;
      const r = await fetch(url);
      const data = await r.json();
      const results = data.organic_results || [];

      let rank: number | null = null;
      for (const item of results) {
        if ((item.link || "").includes("gamelayer.io")) {
          rank = item.position || null;
          if (!found) {
            found = true;
            foundQuery = q;
          }
          break;
        }
      }
      checked.push({ query: q, rank });
    }

    const timestamp = new Date().toISOString();
    const payload = { found, foundQuery, timestamp, checked };

    // write to /tmp (ephemeral on Vercel, fine for demo)
    try {
      fs.writeFileSync(path.join("/tmp", "last_check.json"), JSON.stringify(payload, null, 2));
    } catch {}

    res.status(200).json(payload);
  } catch (err: any) {
    res.status(500).json({ error: "Monitoring failed", details: err.message });
  }
}

