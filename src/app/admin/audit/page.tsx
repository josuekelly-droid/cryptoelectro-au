"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    fetch(`/api/admin/audit?page=${page}&limit=50`)
      .then((r) => r.json())
      .then((d) => {
        setLogs(d.logs || []);
        setTotalLogs(d.total || 0);
      });
  }, [page]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold">Audit Logs</h1>
        <Link href="/admin" className="btn-secondary text-sm">← Back</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-light">
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Date</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">User</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Action</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">Details</th>
                <th className="text-left text-xs font-medium text-text-primary/50 uppercase px-6 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="border-b border-secondary-light">
                  <td className="px-6 py-3 text-xs text-text-primary/40">
                    {new Date(log.createdAt).toLocaleString("en-AU")}
                  </td>
                  <td className="px-6 py-3 text-xs text-text-primary/60">{log.userId || "Anonymous"}</td>
                  <td className="px-6 py-3 text-xs">
                    <span className={`badge text-xs ${
                      log.action.startsWith("FAILED") || log.action.startsWith("SECURITY")
                        ? "badge-error"
                        : log.action.startsWith("ADMIN")
                        ? "badge-accent"
                        : log.action.includes("EXPIRED")
                        ? "badge-warning"
                        : log.action.includes("WITHDRAWAL") || log.action.includes("CREDIT")
                        ? "badge-accent"
                        : log.action.includes("COUPON")
                        ? "badge-accent"
                        : "badge-success"
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-text-primary/60 max-w-xs truncate">{log.details || "-"}</td>
                  <td className="px-6 py-3 text-xs text-text-primary/40">{log.ipAddress || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalLogs > 50 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50">Previous</button>
          <span className="text-sm text-text-primary/50">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={logs.length < 50} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}