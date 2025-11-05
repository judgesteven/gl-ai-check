# GameLayer LLM Visibility Monitor

A minimal Next.js web app that monitors whether "GameLayer" appears in Google search results for "GameLayer gamification API". Built for deployment on Vercel.

## Features

- ✅ Automated Google search monitoring via SerpAPI
- ✅ Simple dashboard UI showing latest check results
- ✅ Manual "Run Check Now" button for on-demand checks
- ✅ Secure API key handling (never exposed to client)
- ✅ Status indicator: ✅ FOUND or ❌ NOT YET VISIBLE
- ✅ Timestamp tracking for each check

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variable:
   - Create a `.env.local` file in the root directory
   - Add: `SERPAPI_KEY=your_serpapi_key_here`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: GameLayer visibility monitor"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `judgesteven/gl-ai-check`

3. **Configure Environment Variable:**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `SERPAPI_KEY` = `your_actual_serpapi_key`
   - **Important:** Never commit your API key to the repository

4. **Deploy:**
   - Vercel will automatically deploy on push
   - Visit your app at `https://gl-ai-check.vercel.app`

## Automated Monitoring

To set up automated checks (e.g., weekly), you can use a service like UptimeRobot:
- Create a monitor that hits: `https://your-app.vercel.app/api/check`
- Set it to run weekly or daily
- This will keep the latest check result updated

## Project Structure

```
gl-ai-check/
├── pages/
│   ├── index.tsx          # Dashboard UI
│   └── api/
│       └── check.ts       # API route for SerpAPI check
├── package.json
├── tsconfig.json
└── next.config.js
```

## API Endpoint

**GET `/api/check`**

Returns JSON:
```json
{
  "query": "GameLayer gamification API",
  "found": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

Or error:
```json
{
  "error": "Check failed",
  "details": "Error message"
}
```

## Security Notes

- The `SERPAPI_KEY` is only used server-side in `/pages/api/check.ts`
- Never exposed to client-side code
- Stored securely in Vercel environment variables
- Last check result is saved to `/tmp/last_check.json` (ephemeral on Vercel)

