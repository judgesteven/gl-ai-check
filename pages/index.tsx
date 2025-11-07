import { useEffect, useState } from "react";

interface CheckedQuery {
  query: string;
  rank: number | null;
}

interface Status {
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
          GameLayer Search Visibility Monitor
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
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  margin: "1em 0 2em 0",
                  textAlign: "center"
                }}>
                  Last checked: {status.timestamp ? new Date(status.timestamp).toLocaleString() : "Unknown"}
                </p>

                <div style={{
                  overflowX: "auto",
                  marginTop: "1em"
                }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "0 auto",
                    maxWidth: "700px"
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          borderBottom: "2px solid #e5e7eb",
                          padding: "0.75em 1em",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#6b7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em"
                        }}>
                          Query
                        </th>
                        <th style={{
                          borderBottom: "2px solid #e5e7eb",
                          padding: "0.75em 1em",
                          textAlign: "center",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#6b7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em"
                        }}>
                          Rank
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {status.checked?.map((q, i) => {
                        const hasRank = q.rank !== null;
                        return (
                          <tr key={i} style={{
                            backgroundColor: hasRank ? (q.rank! <= 10 ? "#f0fdf4" : q.rank! <= 50 ? "#fef3c7" : "#fef2f2") : "#f9fafb",
                            transition: "background-color 0.2s"
                          }}>
                            <td style={{
                              borderBottom: "1px solid #e5e7eb",
                              padding: "0.875em 1em",
                              textAlign: "left",
                              color: "#374151",
                              fontSize: "0.9375rem"
                            }}>
                              {q.query}
                            </td>
                            <td style={{
                              borderBottom: "1px solid #e5e7eb",
                              padding: "0.875em 1em",
                              textAlign: "center",
                              fontWeight: "600",
                              color: hasRank 
                                ? (q.rank! <= 10 ? "#16a34a" : q.rank! <= 50 ? "#d97706" : "#dc2626")
                                : "#6b7280",
                              fontSize: "0.9375rem"
                            }}>
                              {q.rank
                                ? `#${q.rank}`
                                : "❌ Not in Top 100"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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

