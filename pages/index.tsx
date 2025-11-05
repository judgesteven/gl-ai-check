import { useEffect, useState } from "react";

interface CheckedQuery {
  query: string;
  found: boolean;
}

interface Status {
  found?: boolean;
  foundQuery?: string | null;
  checked?: CheckedQuery[];
  timestamp?: string;
  error?: string;
  details?: string;
}

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/check");
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      setStatus({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runCheck(); }, []);

  return (
    <main style={{
      fontFamily: "system-ui, sans-serif",
      maxWidth: 700, margin: "4em auto", textAlign: "center", padding: "0 1em"
    }}>
      <h1>GameLayer LLM Visibility Monitor</h1>

      {status ? (
        <>
          {status.error ? (
            <div style={{ color: "#dc2626", padding: "1em" }}>
              <p><strong>Error:</strong> {status.error}</p>
              {status.details && <p><small>{status.details}</small></p>}
            </div>
          ) : (
            <>
              <p><strong>Status:</strong></p>
              <p style={{ fontSize: "2rem" }}>
                {status.found ? "✅ Found in results" : "❌ Not yet visible"}
              </p>
              {status.foundQuery && (
                <p><em>Matched Query:</em> "{status.foundQuery}"</p>
              )}
              <p><small>Last checked: {status.timestamp ? new Date(status.timestamp).toLocaleString() : "Unknown"}</small></p>

              <h2 style={{ marginTop: "2em" }}>Queries Checked</h2>
              <ul style={{ textAlign: "left", display: "inline-block" }}>
                {status.checked?.map((q, i) => (
                  <li key={i}>
                    {q.found ? "✅" : "❌"} {q.query}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : <p>Loading...</p>}

      <button
        onClick={runCheck}
        disabled={loading}
        style={{
          marginTop: "1.5em", padding: "0.6em 1.2em", borderRadius: 6,
          border: "none", background: loading ? "#9ca3af" : "#2563eb", 
          color: "white", cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1rem"
        }}
      >
        {loading ? "Checking..." : "Run Check Now"}
      </button>
    </main>
  );
}

