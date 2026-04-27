/**
 * AlertBanner.jsx — white theme
 */

export function AlertBanner({ alerts, dismissAlert }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {alerts.map((alert) => (
        <div key={alert.id} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#fef2f2", border: "1px solid #fecaca",
          borderLeft: "4px solid #dc2626", borderRadius: "10px",
          padding: "12px 16px", animation: "slideIn 0.3s ease-out",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "32px", height: "32px", background: "rgba(220,38,38,0.1)",
              borderRadius: "8px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "16px",
              animation: "blink 1.2s ease-in-out infinite",
            }}>⚠</div>
            <div>
              <div style={{
                fontFamily: "'Rajdhani', monospace", fontSize: "13px",
                fontWeight: "700", color: "#dc2626", letterSpacing: "1px",
              }}>
                ALERTE — {alert.metric.toUpperCase()}{" "}
                {alert.type === "HIGH" ? "TROP ÉLEVÉE" : "TROP BASSE"}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                Valeur mesurée :{" "}
                <span style={{ color: "#dc2626", fontWeight: "700" }}>
                  {alert.value.toFixed(2)} {alert.unit}
                </span>
                {"  ·  "}
                <span style={{ color: "#cbd5e1" }}>
                  {new Date(alert.timestamp).toLocaleTimeString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => dismissAlert(alert.id)} style={{
            background: "transparent", border: "1px solid #fecaca",
            borderRadius: "6px", color: "#dc2626", fontSize: "16px",
            width: "28px", height: "28px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", flexShrink: 0,
          }}
            onMouseEnter={(e) => e.target.style.background = "rgba(220,38,38,0.1)"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
            title="Fermer l'alerte"
          >×</button>
        </div>
      ))}
    </div>
  );
}
