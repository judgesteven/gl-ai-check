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
      "gamification API",
      "gamification API platform",
      "gamification tools for developers",
      "gamification as a service",
      "missions and achievements API",
      "add gamification to app",
      "loyalty gamification platform"
    ];

    let found = false;
    let foundQuery: string | null = null;
    const checked: Array<{ query: string; found: boolean }> = [];

    for (const q of queries) {
      const url = `https://serpapi.com/search.json?q=${encodeURIComponent(q)}&engine=google&api_key=${apiKey}`;
      const r = await fetch(url);
      const data = await r.json();
      const results = data.organic_results || [];
      const hit = results.some((r: any) => (r.link || "").includes("gamelayer.io"));
      checked.push({ query: q, found: hit });
      if (hit) {
        found = true;
        foundQuery = q;
        break;
      }
    }

    const timestamp = new Date().toISOString();
    const payload = { found, foundQuery, checked, timestamp };

    // write to /tmp (ephemeral on Vercel, fine for demo)
    try {
      fs.writeFileSync(path.join("/tmp", "last_check.json"), JSON.stringify(payload, null, 2));
    } catch {}

    res.status(200).json(payload);
  } catch (err: any) {
    res.status(500).json({ error: "Monitoring failed", details: err.message });
  }
}

