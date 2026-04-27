/**
 * App.jsx
 * -------
 * Full dashboard with left sidebar navigation.
 * Sections: Temps Réel, Historique, Alertes, Rapport, À propos
 */

import { useState } from "react";
import { useSocket, THRESHOLDS } from "./hooks/useSocket";
import { GaugeCard } from "./components/GaugeCard";
import { TrendChart } from "./components/TrendChart";
import { AlertBanner } from "./components/AlertBanner";
import { HistoryView } from "./components/HistoryView";
import { AlertesView } from "./components/AlertesView";
import { RapportView } from "./components/RapportView";
import { AProposView } from "./components/AProposView";
import naftalLogo from "./assets/LogoNAFTAL.svg";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f4f6f9; color: #0f172a; font-family: 'Share Tech Mono', monospace; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  @keyframes pulseRing {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.01); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const NAV_ITEMS = [
  { id: "live",      icon: "⬤",  label: "Temps Réel"  },
  { id: "history",   icon: "↗",  label: "Historique"  },
  { id: "alertes",   icon: "⚠",  label: "Alertes"     },
  { id: "rapport",   icon: "▤",  label: "Rapport"     },
  { id: "apropos",   icon: "ℹ",  label: "À propos"    },
];

function StatusDot({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{
        width: "7px", height: "7px", borderRadius: "50%",
        background: active ? "#059669" : "#94a3b8",
        boxShadow: active ? "0 0 8px rgba(5,150,105,0.5)" : "none",
        animation: active ? "blink 2s ease-in-out infinite" : "none",
      }} />
      <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: active ? "#059669" : "#94a3b8" }}>
        {active ? "EN LIGNE" : "HORS LIGNE"}
      </span>
    </div>
  );
}

export default function App() {
  const { latestReading, alerts, history, dismissAlert } = useSocket();
  const [section, setSection] = useState("live");
  const hasAlerts = alerts.length > 0;

  const pageTitle = NAV_ITEMS.find(n => n.id === section)?.label ?? "";

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside style={{
          width: "280px",
          minWidth: "280px",
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
          zIndex: 50,
        }}>
          {/* Logo area */}
          <div style={{
            padding: "28px 24px 20px",
            borderBottom: "1px solid #f1f5f9",
          }}>
            <img src={naftalLogo} alt="NAFTAL" style={{ width: "100%", maxWidth: "160px", height: "auto" }} />
            <div style={{
              marginTop: "12px",
              fontFamily: "monospace", fontSize: "9px",
              letterSpacing: "2px", color: "#94a3b8",
              textTransform: "uppercase", lineHeight: "1.8",
            }}>
              District Batna<br />Surveillance GPL
            </div>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: "16px 12px" }}>
            {NAV_ITEMS.map((item) => {
              const active = section === item.id;
              const isAlertItem = item.id === "alertes" && hasAlerts;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 18px",
                    marginBottom: "6px",
                    background: active ? "#002866" : "transparent",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{
                    fontSize: "16px",
                    color: active ? "#F0B41E" : isAlertItem ? "#dc2626" : "#94a3b8",
                    animation: isAlertItem ? "blink 1.5s ease-in-out infinite" : "none",
                    width: "20px", textAlign: "center",
                  }}>
                    {item.icon}
                  </span>
                  <span style={{
                    fontFamily: "monospace", fontSize: "13px",
                    letterSpacing: "1px",
                    color: active ? "#ffffff" : isAlertItem ? "#dc2626" : "#475569",
                    fontWeight: active ? "600" : "400",
                  }}>
                    {item.label}
                  </span>
                  {/* Alert badge */}
                  {isAlertItem && (
                    <span style={{
                      marginLeft: "auto",
                      background: "#dc2626", color: "#fff",
                      fontFamily: "monospace", fontSize: "9px",
                      borderRadius: "10px", padding: "3px 8px",
                      animation: "blink 1.5s ease-in-out infinite",
                    }}>
                      {alerts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom status */}
          <div style={{
            padding: "14px 20px",
            borderTop: "1px solid #f1f5f9",
          }}>
            <StatusDot active={latestReading !== null} />
            {latestReading && (
              <div style={{
                fontFamily: "monospace", fontSize: "9px",
                color: "#cbd5e1", letterSpacing: "1px", marginTop: "6px",
              }}>
                {new Date(latestReading.timestamp).toLocaleTimeString("fr-FR")}
              </div>
            )}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Top bar */}
          <header style={{
            height: "60px", background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            padding: "0 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            position: "sticky", top: 0, zIndex: 40,
          }}>
            <div style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "16px", fontWeight: "700",
              letterSpacing: "2px", color: "#002866",
            }}>
              {pageTitle.toUpperCase()}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {hasAlerts && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: "20px", padding: "3px 12px",
                  fontFamily: "monospace", fontSize: "10px", color: "#dc2626",
                  animation: "blink 1.5s ease-in-out infinite", letterSpacing: "1px",
                }}>
                  ⚠ {alerts.length} ALERTE{alerts.length > 1 ? "S" : ""}
                </div>
              )}
              <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8", letterSpacing: "1px" }}>
                SPHÈRE GPL N°1 · KECHIDA · BATNA
              </div>
            </div>
          </header>

          {/* Blue/gold accent bar */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #002866 0%, #F0B41E 100%)", flexShrink: 0 }} />

          {/* Page content */}
          <main style={{ flex: 1, padding: "28px 32px", animation: "fadeIn 0.3s ease", overflowY: "auto" }}>

            {/* ── TEMPS RÉEL ── */}
            {section === "live" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {hasAlerts && <AlertBanner alerts={alerts} dismissAlert={dismissAlert} />}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                  <GaugeCard label="Pression" value={latestReading?.pressure ?? null} unit="bar"
                    min={THRESHOLDS.pressure.min} max={THRESHOLDS.pressure.max} />
                  <GaugeCard label="Température" value={latestReading?.temperature ?? null} unit="°C"
                    min={THRESHOLDS.temperature.min} max={THRESHOLDS.temperature.max} />
                  {/* Status card */}
                  <div style={{
                    background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
                    padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "3px", color: "#94a3b8", textTransform: "uppercase" }}>État système</div>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8", marginBottom: "6px" }}>SPHÈRE ID</div>
                      <div style={{ fontFamily: "'Rajdhani'", fontSize: "22px", fontWeight: "700", color: "#002866", letterSpacing: "2px" }}>
                        {latestReading?.sphereId ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>DERNIÈRE MESURE</div>
                      <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#334155" }}>
                        {latestReading ? new Date(latestReading.timestamp).toLocaleTimeString("fr-FR") : "En attente…"}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                      <div style={{
                        width: "7px", height: "7px", borderRadius: "50%",
                        background: hasAlerts ? "#dc2626" : "#059669",
                        boxShadow: hasAlerts ? "0 0 8px rgba(220,38,38,0.4)" : "0 0 8px rgba(5,150,105,0.4)",
                        animation: "blink 2s ease-in-out infinite",
                      }} />
                      <span style={{ fontFamily: "monospace", fontSize: "10px", color: hasAlerts ? "#dc2626" : "#059669", letterSpacing: "1px" }}>
                        {hasAlerts ? `${alerts.length} ALERTE(S) ACTIVE(S)` : "FONCTIONNEMENT NORMAL"}
                      </span>
                    </div>
                  </div>
                </div>
                <TrendChart data={history.pressure} label="Pression" unit="bar" color="#002866"
                  min={THRESHOLDS.pressure.min} max={THRESHOLDS.pressure.max} />
                <TrendChart data={history.temperature} label="Température" unit="°C" color="#F0B41E"
                  min={THRESHOLDS.temperature.min} max={THRESHOLDS.temperature.max} />
              </div>
            )}

            {section === "history"  && <HistoryView />}
            {section === "alertes"  && <AlertesView alerts={alerts} dismissAlert={dismissAlert} />}
            {section === "rapport"  && <RapportView latestReading={latestReading} history={history} alerts={alerts} />}
            {section === "apropos"  && <AProposView />}

          </main>

          {/* Footer */}
          <footer style={{
            borderTop: "1px solid #e2e8f0", background: "#ffffff",
            padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#cbd5e1", letterSpacing: "2px" }}>
              NAFTAL GPL · DISTRICT BATNA · SURVEILLANCE TEMPS RÉEL
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#cbd5e1", letterSpacing: "1px" }}>
              Bensalah · Benmohammed · Rahmouni — Université Batna 2 · 2025/2026
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
