"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface IndexingLog {
  id: string;
  url: string;
  type: string;
  status: string;
  error: string | null;
  createdAt: string;
}

export default function AdminIndexingPage() {
  const [logs, setLogs] = useState<IndexingLog[]>([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, success: 0, error: 0 });
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [progress, setProgress] = useState(0);

  const fetchLogs = useCallback(() => {
    fetch(`/api/admin/indexing-logs?filter=${filter}`)
      .then((r) => r.json())
      .then((d) => {
        setLogs(d.logs || []);
        setSummary(d.summary || { total: 0, pending: 0, success: 0, error: 0 });
        
        // Calculer la progression
        if (d.summary) {
          const done = d.summary.success + d.summary.error;
          const total = d.summary.total;
          setProgress(total > 0 ? Math.round((done / total) * 100) : 0);
        }
      });
  }, [filter]);

  useEffect(() => {
    fetchLogs();
    // Rafraîchir toutes les 3 secondes si indexation en cours
    const interval = setInterval(() => {
      if (summary.pending > 0) fetchLogs();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchLogs, summary.pending]);

  const startIndexing = async () => {
    if (!confirm(`Index ALL pages? This will use ${summary.total > 0 ? "new" : ""} Google Indexing API quota.`)) return;
    setIndexing(true);
    await fetch("/api/admin/index-all", { method: "POST" });
    fetchLogs();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">🔄 Google Indexing</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total URLs", value: summary.total, icon: "🔗", color: "text-accent" },
          { label: "Success", value: summary.success, icon: "✅", color: "text-success" },
          { label: "Pending", value: summary.pending, icon: "⏳", color: "text-warning" },
          { label: "Error", value: summary.error, icon: "❌", color: "text-error" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <span className="text-2xl">{stat.icon}</span>
            <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-text-primary/50">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {summary.pending > 0 && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Indexing in progress...</p>
            <p className="text-sm text-text-primary/50">{progress}%</p>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={startIndexing}
          disabled={summary.pending > 0}
          className="btn-primary text-sm"
        >
          {summary.pending > 0 ? "⏳ Indexing..." : "🚀 Index All Pages"}
        </button>
        
        {/* Filtres */}
        {["all", "pending", "success", "error"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn-secondary text-sm capitalize ${filter === f ? "border-accent text-accent" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 py-3">URL</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-4 py-3">Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-secondary-light hover:bg-secondary-dark/30">
                  <td className="px-4 py-3 text-xs font-mono text-text-primary/60 truncate max-w-[300px]">{log.url}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="badge badge-accent text-xs">{log.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className={`badge text-xs ${
                      log.status === "success" ? "badge-success" :
                      log.status === "pending" ? "badge-warning" : "badge-error"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-primary/40 max-w-[200px] truncate">{log.error || "-"}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-primary/50">
                    No indexing logs yet. Click "Index All Pages" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}