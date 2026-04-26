/**
 * AlertBanner.jsx
 * ---------------
 * Displays a dismissable alert entry for each threshold breach.
 * Receives the alerts array and the dismissAlert function from useSocket.
 */

export function AlertBanner({ alerts, dismissAlert }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #1a0505 0%, #1f0a0a 100%)",
            border: "1px solid #7f1d1d",
            borderLeft: "4px solid #ef4444",
            borderRadius: "10px",
            padding: "12px 16px",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Blinking alert icon */}
            <div style={{
              width: "32px", height: "32px",
              background: "rgba(239,68,68,0.15)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
              animation: "blink 1.2s ease-in-out infinite",
            }}>
              ⚠
            </div>

            <div>
              <div style={{
                fontFamily: "'Rajdhani', monospace",
                fontSize: "13px",
                fontWeight: "700",
                color: "#ef4444",
                letterSpacing: "1px",
              }}>
                ALERTE — {alert.metric.toUpperCase()}{" "}
                {alert.type === "HIGH" ? "TROP ÉLEVÉE" : "TROP BASSE"}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#9ca3af",
                marginTop: "2px",
              }}>
                Valeur mesurée :{" "}
                <span style={{ color: "#fca5a5", fontWeight: "700" }}>
                  {alert.value.toFixed(2)} {alert.unit}
                </span>
                {"  ·  "}
                <span style={{ color: "#6b7280" }}>
                  {new Date(alert.timestamp).toLocaleTimeString("fr-FR")}
                </span>
              </div>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => dismissAlert(alert.id)}
            style={{
              background: "transparent",
              border: "1px solid #7f1d1d",
              borderRadius: "6px",
              color: "#ef4444",
              fontSize: "16px",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(239,68,68,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
            title="Fermer l'alerte"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
