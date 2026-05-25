import { useState } from "react";
import axios from "axios";

interface ContentDocument {
  id: string;
  title: string;
  body: string;
  content_type: string;
  deep_link: string;
  tags: string[];
  category: string;
  author_type: string;
  created_at: number;
  moderation_status: string;
  risk_score: number;
}

interface SearchHit {
  document: ContentDocument;
}

interface QueryAnalysis {
  intent: string;
  entities: string[];
  risk_level: string;
  query_expansions: string[];
  recommended_content_mix: {
    practitioners: number;
    protocols: number;
    community: number;
  };
}

interface SearchResponse {
  query: string;
  analysis: QueryAnalysis;
  results: SearchHit[];
  aiOverview: string;
  suppressedCount: number;
}

const C = {
  primary:       "#2D6A4F",
  primaryLight:  "#40916C",
  primaryBg:     "#f0f7f4",
  bg:            "#f4f6f5",
  card:          "#ffffff",
  border:        "#e2e8e5",
  text:          "#1a2e25",
  muted:         "#5a7065",
  riskHighColor: "#dc2626",
  riskHighBg:    "#fef2f2",
  riskMedColor:  "#d97706",
  riskMedBg:     "#fffbeb",
  riskLowColor:  "#16a34a",
  riskLowBg:     "#f0fdf4",
};

function riskStyle(level: string) {
  if (level === "high")   return { color: C.riskHighColor, bg: C.riskHighBg, border: C.riskHighColor };
  if (level === "medium") return { color: C.riskMedColor,  bg: C.riskMedBg,  border: C.riskMedColor  };
  return                         { color: C.riskLowColor,  bg: C.riskLowBg,  border: C.riskLowColor  };
}

function typeBadgeColor(type: string) {
  const map: Record<string, string> = {
    practitioner: C.primary,
    protocol:     "#1d4ed8",
    community:    "#7c3aed",
  };
  return map[type] ?? "#6b7280";
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

function buildFallbackOverview(query: string, analysis: QueryAnalysis, results: SearchHit[]): string {
  const entities = analysis.entities.length > 0
    ? analysis.entities.slice(0, 3).join(", ")
    : query;
  const types = [...new Set(results.map(r => r.document.content_type))];
  const typeList = types.length > 0
    ? types.map(t => t + "s").join(", ")
    : "wellness resources";
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    `${cap(query)}-related wellness content on Just Holistics spans ${typeList} focused on ${entities} and related holistic health approaches.\n\n` +
    `Users can explore practitioner recommendations, structured protocols, and community discussions to support their wellness journey. ` +
    `Content has been retrieved and ranked based on relevance to your search and our moderation standards.`
  );
}

function SectionHeader({ icon, label, count }: { icon: string; label: string; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, marginTop: 28 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text }}>{label}</h2>
      <span style={{
        background: C.primaryBg, color: C.primary, border: `1px solid #b7dfc9`,
        borderRadius: 20, padding: "1px 10px", fontSize: 12, fontWeight: 600,
      }}>{count}</span>
    </div>
  );
}

function ResultCard({ item, onSave, saved }: {
  item: SearchHit;
  onSave?: (id: string) => void;
  saved?: boolean;
}) {
  const doc = item.document;
  const type = doc.content_type;

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 20,
      marginBottom: 12,
    }}>
      {/* TITLE + BADGE */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>
          {doc.title}
        </h3>
        <span style={{
          background: typeBadgeColor(type), color: "#fff",
          borderRadius: 4, padding: "2px 9px",
          fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
          textTransform: "capitalize", whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {type}
        </span>
      </div>

      {/* BODY */}
      <p style={{ margin: "0 0 14px", fontSize: 14, color: C.muted, lineHeight: 1.65 }}>
        {doc.body}
      </p>

      {/* TAGS */}
      {doc.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {doc.tags.map((tag, i) => (
            <span key={i} style={{
              background: C.primaryBg, color: C.primary,
              borderRadius: 4, padding: "2px 8px",
              fontSize: 11, fontWeight: 500,
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 12, borderTop: `1px solid ${C.border}`, flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: C.muted }}>
            <strong style={{ color: C.text }}>Category:</strong> {doc.category}
          </span>
          <span style={{ fontSize: 12, color: C.muted }}>
            <strong style={{ color: C.text }}>Author:</strong> {doc.author_type}
          </span>
          <span style={{ fontSize: 12, color: C.muted }}>
            <strong style={{ color: C.text }}>Published:</strong> {formatDate(doc.created_at)}
          </span>
        </div>

        {/* ACTION BUTTON */}
        {type === "practitioner" && (
          <a
            href={doc.deep_link}
            target="_blank"
            rel="noreferrer"
            style={{
              background: C.primary, color: "#fff",
              border: "none", borderRadius: 6,
              padding: "7px 14px", fontSize: 12, fontWeight: 600,
              textDecoration: "none", cursor: "pointer",
            }}
          >
            View Practitioner
          </a>
        )}
        {type === "protocol" && (
          <button
            onClick={() => onSave?.(doc.id)}
            style={{
              background: saved ? C.primaryBg : C.primary,
              color: saved ? C.primary : "#fff",
              border: saved ? `1px solid #b7dfc9` : "none",
              borderRadius: 6, padding: "7px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            {saved ? "Saved ✓" : "Save Protocol"}
          </button>
        )}
        {type === "community" && (
          <a
            href={doc.deep_link}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#7c3aed", color: "#fff",
              border: "none", borderRadius: 6,
              padding: "7px 14px", fontSize: 12, fontWeight: 600,
              textDecoration: "none", cursor: "pointer",
            }}
          >
            Join Discussion
          </a>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery]     = useState<string>("");
  const [data, setData]       = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError]     = useState<string | null>(null);
  const [saved, setSaved]     = useState<Set<string>>(new Set());

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post<SearchResponse>("http://localhost:5000/search", { query });
      setData(res.data);
    } catch {
      setError("Search failed. Make sure the server is running.");
    }
    setLoading(false);
  }

  function toggleSave(id: string) {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const practitioners = data?.results.filter(r => r.document.content_type === "practitioner") ?? [];
  const protocols     = data?.results.filter(r => r.document.content_type === "protocol")     ?? [];
  const community     = data?.results.filter(r => r.document.content_type === "community")    ?? [];
  const risk          = data?.analysis ? riskStyle(data.analysis.risk_level) : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`,
        padding: "40px 40px 60px",
        color: "#fff",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.7, marginBottom: 6, textTransform: "uppercase" }}>
            AI-Powered Wellness Discovery
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            Just Holistics Search
          </h1>
          <p style={{ margin: 0, opacity: 0.75, fontSize: 14 }}>
            Intelligent search across practitioners, protocols, and community discussions
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ maxWidth: 1000, margin: "-28px auto 0", padding: "0 40px" }}>
        <div style={{
          background: C.card, borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          display: "flex", alignItems: "center",
          padding: "8px 8px 8px 20px", gap: 8,
        }}>
          <span style={{ fontSize: 18, opacity: 0.4 }}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search wellness topics, practitioners, protocols..."
            style={{
              flex: 1, border: "none", outline: "none",
              fontSize: 16, color: C.text, background: "transparent",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              background: loading ? "#a8d5bc" : C.primary,
              color: "#fff", border: "none", borderRadius: 8,
              padding: "12px 28px", fontSize: 15, fontWeight: 600,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1000, margin: "32px auto", padding: "0 40px 80px" }}>

        {error && (
          <div style={{
            background: C.riskHighBg, border: `1px solid #fca5a5`,
            borderRadius: 8, padding: "14px 18px",
            color: C.riskHighColor, marginBottom: 24, fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!data && !loading && !error && (
          <div style={{ textAlign: "center", padding: "70px 0", color: C.muted }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🌿</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Search for wellness content to get started</div>
            <div style={{ fontSize: 13, marginTop: 8, opacity: 0.8 }}>
              Try "inflammation", "sleep protocols", or "functional medicine"
            </div>
          </div>
        )}

        {data && (
          <>
            {/* ── RAW QUERY ── */}
            <div style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 20,
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: C.primary,
                textTransform: "uppercase",
                marginBottom: 8
              }}>
                Raw Query
              </div>

              <div style={{
                fontSize: 15,
                color: C.text,
                fontWeight: 500
              }}>
                {data.query}
              </div>
            </div>
            {/* ── SAFETY BANNER — full width ── */}
            {(data.analysis.risk_level === "high" || data.analysis.risk_level === "medium") && (
              <div style={{
                background: risk!.bg, border: `1px solid ${risk!.border}`,
                borderRadius: 10, padding: "16px 20px", marginBottom: 20,
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: risk!.color, marginBottom: 4 }}>
                    {data.analysis.risk_level === "high"
                      ? "High-risk wellness topic detected"
                      : "Sensitive wellness topic detected"}
                  </div>
                  <div style={{ fontSize: 13, color: risk!.color, opacity: 0.9, lineHeight: 1.5 }}>
                    This content is informational only and should not replace professional medical guidance.
                    Always consult a qualified healthcare practitioner before making health decisions.
                  </div>
                </div>
              </div>
            )}

            {/* ── AI OVERVIEW — full width ── */}
            <div style={{
              background: C.card, borderRadius: 12,
              border: `1px solid ${C.border}`, borderTop: `3px solid ${C.primary}`,
              marginBottom: 24, overflow: "hidden",
            }}>
              <div style={{
                background: C.primaryBg, padding: "13px 24px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>✦</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: C.primary,
                  textTransform: "uppercase"
                }}>
                  Final AI Overview
                </span>

                <span style={{
                  background: "#e8f7ee",
                  color: C.primary,
                  border: "1px solid #b7dfc9",
                  borderRadius: 20,
                  padding: "2px 10px",
                  fontSize: 10,
                  fontWeight: 700
                }}>
                  Grounded in JH Content
                </span>
              </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <p style={{ margin: "0 0 18px", fontSize: 15, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {data.aiOverview || buildFallbackOverview(data.query, data.analysis, data.results)}
                </p>
                <div style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: C.muted,
                  lineHeight: 1.6
                }}>
                  The overview above is generated from retrieved Just Holistics content and linked resources below.
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {practitioners.length > 0 && (
                    <a href="#practitioners" style={{
                      background: C.primaryBg, color: C.primary,
                      border: `1px solid #b7dfc9`, borderRadius: 6,
                      padding: "7px 14px", fontSize: 12, fontWeight: 600,
                      textDecoration: "none",
                    }}>
                      👨‍⚕️ View Practitioners
                    </a>
                  )}
                  {protocols.length > 0 && (
                    <a href="#protocols" style={{
                      background: "#eff6ff", color: "#1d4ed8",
                      border: "1px solid #bfdbfe", borderRadius: 6,
                      padding: "7px 14px", fontSize: 12, fontWeight: 600,
                      textDecoration: "none",
                    }}>
                      📋 Explore Protocols
                    </a>
                  )}
                  {community.length > 0 && (
                    <a href="#community" style={{
                      background: "#f5f3ff", color: "#7c3aed",
                      border: "1px solid #ddd6fe", borderRadius: 6,
                      padding: "7px 14px", fontSize: 12, fontWeight: 600,
                      textDecoration: "none",
                    }}>
                      💬 Join Community
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ── SUPPRESSED CONTENT — full width ── */}
            {data.suppressedCount > 0 && (
              <div style={{
                background: "#fffbeb", border: "1px solid #fcd34d",
                borderRadius: 8, padding: "12px 16px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 10,
                fontSize: 13, color: "#92400e",
              }}>
                <span style={{ fontSize: 16 }}>🛡️</span>
                <span>
                  <strong>{data.suppressedCount} item{data.suppressedCount !== 1 ? "s" : ""} hidden pending moderation review</strong>
                  {" "}— our safety team is reviewing this content before it is made visible.
                </span>
              </div>
            )}

            {/* ── TWO-COLUMN: ANALYSIS + RESULTS ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: window.innerWidth < 900 ? "1fr" : "290px 1fr",
              gap: 24,
              alignItems: "start"
            }}>

              {/* LEFT — GROK ANALYSIS (sticky) */}
              <div style={{ position: "sticky", top: 24 }}>
                <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <div style={{ background: C.primaryBg, padding: "13px 18px", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.primary, textTransform: "uppercase" }}>
                      ✦ Grok Analysis
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18 }}>

                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Intent</div>
                      <span style={{ background: C.primaryBg, color: C.primary, border: `1px solid #b7dfc9`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                        {data.analysis.intent}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Risk Level</div>
                      <span style={{
                        background: riskStyle(data.analysis.risk_level).bg,
                        color: riskStyle(data.analysis.risk_level).color,
                        border: `1px solid ${riskStyle(data.analysis.risk_level).border}`,
                        borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, textTransform: "capitalize",
                      }}>
                        {data.analysis.risk_level}
                      </span>
                    </div>

                    {data.analysis.entities.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Entities</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {data.analysis.entities.map((e, i) => (
                            <span key={i} style={{ background: "#f1f5f9", color: C.text, border: "1px solid #e2e8f0", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.analysis.query_expansions.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Related Searches</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {data.analysis.query_expansions.map((exp, i) => (
                            <button key={i} onClick={() => setQuery(exp)} style={{
                              background: "none", border: "none", textAlign: "left",
                              cursor: "pointer", color: C.primaryLight, fontSize: 12, padding: "2px 0",
                            }}>
                              → {exp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Content Mix</div>
                      {(["practitioners", "protocols", "community"] as const).map(key => (
                        <div key={key} style={{ marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                            <span style={{ color: C.muted, textTransform: "capitalize" }}>{key}</span>
                            <span style={{ color: C.text, fontWeight: 600 }}>{data.analysis.recommended_content_mix[key]}%</span>
                          </div>
                          <div style={{ height: 5, background: "#e9f0ec", borderRadius: 4 }}>
                            <div style={{ height: "100%", width: `${data.analysis.recommended_content_mix[key]}%`, background: C.primary, borderRadius: 4 }} />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.muted,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    marginBottom: 10
                  }}>
                    Raw Grok Analysis JSON
                  </div>

                  <pre style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 11,
                    overflowX: "auto",
                    color: "#334155",
                    lineHeight: 1.6,
                  }}>
                    {JSON.stringify(data.analysis, null, 2)}
                  </pre>
                </div>
              </div>

              {/* RIGHT — SECTIONED RESULTS */}
              <div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>
                  {data.results.length} result{data.results.length !== 1 ? "s" : ""} for{" "}
                  <strong style={{ color: C.text }}>"{data.query}"</strong>
                </div>
                
                <div style={{
                  marginTop: 10,
                  marginBottom: 18,
                  padding: "12px 16px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#1d4ed8",
                  fontWeight: 600
                }}>
                  Typesense Retrieval Results
                </div>
                {practitioners.length > 0 && (
                  <div id="practitioners">
                    <SectionHeader icon="👨‍⚕️" label="Relevant Practitioners" count={practitioners.length} />
                    {practitioners.map(item => <ResultCard key={item.document.id} item={item} />)}
                  </div>
                )}

                {protocols.length > 0 && (
                  <div id="protocols">
                    <SectionHeader icon="📋" label="Relevant Protocols" count={protocols.length} />
                    {protocols.map(item => (
                      <ResultCard key={item.document.id} item={item} onSave={toggleSave} saved={saved.has(item.document.id)} />
                    ))}
                  </div>
                )}

                {community.length > 0 && (
                  <div id="community">
                    <SectionHeader
                      icon="💬"
                      label="Community Discussions"
                      count={community.length}
                    />

                    {community.map(item => (
                      <ResultCard
                        key={item.document.id}
                        item={item}
                      />
                    ))}
                  </div>
                )}

                {community.length === 0 && (
                  <div id="community">
                    <SectionHeader
                      icon="💬"
                      label="Community Discussions"
                      count={0}
                    />

                    <div style={{
                      background: C.card,
                      border: `1px dashed ${C.border}`,
                      borderRadius: 12,
                      padding: 24,
                      color: C.muted,
                      fontSize: 13,
                    }}>
                      No related community discussions found yet for this topic.
                    </div>
                  </div>
                )}

                {data.results.length === 0 && (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 40, textAlign: "center", color: C.muted, marginTop: 16 }}>
                    No results found. Try a different search term.
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>
      <div style={{
        marginTop: 60,
        paddingTop: 24,
        borderTop: `1px solid ${C.border}`,
        textAlign: "center",
        color: C.muted,
        fontSize: 12,
        lineHeight: 1.7,
      }}>
        AI overviews are generated from retrieved Just Holistics content and are intended for informational purposes only.
        <br />
        Content moderation combines automated safety analysis with human review workflows for sensitive wellness topics.
      </div>
    </div>
  );
}
