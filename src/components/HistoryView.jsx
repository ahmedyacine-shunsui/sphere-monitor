/**
 * HistoryView.jsx
 * ---------------
 * Lets the user pick a date range and fetch historical data.
 * In mock mode: returns a locally generated fake dataset.
 * In production: calls GET /api/history?sphere=1&metric=...&range=...
 */

import { useState } from "react";
import { TrendChart } from "./TrendChart";
import { THRESHOLDS } from "../hooks/useSocket";

const MOCK_MODE = true; // ← same flag as useSocket.js

function fetchHistoryMock(metric, hours) {
  const now = Date.now();
  const points = hours * 6; // one point every 10 minutes
  const ranges = {
    pressure: [130, 175],
    temperature: [10, 48],
  };
  const [lo, hi] = ranges[metric];
  const result = [];
  let val = (lo + hi) / 2;
  for (let i = points; i >= 0; i--) {
    val = Math.min(hi * 1.05, Math.max(lo * 0.9,
      val + (Math.random() - 0.49) * (hi - lo) * 0.04));
    result.push({
      timestamp: new Date(now - i * 10 * 60 * 1000).toISOString(),
      value: parseFloat(val.toFixed(2)),
    });
  }
  return Promise.resolve(result);
}

async function fetchHistoryReal(sphereId, metric, hours) {
  const res = await fetch(
    `/api/history?sphere=${sphereId}&metric=${metric}&range=${hours}h`
  );
  if (!res.ok) throw new Error("Erreur API");
  return res.json();
}

export function HistoryView() {
  const [range, setRange] = useState("24");
  const [pressureData, setPressureData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const hours = parseInt(range);
      const [p, t] = await Promise.all([
        MOCK_MODE ? fetchHistoryMock("pressure", hours)
          : fetchHistoryReal("sphere1", "pressure", hours),
        MOCK_MODE ? fetchHistoryMock("temperature", hours)
          : fetchHistoryReal("sphere1", "temperature", hours),
      ]);
      setPressureData(p);
      setTempData(t);
    } catch (e) {
      setError("Impossible de charger les données historiques.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "#0d1117",
    border: "1px solid #1f2937",
    borderRadius: "8px",
    color: "#f9fafb",
    fontFamily: "monospace",
    fontSize: "13px",
    padding: "8px 14px",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1117 0%, #0f1520 100%)",
      border: "1px solid #1f2937",
      borderRadius: "16px",
      padding: "24px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{
          fontFamily: "'Rajdhani', monospace",
          fontSize: "11px",
          letterSpacing: "3px",
          color: "#6b7280",
          textTransform: "uppercase",
        }}>
          Historique — Données archivées
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            style={inputStyle}
          >
            <option value="1">Dernière heure</option>
            <option value="6">6 heures</option>
            <option value="24">24 heures</option>
            <option value="72">3 jours</option>
          </select>

          <button
            onClick={handleLoad}
            disabled={loading}
            style={{
              ...inputStyle,
              background: loading ? "#1f2937" : "#064e3b",
              border: "1px solid #065f46",
              color: loading ? "#6b7280" : "#22d3a0",
              letterSpacing: "2px",
              fontSize: "11px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "CHARGEMENT…" : "CHARGER"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          color: "#ef4444", fontFamily: "monospace",
          fontSize: "12px", padding: "12px",
          background: "#1a0505", borderRadius: "8px",
          border: "1px solid #7f1d1d",
        }}>
          {error}
        </div>
      )}

      {!pressureData && !loading && !error && (
        <div style={{
          textAlign: "center", padding: "40px",
          color: "#374151", fontFamily: "monospace", fontSize: "12px",
        }}>
          Sélectionnez une plage et cliquez sur CHARGER
        </div>
      )}

      {pressureData && tempData && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TrendChart
            data={pressureData}
            label="Pression"
            unit="bar"
            color="#22d3a0"
            min={THRESHOLDS.pressure.min}
            max={THRESHOLDS.pressure.max}
          />
          <TrendChart
            data={tempData}
            label="Température"
            unit="°C"
            color="#f59e0b"
            min={THRESHOLDS.temperature.min}
            max={THRESHOLDS.temperature.max}
          />
        </div>
      )}
    </div>
  );
}
