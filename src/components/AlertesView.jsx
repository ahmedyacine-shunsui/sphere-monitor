/**
 * AlertesView.jsx
 * ---------------
 * Full alert log — shows all alerts fired in the session.
 */

export function AlertesView({ alerts, dismissAlert }) {
  const card = {
    background: "#ffffff", border: "1px solid #e2e8f0",
    borderRadius: "16px", padding: "24px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Rajdhani'", fontSize: "13px", fontWeight: "700", color: "#002866", letterSpacing: "2px" }}>
            JOURNAL DES ALERTES
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>
            Session en cours — {alerts.length} alerte{alerts.length !== 1 ? "s" : ""} enregistrée{alerts.length !== 1 ? "s" : ""}
          </div>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={() => alerts.forEach(a => dismissAlert(a.id))}
            style={{
              background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px",
              fontFamily: "monospace", fontSize: "10px", letterSpacing: "1px",
              color: "#94a3b8", padding: "8px 16px", cursor: "pointer",
            }}
          >
            TOUT EFFACER
          </button>
        )}
      </div>

      {/* Empty state */}
      {alerts.length === 0 && (
        <div style={{ ...card, textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✓</div>
          <div style={{ fontFamily: "'Rajdhani'", fontSize: "16px", color: "#059669", letterSpacing: "2px", marginBottom: "6px" }}>
            AUCUNE ALERTE ACTIVE
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8" }}>
            Tous les paramètres sont dans les plages normales.
          </div>
        </div>
      )}

      {/* Alert list */}
      {alerts.length > 0 && (
        <div style={card}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 100px 100px 40px",
            gap: "12px",
            padding: "8px 12px",
            borderBottom: "1px solid #f1f5f9",
            marginBottom: "8px",
          }}>
            {["HEURE", "DESCRIPTION", "VALEUR", "TYPE", ""].map((h) => (
              <div key={h} style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: "#cbd5e1" }}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {alerts.map((alert, i) => (
            <div key={alert.id} style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr 100px 100px 40px",
              gap: "12px",
              padding: "12px",
              borderRadius: "8px",
              background: i % 2 === 0 ? "#fafafa" : "#ffffff",
              alignItems: "center",
              animation: "slideIn 0.3s ease",
            }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8" }}>
                {new Date(alert.timestamp).toLocaleTimeString("fr-FR")}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#334155" }}>
                {alert.metric} — {alert.type === "HIGH" ? "Valeur trop élevée" : "Valeur trop basse"}
              </div>
              <div style={{ fontFamily: "'Rajdhani'", fontSize: "14px", fontWeight: "700", color: "#dc2626" }}>
                {alert.value.toFixed(2)} {alert.unit}
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                background: alert.type === "HIGH" ? "#fef2f2" : "#fffbeb",
                border: `1px solid ${alert.type === "HIGH" ? "#fecaca" : "#fde68a"}`,
                borderRadius: "6px", padding: "3px 8px",
                fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px",
                color: alert.type === "HIGH" ? "#dc2626" : "#d97706",
              }}>
                {alert.type === "HIGH" ? "▲ ÉLEVÉ" : "▼ BAS"}
              </div>
              <button onClick={() => dismissAlert(alert.id)} style={{
                background: "transparent", border: "none",
                color: "#cbd5e1", fontSize: "16px", cursor: "pointer",
                transition: "color 0.2s",
              }}
                onMouseEnter={(e) => e.target.style.color = "#dc2626"}
                onMouseLeave={(e) => e.target.style.color = "#cbd5e1"}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ ...card, padding: "16px 24px" }}>
        <div style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: "#94a3b8", marginBottom: "12px" }}>
          SEUILS DE RÉFÉRENCE
        </div>
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {[
            { label: "Pression min", value: "120 bar", color: "#d97706" },
            { label: "Pression max", value: "180 bar", color: "#dc2626" },
            { label: "Température min", value: "5 °C",   color: "#d97706" },
            { label: "Température max", value: "50 °C",  color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: s.color }} />
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#475569" }}>
                {s.label}: <strong style={{ color: s.color }}>{s.value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
