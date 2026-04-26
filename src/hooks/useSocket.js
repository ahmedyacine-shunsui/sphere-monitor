/**
 * useSocket.js
 * -----------
 * In production: connects to the real Socket.IO backend.
 * In mock mode:  simulates live sensor data locally.
 *
 * To switch to real backend:
 *   1. npm install socket.io-client
 *   2. Set MOCK_MODE = false
 *   3. Make sure the backend is running on BACKEND_URL
 */

import { useState, useEffect, useRef } from "react";

const MOCK_MODE = true; // ← flip to false when backend is ready
const BACKEND_URL = "http://localhost:3001";

// Thresholds matching thresholds.json
export const THRESHOLDS = {
  pressure: { min: 120, max: 180, unit: "bar" },
  temperature: { min: 5, max: 50, unit: "°C" },
};

function generateMockReading(prev) {
  const drift = (val, range, speed = 0.4) =>
    Math.min(range[1] * 1.1, Math.max(range[0] * 0.85,
      val + (Math.random() - 0.49) * speed * (range[1] - range[0]) * 0.05));

  const pressure = drift(
    prev?.pressure ?? 150,
    [THRESHOLDS.pressure.min, THRESHOLDS.pressure.max]
  );
  const temperature = drift(
    prev?.temperature ?? 28,
    [THRESHOLDS.temperature.min, THRESHOLDS.temperature.max]
  );

  return {
    sphereId: "sphere1",
    pressure: parseFloat(pressure.toFixed(2)),
    temperature: parseFloat(temperature.toFixed(2)),
    timestamp: new Date().toISOString(),
  };
}

export function useSocket() {
  const [latestReading, setLatestReading] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState({ pressure: [], temperature: [] });
  const prevRef = useRef(null);

  useEffect(() => {
    if (MOCK_MODE) {
      // Seed history with 30 points
      const now = Date.now();
      const seed = { pressure: [], temperature: [] };
      let fakePrev = { pressure: 150, temperature: 28 };
      for (let i = 30; i >= 1; i--) {
        fakePrev = generateMockReading(fakePrev);
        const ts = new Date(now - i * 4000).toISOString();
        seed.pressure.push({ timestamp: ts, value: fakePrev.pressure });
        seed.temperature.push({ timestamp: ts, value: fakePrev.temperature });
      }
      setHistory(seed);

      const interval = setInterval(() => {
        const reading = generateMockReading(prevRef.current);
        prevRef.current = reading;
        setLatestReading(reading);

        setHistory((prev) => {
          const MAX = 60;
          return {
            pressure: [...prev.pressure.slice(-MAX + 1),
              { timestamp: reading.timestamp, value: reading.pressure }],
            temperature: [...prev.temperature.slice(-MAX + 1),
              { timestamp: reading.timestamp, value: reading.temperature }],
          };
        });

        // Check thresholds and fire alerts
        const newAlerts = [];
        if (reading.pressure > THRESHOLDS.pressure.max)
          newAlerts.push({ id: Date.now(), metric: "Pression", value: reading.pressure,
            unit: "bar", type: "HIGH", timestamp: reading.timestamp });
        if (reading.pressure < THRESHOLDS.pressure.min)
          newAlerts.push({ id: Date.now() + 1, metric: "Pression", value: reading.pressure,
            unit: "bar", type: "LOW", timestamp: reading.timestamp });
        if (reading.temperature > THRESHOLDS.temperature.max)
          newAlerts.push({ id: Date.now() + 2, metric: "Température", value: reading.temperature,
            unit: "°C", type: "HIGH", timestamp: reading.timestamp });
        if (reading.temperature < THRESHOLDS.temperature.min)
          newAlerts.push({ id: Date.now() + 3, metric: "Température", value: reading.temperature,
            unit: "°C", type: "LOW", timestamp: reading.timestamp });

        if (newAlerts.length > 0) {
          setAlerts((prev) => [...newAlerts, ...prev].slice(0, 20));
        }
      }, 2000);

      return () => clearInterval(interval);
    } else {
      // ── REAL SOCKET.IO CONNECTION ──────────────────────────────
      import("socket.io-client").then(({ io }) => {
        const socket = io(BACKEND_URL);
        socket.on("metric", (data) => {
          setLatestReading(data);
          setHistory((prev) => ({
            pressure: [...prev.pressure.slice(-59),
              { timestamp: data.timestamp, value: data.pressure }],
            temperature: [...prev.temperature.slice(-59),
              { timestamp: data.timestamp, value: data.temperature }],
          }));
        });
        socket.on("alert", (alert) => {
          setAlerts((prev) => [alert, ...prev].slice(0, 20));
        });
        return () => socket.disconnect();
      });
    }
  }, []);

  const dismissAlert = (id) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  return { latestReading, alerts, history, dismissAlert };
}
