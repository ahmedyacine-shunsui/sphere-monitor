/**
 * GaugeCard.jsx
 * -------------
 * Displays a single live metric (pressure or temperature).
 * Turns red when the value is outside the safe range.
 */

import { useEffect, useRef } from "react";

export function GaugeCard({ label, value, unit, min, max }) {
  const isAlert = value !== null && (value < min || value > max);
  const percent = value !== null
    ? Math.min(100, Math.max(0, ((value - min * 0.8) / (max * 1.2 - min * 0.8)) * 100))
    : 0;

  const arcRef = useRef(null);

  // SVG arc math
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

  const trackColor = "#1e2533";
  const fillColor = isAlert ? "#ef4444" : "#22d3a0";
  const glowColor = isAlert ? "rgba(239,68,68,0.4)" : "rgba(34,211,160,0.4)";

  return (
    <div
      style={{
        background: isAlert
          ? "linear-gradient(135deg, #1a0f0f 0%, #1e1515 100%)"
          : "linear-gradient(135deg, #0d1117 0%, #111827 100%)",
        border: `1px solid ${isAlert ? "#7f1d1d" : "#1f2937"}`,
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "all 0.4s ease",
        boxShadow: isAlert
          ? "0 0 30px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 0 30px rgba(34,211,160,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* pulse ring when alert */}
      {isAlert && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: "16px",
          border: "2px solid rgba(239,68,68,0.5)",
          animation: "pulseRing 1.5s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Label */}
      <div style={{
        fontFamily: "'Rajdhani', 'Share Tech Mono', monospace",
        fontSize: "11px",
        letterSpacing: "3px",
        color: isAlert ? "#ef4444" : "#6b7280",
        textTransform: "uppercase",
        marginBottom: "8px",
      }}>
        {label}
      </div>

      {/* SVG Gauge */}
      <svg width="140" height="110" viewBox="0 0 140 110">
        <defs>
          <filter id={`glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path d={arcPath(startAngle, totalArc)}
          fill="none" stroke={trackColor} strokeWidth="8" strokeLinecap="round" />

        {/* Fill */}
        {value !== null && fillSweep > 0 && (
          <path
            d={arcPath(startAngle, fillSweep)}
            fill="none"
            stroke={fillColor}
            strokeWidth="8"
            strokeLinecap="round"
            filter={`url(#glow-${label})`}
            style={{ transition: "d 0.5s ease" }}
          />
        )}

        {/* Min/Max labels */}
        <text x="18" y="100" fill="#374151" fontSize="9"
          fontFamily="monospace" textAnchor="middle">{min}</text>
        <text x="122" y="100" fill="#374151" fontSize="9"
          fontFamily="monospace" textAnchor="middle">{max}</text>

        {/* Value */}
        <text x="70" y="72" fill={isAlert ? "#ef4444" : "#f9fafb"}
          fontSize="26" fontFamily="'Rajdhani', monospace" textAnchor="middle"
          fontWeight="700" style={{ transition: "fill 0.3s" }}>
          {value !== null ? value.toFixed(1) : "—"}
        </text>
        <text x="70" y="88" fill={isAlert ? "#f87171" : "#9ca3af"}
          fontSize="11" fontFamily="monospace" textAnchor="middle">
          {unit}
        </text>
      </svg>

      {/* Status */}
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        marginTop: "4px",
      }}>
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: isAlert ? "#ef4444" : "#22d3a0",
          boxShadow: `0 0 8px ${glowColor}`,
          animation: isAlert ? "blink 1s ease-in-out infinite" : "none",
        }} />
        <span style={{
          fontFamily: "monospace", fontSize: "10px",
          color: isAlert ? "#ef4444" : "#22d3a0",
          letterSpacing: "1px",
        }}>
          {value === null ? "EN ATTENTE" : isAlert ? "HORS SEUIL" : "NORMAL"}
        </span>
      </div>

      {/* Safe range */}
      <div style={{
        marginTop: "10px", fontSize: "10px",
        fontFamily: "monospace", color: "#374151",
        letterSpacing: "1px",
      }}>
        PLAGE: {min} – {max} {unit}
      </div>
    </div>
  );
}
