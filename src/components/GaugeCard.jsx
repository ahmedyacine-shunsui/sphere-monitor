/**
 * GaugeCard.jsx — white theme
 */

export function GaugeCard({ label, value, unit, min, max }) {
  const isAlert = value !== null && (value < min || value > max);
  const percent = value !== null
    ? Math.min(100, Math.max(0, ((value - min * 0.8) / (max * 1.2 - min * 0.8)) * 100))
    : 0;

  const R = 54;
  const cx = 70, cy = 75;
  const startAngle = -210;
  const totalArc = 240;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const polarToXY = (angle, r) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });
  const arcPath = (start, sweep) => {
    const s = polarToXY(start, R);
    const e = polarToXY(start + sweep, R);
    const large = sweep > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const fillSweep = (percent / 100) * totalArc;
  const fillColor = isAlert ? "#dc2626" : "#002866";
  const trackColor = "#e2e8f0";

  return (
    <div style={{
      background: isAlert
        ? "linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)"
        : "#ffffff",
      border: `1px solid ${isAlert ? "#fecaca" : "#e2e8f0"}`,
      borderRadius: "16px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transition: "all 0.4s ease",
      boxShadow: isAlert
        ? "0 4px 20px rgba(220,38,38,0.1)"
        : "0 1px 6px rgba(0,0,0,0.04)",
      position: "relative",
      overflow: "hidden",
    }}>
      {isAlert && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: "16px",
          border: "2px solid rgba(220,38,38,0.3)",
          animation: "pulseRing 1.5s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      <div style={{
        fontFamily: "'Rajdhani', monospace", fontSize: "11px",
        letterSpacing: "3px", color: isAlert ? "#dc2626" : "#94a3b8",
        textTransform: "uppercase", marginBottom: "8px",
      }}>
        {label}
      </div>

      <svg width="140" height="110" viewBox="0 0 140 110">
        <defs>
          <filter id={`glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={arcPath(startAngle, totalArc)} fill="none" stroke={trackColor} strokeWidth="8" strokeLinecap="round" />
        {value !== null && fillSweep > 0 && (
          <path d={arcPath(startAngle, fillSweep)} fill="none" stroke={fillColor}
            strokeWidth="8" strokeLinecap="round" filter={`url(#glow-${label})`}
            style={{ transition: "d 0.5s ease" }} />
        )}
        <text x="18" y="100" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">{min}</text>
        <text x="122" y="100" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">{max}</text>
        <text x="70" y="72" fill={isAlert ? "#dc2626" : "#002866"}
          fontSize="26" fontFamily="'Rajdhani', monospace" textAnchor="middle"
          fontWeight="700" style={{ transition: "fill 0.3s" }}>
          {value !== null ? value.toFixed(1) : "—"}
        </text>
        <text x="70" y="88" fill={isAlert ? "#ef4444" : "#94a3b8"}
          fontSize="11" fontFamily="monospace" textAnchor="middle">
          {unit}
        </text>
      </svg>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: isAlert ? "#dc2626" : "#059669",
          boxShadow: isAlert ? "0 0 8px rgba(220,38,38,0.4)" : "0 0 8px rgba(5,150,105,0.4)",
          animation: isAlert ? "blink 1s ease-in-out infinite" : "none",
        }} />
        <span style={{
          fontFamily: "monospace", fontSize: "10px",
          color: isAlert ? "#dc2626" : "#059669", letterSpacing: "1px",
        }}>
          {value === null ? "EN ATTENTE" : isAlert ? "HORS SEUIL" : "NORMAL"}
        </span>
      </div>

      <div style={{ marginTop: "10px", fontSize: "10px", fontFamily: "monospace", color: "#cbd5e1", letterSpacing: "1px" }}>
        PLAGE: {min} – {max} {unit}
      </div>
    </div>
  );
}
