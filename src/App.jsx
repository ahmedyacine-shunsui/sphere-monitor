/**
 * App.jsx
 * -------
 * Main dashboard for the GPL Sphere Fuel Monitoring System.
 * Wires together all components using live data from useSocket.
 */

import { useState } from "react";
import { useSocket, THRESHOLDS } from "./hooks/useSocket";
import { GaugeCard } from "./components/GaugeCard";
import { TrendChart } from "./components/TrendChart";
import { AlertBanner } from "./components/AlertBanner";
import { HistoryView } from "./components/HistoryView";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080c12;
    color: #f9fafb;
    font-family: 'Share Tech Mono', monospace;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 3px; }

  @keyframes pulseRing {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.01); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
`;

function StatusDot({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{
        width: "8px", height: "8px", borderRadius: "50%",
        background: active ? "#22d3a0" : "#374151",
        boxShadow: active ? "0 0 10px rgba(34,211,160,0.6)" : "none",
        animation: active ? "blink 2s ease-in-out infinite" : "none",
      }} />
      <span style={{
        fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px",
        color: active ? "#22d3a0" : "#374151",
      }}>
        {active ? "EN LIGNE" : "HORS LIGNE"}
      </span>
    </div>
  );
}

export default function App() {
  const { latestReading, alerts, history, dismissAlert } = useSocket();
  const [tab, setTab] = useState("live"); // "live" | "history"

  const hasAlerts = alerts.length > 0;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #0d1520 0%, #080c12 60%)",
        animation: "fadeIn 0.5s ease",
      }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <header style={{
          borderBottom: "1px solid #111827",
          padding: "0 32px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(13,17,23,0.95)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Logo mark */}
            <div style={{
              width: "32px", height: "32px",
              background: "linear-gradient(135deg, #064e3b, #065f46)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
              boxShadow: "0 0 12px rgba(34,211,160,0.2)",
            }}>
              ◉
            </div>
            <div>
              <div style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "15px", fontWeight: "700",
                letterSpacing: "3px", color: "#f9fafb",
              }}>
                NAFTAL GPL — DISTRICT BATNA
              </div>
              <div style={{
                fontFamily: "monospace", fontSize: "9px",
                letterSpacing: "2px", color: "#374151",
              }}>
                SYSTÈME DE SURVEILLANCE DES SPHÈRES
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* Alert count badge */}
            {hasAlerts && (
              <div style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid #7f1d1d",
                borderRadius: "20px",
                padding: "4px 12px",
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#ef4444",
                animation: "blink 1.5s ease-in-out infinite",
                letterSpacing: "1px",
              }}>
                ⚠ {alerts.length} ALERTE{alerts.length > 1 ? "S" : ""}
              </div>
            )}

            <StatusDot active={latestReading !== null} />

            {latestReading && (
              <div style={{
                fontFamily: "monospace", fontSize: "10px",
                color: "#374151", letterSpacing: "1px",
              }}>
                {new Date(latestReading.timestamp).toLocaleTimeString("fr-FR")}
              </div>
            )}
          </div>
        </header>

        {/* ── Main ────────────────────────────────────────────────── */}
        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

          {/* Sphere ID banner */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}>
            <div style={{
              fontFamily: "'Rajdhani', monospace",
              fontSize: "22px",
              fontWeight: "700",
              color: "#f9fafb",
              letterSpacing: "2px",
            }}>
              SPHÈRE GPL — N°1
            </div>
            <div style={{
              fontFamily: "monospace", fontSize: "10px",
              color: "#374151", letterSpacing: "2px",
              paddingTop: "4px",
            }}>
              ZONE INDUSTRIELLE KECHIDA · BATNA
            </div>
          </div>

          {/* Active alerts */}
          {hasAlerts && (
            <div style={{ marginBottom: "24px" }}>
              <AlertBanner alerts={alerts} dismissAlert={dismissAlert} />
            </div>
          )}

          {/* Tab switcher */}
          <div style={{
            display: "flex",
            gap: "4px",
            marginBottom: "24px",
            background: "#0d1117",
            border: "1px solid #1f2937",
            borderRadius: "10px",
            padding: "4px",
            width: "fit-content",
          }}>
            {["live", "history"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? "#111827" : "transparent",
                  border: tab === t ? "1px solid #1f2937" : "1px solid transparent",
                  borderRadius: "7px",
                  color: tab === t ? "#f9fafb" : "#374151",
                  fontFamily: "monospace",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  padding: "8px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                }}
              >
                {t === "live" ? "⬤  TEMPS RÉEL" : "↗  HISTORIQUE"}
              </button>
            ))}
          </div>

          {/* ── LIVE TAB ── */}
          {tab === "live" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Gauges row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}>
                <GaugeCard
                  label="Pression"
                  value={latestReading?.pressure ?? null}
                  unit="bar"
                  min={THRESHOLDS.pressure.min}
                  max={THRESHOLDS.pressure.max}
                />
                <GaugeCard
                  label="Température"
                  value={latestReading?.temperature ?? null}
                  unit="°C"
                  min={THRESHOLDS.temperature.min}
                  max={THRESHOLDS.temperature.max}
                />

                {/* Last update card */}
                <div style={{
                  background: "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
                  border: "1px solid #1f2937",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                  <div style={{
                    fontFamily: "'Rajdhani', monospace",
                    fontSize: "11px", letterSpacing: "3px",
                    color: "#6b7280", textTransform: "uppercase",
                  }}>
                    État système
                  </div>

                  <div>
                    <div style={{
                      fontFamily: "monospace", fontSize: "11px",
                      color: "#374151", marginBottom: "8px",
                    }}>
                      SPHÈRE ID
                    </div>
                    <div style={{
                      fontFamily: "'Rajdhani', monospace",
                      fontSize: "20px", fontWeight: "700",
                      color: "#22d3a0", letterSpacing: "2px",
                    }}>
                      {latestReading?.sphereId ?? "—"}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontFamily: "monospace", fontSize: "11px",
                      color: "#374151", marginBottom: "4px",
                    }}>
                      DERNIÈRE MESURE
                    </div>
                    <div style={{
                      fontFamily: "monospace", fontSize: "13px",
                      color: "#9ca3af",
                    }}>
                      {latestReading
                        ? new Date(latestReading.timestamp).toLocaleTimeString("fr-FR")
                        : "En attente…"}
                    </div>
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    marginTop: "8px",
                  }}>
                    <div style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: hasAlerts ? "#ef4444" : "#22d3a0",
                      boxShadow: hasAlerts
                        ? "0 0 8px rgba(239,68,68,0.5)"
                        : "0 0 8px rgba(34,211,160,0.5)",
                      animation: "blink 2s ease-in-out infinite",
                    }} />
                    <span style={{
                      fontFamily: "monospace", fontSize: "10px",
                      color: hasAlerts ? "#ef4444" : "#22d3a0",
                      letterSpacing: "1px",
                    }}>
                      {hasAlerts ? `${alerts.length} ALERTE(S) ACTIVE(S)` : "FONCTIONNEMENT NORMAL"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trend charts */}
              <TrendChart
                data={history.pressure}
                label="Pression"
                unit="bar"
                color="#22d3a0"
                min={THRESHOLDS.pressure.min}
                max={THRESHOLDS.pressure.max}
              />
              <TrendChart
                data={history.temperature}
                label="Température"
                unit="°C"
                color="#f59e0b"
                min={THRESHOLDS.temperature.min}
                max={THRESHOLDS.temperature.max}
              />
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {tab === "history" && <HistoryView />}

        </main>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer style={{
          borderTop: "1px solid #111827",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            fontFamily: "monospace", fontSize: "10px",
            color: "#1f2937", letterSpacing: "2px",
          }}>
            NAFTAL GPL · DISTRICT BATNA · SURVEILLANCE TEMPS RÉEL
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: "10px",
            color: "#1f2937", letterSpacing: "1px",
          }}>
            Bensalah · Benmohammed · Rahmouni — Université Batna 2 · 2025/2026
          </div>
        </footer>
      </div>
    </>
  );
}
