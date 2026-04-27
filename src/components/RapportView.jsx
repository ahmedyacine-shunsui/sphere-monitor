/**
 * RapportView.jsx
 * ---------------
 * Session summary: min/max/avg readings, alert count, exportable as text.
 */

import { useMemo } from "react";

function StatCard({ label, value, unit, sub, color = "#002866" }) {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px",
      padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: "#94a3b8", marginBottom: "10px", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Rajdhani'", fontSize: "28px", fontWeight: "700", color, letterSpacing: "1px" }}>
        {value} <span style={{ fontSize: "14px", color: "#94a3b8" }}>{unit}</span>
      </div>
      {sub && (
        <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8", marginTop: "4px" }}>{sub}</div>
      )}
    </div>
  );
}

export function RapportView({ latestReading, history, alerts }) {
  const stats = useMemo(() => {
    const calc = (data) => {
      if (!data || data.length === 0) return { min: "—", max: "—", avg: "—", count: 0 };
      const vals = data.map(d => d.value);
      return {
        min: Math.min(...vals).toFixed(2),
        max: Math.max(...vals).toFixed(2),
        avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
        count: vals.length,
      };
    };
    return {
      pressure: calc(history.pressure),
      temperature: calc(history.temperature),
    };
  }, [history]);

  const sessionStart = history.pressure?.[0]?.timestamp;
  const sessionEnd   = history.pressure?.[history.pressure.length - 1]?.timestamp;

  const handleExport = () => {
    const lines = [
      "NAFTAL GPL — DISTRICT BATNA",
      "RAPPORT DE SESSION — SPHÈRE N°1",
      "=".repeat(40),
      "",
      `Date        : ${new Date().toLocaleDateString("fr-FR")}`,
      `Début       : ${sessionStart ? new Date(sessionStart).toLocaleTimeString("fr-FR") : "—"}`,
      `Fin         : ${sessionEnd   ? new Date(sessionEnd).toLocaleTimeString("fr-FR")   : "—"}`,
      `Mesures     : ${stats.pressure.count} points`,
      "",
      "PRESSION (bar)",
      `  Minimum   : ${stats.pressure.min} bar`,
      `  Maximum   : ${stats.pressure.max} bar`,
      `  Moyenne   : ${stats.pressure.avg} bar`,
      "",
      "TEMPÉRATURE (°C)",
      `  Minimum   : ${stats.temperature.min} °C`,
      `  Maximum   : ${stats.temperature.max} °C`,
      `  Moyenne   : ${stats.temperature.avg} °C`,
      "",
      `ALERTES DÉCLENCHÉES : ${alerts.length}`,
      ...alerts.map(a =>
        `  [${new Date(a.timestamp).toLocaleTimeString("fr-FR")}] ${a.metric} — ${a.type === "HIGH" ? "ÉLEVÉ" : "BAS"} — ${a.value.toFixed(2)} ${a.unit}`
      ),
      "",
      "=".repeat(40),
      "Généré par le système de surveillance GPL",
      `Bensalah A. · Benmohammed A. · Rahmouni A.Y.`,
      "Université Batna 2 — 2025/2026",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `rapport-gpl-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const card = {
    background: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "16px", padding: "24px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Rajdhani'", fontSize: "13px", fontWeight: "700", color: "#002866", letterSpacing: "2px" }}>
            RAPPORT DE SESSION
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>
            {sessionStart
              ? `${new Date(sessionStart).toLocaleTimeString("fr-FR")} → ${new Date(sessionEnd).toLocaleTimeString("fr-FR")}`
              : "Aucune donnée disponible"}
          </div>
        </div>
        <button onClick={handleExport} style={{
          background: "#002866", border: "none", borderRadius: "8px",
          fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px",
          color: "#ffffff", padding: "10px 20px", cursor: "pointer",
          transition: "background 0.2s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#003580"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#002866"}
        >
          ↓ EXPORTER .TXT
        </button>
      </div>

      {/* Pressure stats */}
      <div>
        <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px", color: "#94a3b8", marginBottom: "12px" }}>
          PRESSION
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          <StatCard label="Minimum" value={stats.pressure.min} unit="bar" color="#059669" />
          <StatCard label="Maximum" value={stats.pressure.max} unit="bar" color="#dc2626" />
          <StatCard label="Moyenne" value={stats.pressure.avg} unit="bar" color="#002866" />
          <StatCard label="Mesures" value={stats.pressure.count} unit="pts" color="#475569" />
        </div>
      </div>

      {/* Temperature stats */}
      <div>
        <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px", color: "#94a3b8", marginBottom: "12px" }}>
          TEMPÉRATURE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
          <StatCard label="Minimum" value={stats.temperature.min} unit="°C" color="#059669" />
          <StatCard label="Maximum" value={stats.temperature.max} unit="°C" color="#dc2626" />
          <StatCard label="Moyenne" value={stats.temperature.avg} unit="°C" color="#F0B41E" />
          <StatCard label="Mesures" value={stats.temperature.count} unit="pts" color="#475569" />
        </div>
      </div>

      {/* Alert summary */}
      <div style={card}>
        <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px", color: "#94a3b8", marginBottom: "16px" }}>
          RÉSUMÉ DES ALERTES
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: alerts.length > 0 ? "#fef2f2" : "#f0fdf4",
            border: `2px solid ${alerts.length > 0 ? "#fecaca" : "#bbf7d0"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Rajdhani'", fontSize: "22px", fontWeight: "700",
            color: alerts.length > 0 ? "#dc2626" : "#059669",
          }}>
            {alerts.length}
          </div>
          <div>
            <div style={{ fontFamily: "'Rajdhani'", fontSize: "16px", fontWeight: "700", color: alerts.length > 0 ? "#dc2626" : "#059669", letterSpacing: "1px" }}>
              {alerts.length === 0 ? "AUCUNE ALERTE" : `${alerts.length} ALERTE${alerts.length > 1 ? "S" : ""} DÉCLENCHÉE${alerts.length > 1 ? "S" : ""}`}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>
              {alerts.length === 0
                ? "Fonctionnement dans les plages normales"
                : "Voir la section Alertes pour le détail complet"}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
