import React, { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { diffChars } from "diff";
import unit from "@/components/unitset/unitrun/layers/store/unit";

type DiffPart = {
  value: string;
  added?: boolean;
  removed?: boolean;
};

type DiffLogEntry = {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  parts: DiffPart[];
};

const STORAGE_KEY = "mobx_text_diff_log_v1";
const POLL_INTERVAL_MS = 5000;
const MAX_LOG_ENTRIES = 20000;

function loadLogs(): DiffLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DiffLogEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveLogs(entries: DiffLogEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export const TextDiffLogger = observer(() => {
  const [logs, setLogs] = useState<DiffLogEntry[]>([]);
  const lastTextRef = useRef<string>(unit.editors[0].codepart ?? "");

  useEffect(() => {
    const existing = loadLogs();
    setLogs(existing);
    lastTextRef.current = unit.editors[0].codepart ?? "";
  }, []);

  useEffect(() => {
    // Чтобы не создавать множество interval при повторных монтированиях
    let mounted = true;
    let intervalId: number;

    const tick = () => {
      const current = unit.editors[0].codepart ?? "";
      const last = lastTextRef.current ?? "";

      if (current !== last) {
        const parts = diffChars(last, current) as DiffPart[];
        const logEntry: DiffLogEntry = {
          id: `${Date.now()}`,
          timestamp: new Date().toISOString(),
          from: last,
          to: current,
          parts,
        };
        setLogs((prev) => {
          const updated = [logEntry, ...prev];
          const trimmed = updated.slice(0, MAX_LOG_ENTRIES);
          saveLogs(trimmed);
          return trimmed;
        });
        lastTextRef.current = current;
      }
    };

    intervalId = window.setInterval(tick, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      style={{
        fontSize: 14,
        width: "500px",
      }}
    >
      <div
        aria-label="diff-log"
        style={{
          maxHeight: "100%",
          overflow: "auto",
          border: "1px solid #ddd",
          padding: "8px",
          borderRadius: 4,
        }}
      >
        {logs.length === 0 && (
          <div style={{ color: "#888" }}>Лог пуст. Изменений пока не было.</div>
        )}
        {logs.map((log) => (
          <div key={log.id} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
            <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
              {log.parts.map((p, idx) => {
                if (p.added) {
                  return (
                    <span key={idx} style={{ color: "#0a8f4a" }}>
                      {p.value}
                    </span>
                  );
                }
                if (p.removed) {
                  return (
                    <span
                      key={idx}
                      style={{
                        color: "#c62828",
                        textDecoration: "line-through",
                      }}
                    >
                      {p.value}
                    </span>
                  );
                }
                return <span key={idx}>{p.value}</span>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
