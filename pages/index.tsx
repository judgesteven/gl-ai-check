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
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        setStatus({ error: errorData.error || "Request failed", details: errorData.details });
      } else {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e: any) {
      setStatus({ error: "Request failed", details: e.message || "Network error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runCheck(); }, []);

  return (
    <main style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      maxWidth: 800,
      margin: "0 auto",
      padding: "2em 1em",
      minHeight: "100vh",
      backgroundColor: "#f9fafb"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        padding: "2.5em",
        marginBottom: "2em"
      }}>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#111827",
          margin: "0 0 0.5em 0",
          textAlign: "center"
        }}>
          GameLayer LLM Visibility Monitor
        </h1>

        {status ? (
          <>
            {status.error ? (
              <div style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "1.5em",
                marginTop: "1.5em"
              }}>
                <p style={{ color: "#dc2626", margin: "0 0 0.5em 0", fontWeight: "600" }}>
                  <strong>Error:</strong> {status.error}
                </p>
                {status.details && (
                  <p style={{ color: "#991b1b", margin: 0, fontSize: "0.875rem" }}>
                    {status.details}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div style={{
                  backgroundColor: status.found ? "#f0fdf4" : "#fef2f2",
                  border: `2px solid ${status.found ? "#86efac" : "#fca5a5"}`,
                  borderRadius: "8px",
                  padding: "1.5em",
                  marginTop: "1.5em",
                  marginBottom: "1.5em"
                }}>
                  <p style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#6b7280",
                    margin: "0 0 0.5em 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Status
                  </p>
                  <p style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    margin: "0 0 0.5em 0",
                    color: status.found ? "#16a34a" : "#dc2626"
                  }}>
                    {status.found ? "✅ Found in results" : "❌ Not yet visible"}
                  </p>
                  {status.foundQuery && (
                    <p style={{
                      fontSize: "1rem",
                      color: "#374151",
                      margin: "0.5em 0",
                      fontStyle: "italic"
                    }}>
                      <strong>Matched Query:</strong> "{status.foundQuery}"
                    </p>
                  )}
                  <p style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    margin: "1em 0 0 0"
                  }}>
                    Last checked: {status.timestamp ? new Date(status.timestamp).toLocaleString() : "Unknown"}
                  </p>
                </div>

                <div style={{
                  marginTop: "2em",
                  paddingTop: "2em",
                  borderTop: "1px solid #e5e7eb"
                }}>
                  <h2 style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 1em 0",
                    textAlign: "center"
                  }}>
                    Queries Checked
                  </h2>
                  <ul style={{
                    textAlign: "left",
                    display: "inline-block",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    width: "100%",
                    maxWidth: "600px"
                  }}>
                    {status.checked?.map((q, i) => (
                      <li key={i} style={{
                        padding: "0.75em 1em",
                        margin: "0.5em 0",
                        backgroundColor: q.found ? "#f0fdf4" : "#f9fafb",
                        borderRadius: "6px",
                        border: `1px solid ${q.found ? "#86efac" : "#e5e7eb"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75em"
                      }}>
                        <span style={{
                          fontSize: "1.25rem",
                          flexShrink: 0
                        }}>
                          {q.found ? "✅" : "❌"}
                        </span>
                        <span style={{
                          color: "#374151",
                          fontSize: "0.9375rem"
                        }}>
                          {q.query}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "3em 0",
            color: "#6b7280"
          }}>
            <p style={{ fontSize: "1.125rem" }}>Loading...</p>
          </div>
        )}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        width: "100%"
      }}>
        <button
          onClick={runCheck}
          disabled={loading}
          style={{
            padding: "0.875em 2em",
            borderRadius: "8px",
            border: "none",
            background: loading ? "#9ca3af" : "#2563eb",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            boxShadow: loading ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            transition: "all 0.2s ease",
            width: "100%",
            maxWidth: "300px"
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#1d4ed8";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#2563eb";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
            }
          }}
        >
          {loading ? "Checking..." : "Run Check Now"}
        </button>
      </div>
    </main>
  );
}

