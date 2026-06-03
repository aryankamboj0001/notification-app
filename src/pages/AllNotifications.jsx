import { useEffect, useState, useCallback } from "react";
import { getNotifications } from "../services/api";

const PRIORITY = { Placement: 3, Result: 2, Event: 1 };
const PER_PAGE = 5;

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const TYPE_CONFIG = {
  Placement: {
    accent: "#1D9E75",
    badge: { background: "rgba(29,158,117,0.15)", color: "#4ECBA0" },
    dot: "#1D9E75",
    icon: "💼",
  },
  Result: {
    accent: "#E8A020",
    badge: { background: "rgba(232,160,32,0.15)", color: "#F0BB5A" },
    dot: "#E8A020",
    icon: "📊",
  },
  Event: {
    accent: "#4A9EE8",
    badge: { background: "rgba(74,158,232,0.15)", color: "#7BBCF0" },
    dot: "#4A9EE8",
    icon: "📅",
  },
};

const FILTER_DOTS = {
  All: "#888",
  Placement: "#1D9E75",
  Result: "#E8A020",
  Event: "#4A9EE8",
};

const BASE_PAGE_BTN = {
  fontSize: 13,
  padding: "8px 18px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1E293B",
  color: "#CBD5E1",
  cursor: "pointer",
  transition: "all 0.15s",
};

const DISABLED_PAGE_BTN = {
  fontSize: 13,
  padding: "8px 18px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "transparent",
  color: "#475569",
  cursor: "default",
  transition: "all 0.15s",
};

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [readSet, setReadSet] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("inbox_read") || "[]"));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getNotifications();
      if (data?.notifications) setNotifications(data.notifications);
    }
    fetchData();
  }, []);

  const saveRead = useCallback((newSet) => {
    localStorage.setItem("inbox_read", JSON.stringify([...newSet]));
    setReadSet(new Set(newSet));
  }, []);

  const markAsRead = useCallback(
    (id, e) => {
      e?.stopPropagation();
      if (readSet.has(id)) return;
      const updated = new Set(readSet);
      updated.add(id);
      saveRead(updated);
    },
    [readSet, saveRead]
  );

  const isRead = (id) => readSet.has(id);

  const sorted = [...notifications].sort((a, b) => {
    if (PRIORITY[b.Type] !== PRIORITY[a.Type])
      return PRIORITY[b.Type] - PRIORITY[a.Type];
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  const filtered =
    filter === "All" ? sorted : sorted.filter((n) => n.Type === filter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  const unreadCount = notifications.filter((n) => !isRead(n.ID)).length;

  const filterCount = (f) =>
    f === "All"
      ? notifications.length
      : notifications.filter((n) => n.Type === f).length;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "28px 16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#E2E8F0",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#F1F5F9" }}>
          🔔 Priority Inbox
        </h2>
        <span style={{ fontSize: 13, color: "#64748B" }}>
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Placement", "Result", "Event"].map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 500,
                padding: "6px 14px",
                borderRadius: 20,
                border: isActive ? "1px solid #60A5FA" : "1px solid #334155",
                background: isActive ? "rgba(96,165,250,0.12)" : "transparent",
                color: isActive ? "#93C5FD" : "#64748B",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: FILTER_DOTS[f],
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {f}
              <span style={{ opacity: 0.5 }}>{filterCount(f)}</span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {pageItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "56px 0",
              color: "#475569",
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📭</div>
            No notifications here
          </div>
        ) : (
          pageItems.map((item) => {
            const cfg = TYPE_CONFIG[item.Type] || TYPE_CONFIG.Event;
            const read = isRead(item.ID);
            return (
              <div
                key={item.ID}
                onClick={() => markAsRead(item.ID)}
                style={{
                  position: "relative",
                  background: read ? "rgba(255,255,255,0.02)" : "#1E293B",
                  border: `1px solid ${read ? "#1E293B" : "#2D3F55"}`,
                  borderRadius: 12,
                  padding: "14px 18px 14px 22px",
                  cursor: "pointer",
                  opacity: read ? 0.55 : 1,
                  transition: "all 0.18s ease",
                  overflow: "hidden",
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    borderRadius: "12px 0 0 12px",
                    background: cfg.accent,
                  }}
                />

                {/* Badge row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {!read && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: cfg.dot,
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      letterSpacing: "0.04em",
                      ...cfg.badge,
                    }}
                  >
                    {cfg.icon} {item.Type}
                  </span>
                </div>

                {/* Message */}
                <p
                  style={{
                    fontSize: 14,
                    color: read ? "#64748B" : "#CBD5E1",
                    lineHeight: 1.55,
                    margin: "0 0 10px",
                  }}
                >
                  {item.Message}
                </p>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 10,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#475569" }}>
                    🕐 {formatTime(item.Timestamp)}
                  </span>
                  {read ? (
                    <span style={{ fontSize: 12, color: "#334155" }}>✓ Read</span>
                  ) : (
                    <button
                      onClick={(e) => markAsRead(item.ID, e)}
                      style={{
                        fontSize: 12,
                        color: "#60A5FA",
                        background: "rgba(96,165,250,0.08)",
                        border: "1px solid rgba(96,165,250,0.25)",
                        padding: "4px 12px",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          marginTop: 28,
        }}
      >
        <button
          disabled={safePage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          style={safePage === 1 ? DISABLED_PAGE_BTN : BASE_PAGE_BTN}
        >
          ← Prev
        </button>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                width: i + 1 === safePage ? 20 : 7,
                height: 7,
                borderRadius: 4,
                background: i + 1 === safePage ? "#60A5FA" : "#334155",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <button
          disabled={safePage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          style={safePage === totalPages ? DISABLED_PAGE_BTN : BASE_PAGE_BTN}
        >
          Next →
        </button>
      </div>
    </div>
  );
}