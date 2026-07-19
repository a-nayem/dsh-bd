"use client";

import { useEffect, useState } from "react";

type MailMsg = { id: string; from: string; subject: string; snippet: string };
type MailData = { connected: boolean; unreadCount?: number; messages?: MailMsg[]; message?: string };

export default function MailPanel() {
  const [data, setData] = useState<MailData | null>(null);

  useEffect(() => {
    fetch("/api/mail")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ connected: false, message: "Could not reach mail endpoint" }));
  }, []);

  return (
    <div className="panel">
      <div className="panel-label">
        Mail {data?.connected && data.unreadCount ? <span className="badge">{data.unreadCount}</span> : null}
      </div>
      {!data && <div className="loading">checking inbox...</div>}
      {data && !data.connected && (
        <div className="loading">
          Not connected. {data.message} See README → &quot;Connecting Gmail&quot;.
        </div>
      )}
      {data && data.connected && data.messages && data.messages.length === 0 && (
        <div className="loading">Inbox zero. Nothing unread.</div>
      )}
      {data && data.connected &&
        data.messages?.map((m) => (
          <div className="repo-item" key={m.id}>
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <span style={{ color: "var(--text)", fontSize: 12 }}>{m.subject}</span>
              <span className="repo-meta">{m.from}</span>
            </div>
          </div>
        ))}
    </div>
  );
}
