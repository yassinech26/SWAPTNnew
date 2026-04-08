import React, { useState, useEffect } from "react";
import * as api from "../api";
import { useApp } from "../App";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .admin-root {
    font-family: 'Space Grotesk', sans-serif;
    min-height: 100vh;
    background:
      radial-gradient(circle at 8% 2%, rgba(27, 154, 140, 0.08), transparent 24%),
      radial-gradient(circle at 92% 0, rgba(239, 106, 98, 0.06), transparent 26%),
      linear-gradient(180deg, #f7fbff 0%, #eff5fb 100%);
    color: #0f1723;
  }

  /* ── Sidebar ── */
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }

  .admin-sidebar {
    width: 252px;
    flex-shrink: 0;
    background: linear-gradient(180deg, #0f1723 0%, #132238 100%);
    display: flex;
    flex-direction: column;
    padding: 28px 0;
    position: sticky;
    top: 0;
    height: 100vh;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 8px 0 24px rgba(7, 19, 34, 0.22);
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 24px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }

  .sidebar-brand-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, #d9f6f3, #e8f1ff);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sidebar-brand-icon svg {
    width: 16px;
    height: 16px;
    color: #0f1723;
  }

  .sidebar-brand-text {
    font-size: 14px;
    font-weight: 600;
    color: #F7F6F3;
    letter-spacing: -0.01em;
  }

  .sidebar-brand-sub {
    font-size: 11px;
    color: rgba(247,246,243,0.4);
    font-weight: 400;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .sidebar-nav {
    flex: 1;
    padding: 20px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 400;
    color: rgba(241, 247, 255, 0.62);
    cursor: pointer;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    transition: transform 0.2s ease, color 0.2s ease, background 0.2s ease;
  }

  .sidebar-nav-item:hover {
    background: rgba(255,255,255,0.08);
    color: rgba(247, 251, 255, 0.94);
    transform: translateX(2px);
  }

  .sidebar-nav-item.active {
    background: linear-gradient(135deg, rgba(27, 154, 140, 0.24), rgba(21, 94, 117, 0.20));
    color: #f7fbff;
    font-weight: 500;
    box-shadow: inset 0 0 0 1px rgba(149, 215, 208, 0.26);
  }

  .sidebar-nav-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
    opacity: 0.6;
  }

  .sidebar-nav-item.active .sidebar-nav-dot {
    opacity: 1;
    background: #9de4d7;
  }

  .sidebar-footer {
    padding: 16px 24px;
    border-top: 1px solid rgba(255,255,255,0.12);
  }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sidebar-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255,255,255,0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: rgba(247,246,243,0.7);
    flex-shrink: 0;
  }

  .sidebar-user-name {
    font-size: 13px;
    font-weight: 500;
    color: rgba(247,251,255,0.82);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-user-role {
    font-size: 11px;
    color: rgba(247,251,255,0.45);
  }

  /* ── Main Content ── */
  .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .admin-topbar {
    background: rgba(255, 255, 255, 0.75);
    border-bottom: 1px solid #d9e4ef;
    padding: 0 36px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(10px);
  }

  .topbar-title {
    font-size: 15px;
    font-weight: 700;
    color: #0f1723;
    letter-spacing: -0.01em;
  }

  .topbar-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #e9f7f5;
    border: 1px solid #c6e4e0;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: #0f6f75;
    font-family: 'JetBrains Mono', monospace;
  }

  .topbar-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #1b9a8c;
  }

  /* ── Content Area ── */
  .admin-content {
    padding: 34px 36px;
    flex: 1;
  }

  .content-header {
    margin-bottom: 28px;
  }

  .content-title {
    font-size: 22px;
    font-weight: 700;
    color: #0f1723;
    letter-spacing: -0.025em;
    margin: 0 0 6px;
  }

  .content-subtitle {
    font-size: 13.5px;
    color: #586579;
    margin: 0;
    font-weight: 400;
  }

  /* ── Error ── */
  .error-banner {
    margin-bottom: 24px;
    padding: 12px 16px;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 8px;
    font-size: 13.5px;
    color: #B91C1C;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Loading ── */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
  }

  .loading-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid #E8E4D9;
    border-top-color: #1A1A18;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 14px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 14px;
    color: #888880;
  }

  /* ── Table ── */
  .data-table-wrapper {
    background: #FFFFFF;
    border: 1px solid #d9e4ef;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 14px 34px rgba(8, 24, 48, 0.08);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }

  .data-table thead {
    background: #f4f8fc;
    border-bottom: 1px solid #d9e4ef;
  }

  .data-table th {
    padding: 11px 16px;
    text-align: left;
    font-size: 11.5px;
    font-weight: 600;
    color: #637389;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .data-table td {
    padding: 12px 16px;
    color: #0f1723;
    vertical-align: middle;
    border-bottom: 1px solid #e7eef6;
    transition: background 0.2s ease;
  }

  .data-table tbody tr:last-child td {
    border-bottom: none;
  }

  .data-table tbody tr:hover td {
    background: #f5fbfb;
  }

  /* ── Badges ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 5px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  .badge-admin {
    background: #EEF2FF;
    color: #4338CA;
    border: 1px solid #C7D2FE;
  }

  .badge-user {
    background: #F0EDE4;
    color: #5A5A52;
    border: 1px solid #E0DBD0;
  }

  .badge-active {
    background: #F0FDF4;
    color: #166534;
    border: 1px solid #BBF7D0;
  }

  .badge-banned {
    background: #FEF2F2;
    color: #991B1B;
    border: 1px solid #FECACA;
  }

  /* ── Action Buttons ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 11px;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    font-family: inherit;
  }

  .btn-outline {
    background: transparent;
    border: 1px solid #E0DBD0;
    color: #3A3A36;
  }

  .btn-outline:hover {
    background: #f2f7fb;
    border-color: #b5c8dc;
    transform: translateY(-1px);
  }

  .btn-danger {
    background: transparent;
    border: 1px solid #FECACA;
    color: #B91C1C;
  }

  .btn-danger:hover {
    background: #FEF2F2;
    border-color: #FCA5A5;
    transform: translateY(-1px);
  }

  .btn-success {
    background: transparent;
    border: 1px solid #BBF7D0;
    color: #166534;
  }

  .btn-success:hover {
    background: #F0FDF4;
    border-color: #86EFAC;
    transform: translateY(-1px);
  }

  .btn-primary {
    background: linear-gradient(135deg, #0f766e, #155e75);
    color: #f7fbff;
    border: 1px solid transparent;
    box-shadow: 0 10px 22px rgba(15, 118, 110, 0.24);
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 24px rgba(15, 118, 110, 0.3);
  }

  .btn-actions {
    display: flex;
    gap: 6px;
  }

  /* ── Empty State ── */
  .empty-state {
    padding: 56px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .empty-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #F0EDE4;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  .empty-icon svg {
    width: 20px;
    height: 20px;
    color: #888880;
  }

  .empty-title {
    font-size: 14px;
    font-weight: 500;
    color: #1A1A18;
    margin: 0;
  }

  .empty-sub {
    font-size: 13px;
    color: #888880;
    margin: 0;
  }

  /* ── Report Card ── */
  .report-card {
    background: #FFFFFF;
    border: 1px solid #d9e4ef;
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 10px;
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 10px 24px rgba(8, 24, 48, 0.05);
  }

  .report-card:hover {
    border-color: #aac8df;
    transform: translateY(-2px);
    box-shadow: 0 16px 30px rgba(8, 24, 48, 0.1);
  }

  .report-card-inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  }

  .report-reason {
    font-size: 14px;
    font-weight: 600;
    color: #1A1A18;
    margin: 0 0 6px;
  }

  .report-desc {
    font-size: 13.5px;
    color: #5A5A52;
    margin: 0 0 12px;
    line-height: 1.6;
  }

  .report-meta {
    font-size: 12px;
    color: #888880;
  }

  .report-meta span {
    font-weight: 500;
    color: #5A5A52;
  }

  /* ── Listing Card ── */
  .listing-card {
    background: #FFFFFF;
    border: 1px solid #d9e4ef;
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 10px;
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 10px 24px rgba(8, 24, 48, 0.05);
  }

  .listing-card:hover {
    border-color: #aac8df;
    transform: translateY(-2px);
    box-shadow: 0 16px 30px rgba(8, 24, 48, 0.1);
  }

  .listing-card-inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  }

  .listing-title {
    font-size: 14px;
    font-weight: 600;
    color: #1A1A18;
    margin: 0 0 6px;
  }

  .listing-desc {
    font-size: 13.5px;
    color: #5A5A52;
    margin: 0 0 14px;
    line-height: 1.6;
  }

  .listing-meta-row {
    display: flex;
    gap: 20px;
  }

  .listing-meta-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .listing-meta-label {
    font-size: 11px;
    color: #888880;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .listing-meta-value {
    font-size: 13.5px;
    color: #1A1A18;
    font-weight: 500;
  }

  .listing-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    color: #1A1A18;
  }

  .row-highlight td {
    background: #edf8ff !important;
  }

  .row-highlight td:first-child {
    box-shadow: inset 3px 0 0 #0f6f75;
  }

  .listing-card.selected {
    border-color: #0f6f75;
    box-shadow: 0 0 0 1px #0f6f75 inset, 0 16px 32px rgba(15, 111, 117, 0.13);
    background: #f2fcfa;
  }
`;

export function AdminPage() {
  const { user } = useApp();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedReportedUserId, setSelectedReportedUserId] = useState(null);
  const [selectedReportedListingId, setSelectedReportedListingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allUsers, allReports, allListings] = await Promise.all([
        api.fetchAdminUsers(),
        api.fetchAdminReports(),
        api.fetchAdminListings(),
      ]);
      setUsers(Array.isArray(allUsers) ? allUsers : []);
      setReports(Array.isArray(allReports) ? allReports : []);
      setListings(Array.isArray(allListings) ? allListings : []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initials = (name) =>
    name
      ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "??";

  const tabs = [
    { id: "users", label: "Users" },
    { id: "reports", label: "Reports" },
    { id: "listings", label: "Listings" },
  ];

  const tabTitles = {
    users: { title: "User Management", sub: "Review and moderate registered accounts." },
    reports: { title: "Pending Reports", sub: "Process reports submitted by the community." },
    listings: { title: "All Listings", sub: "Oversee items currently published on the platform." },
  };

  const handleReportFocusTarget = ({ type, targetId }) => {
    const normalizedType = String(type || "").toUpperCase();
    const numericTargetId = Number(targetId);

    if (!Number.isFinite(numericTargetId)) {
      return;
    }

    if (normalizedType === "LISTING") {
      setSelectedReportedListingId(numericTargetId);
      setSelectedReportedUserId(null);
      setActiveTab("listings");
      return;
    }

    if (normalizedType === "USER") {
      setSelectedReportedUserId(numericTargetId);
      setSelectedReportedListingId(null);
      setActiveTab("users");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="admin-root">
        <div className="admin-layout">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="sidebar-brand">
              <div className="sidebar-brand-icon">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4.5A2.5 2.5 0 014.5 2h7A2.5 2.5 0 0114 4.5v7a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 11.5v-7z"/>
                  <path d="M5.5 8h5M8 5.5v5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="sidebar-brand-text">SwapTn</div>
                <div className="sidebar-brand-sub">Administration</div>
              </div>
            </div>

            <nav className="sidebar-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`sidebar-nav-item ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="sidebar-nav-dot" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="sidebar-footer">
              <div className="sidebar-user">
                <div className="sidebar-avatar">{initials(user?.fullName || user?.name || "Admin")}</div>
                <div>
                  <div className="sidebar-user-name">{user?.fullName || user?.name || "Admin"}</div>
                  <div className="sidebar-user-role">Administrator</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="admin-main">
            <header className="admin-topbar">
              <span className="topbar-title">{tabTitles[activeTab].title}</span>
              <div className="topbar-badge">
                <span className="topbar-dot" />
                System Online
              </div>
            </header>

            <div className="admin-content">
              <div className="content-header">
                <h1 className="content-title">{tabTitles[activeTab].title}</h1>
                <p className="content-subtitle">{tabTitles[activeTab].sub}</p>
              </div>

              {error && (
                <div className="error-banner">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="8" r="7"/><path d="M8 5v3.5M8 11h.01" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner" />
                  <p className="loading-text">Loading data...</p>
                </div>
              ) : (
                <>
                  {activeTab === "users" && (
                    <UsersTab
                      users={users}
                      onUsersChange={setUsers}
                      setParentError={setError}
                      selectedUserId={selectedReportedUserId}
                    />
                  )}
                  {activeTab === "reports" && (
                    <ReportsTab
                      reports={reports}
                      onReportsChange={setReports}
                      setParentError={setError}
                      onFocusTarget={handleReportFocusTarget}
                    />
                  )}
                  {activeTab === "listings" && (
                    <ListingsTab
                      listings={listings}
                      selectedListingId={selectedReportedListingId}
                      onListingsChange={setListings}
                      setParentError={setError}
                    />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// ─── USERS TAB ────────────────────────────────────────────────
function UsersTab({ users, onUsersChange, setParentError, selectedUserId }) {
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const userList = Array.isArray(users) ? users : [];

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }
    const row = document.getElementById(`admin-user-${selectedUserId}`);
    row?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedUserId, userList.length]);

  const updateUsersState = (updater) => {
    if (!onUsersChange) {
      return;
    }

    onUsersChange((prev) => {
      const source = Array.isArray(prev) ? prev : userList;
      return typeof updater === "function" ? updater(source) : updater;
    });
  };

  const runUserAction = async (userId, action) => {
    try {
      setActionError("");
      setActionLoadingId(userId);
      await action();
    } catch (err) {
      const message = err?.message || "Action failed. Please try again.";
      setActionError(message);
      if (setParentError) {
        setParentError(message);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEditRole = async (targetUser) => {
    const rawRole = window.prompt(
      `New role for ${targetUser.fullName || targetUser.email} (ADMIN or USER)`,
      targetUser.role === "ADMIN" ? "USER" : "ADMIN"
    );

    if (rawRole === null) {
      return;
    }

    const nextRole = rawRole.trim().toUpperCase();
    if (!["ADMIN", "USER"].includes(nextRole)) {
      window.alert("Role must be ADMIN or USER.");
      return;
    }

    await runUserAction(targetUser.id, async () => {
      const updatedUser = await api.updateAdminUserRole(targetUser.id, nextRole);
      updateUsersState((prev) => prev.map((u) =>
        u.id === targetUser.id
          ? {
              ...u,
              ...(updatedUser || {}),
              role: updatedUser?.role || nextRole,
            }
          : u
      ));
    });
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm("Confirm banning this user?")) {
      return;
    }

    await runUserAction(userId, async () => {
      await api.banAdminUser(userId);
      updateUsersState((prev) => prev.map((u) =>
        u.id === userId ? { ...u, status: "BANNED" } : u
      ));
    });
  };

  const handleUnbanUser = async (userId) => {
    if (!window.confirm("Confirm unbanning this user?")) {
      return;
    }

    await runUserAction(userId, async () => {
      await api.unbanAdminUser(userId);
      updateUsersState((prev) => prev.map((u) =>
        u.id === userId ? { ...u, status: "ACTIVE" } : u
      ));
    });
  };

  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`Permanently delete ${targetUser.fullName || targetUser.email}? This action cannot be undone.`)) {
      return;
    }

    await runUserAction(targetUser.id, async () => {
      await api.deleteAdminUser(targetUser.id);
      updateUsersState((prev) => prev.filter((u) => u.id !== targetUser.id));
    });
  };

  const initials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div className="data-table-wrapper">
      {actionError && (
        <div className="error-banner" style={{ margin: 12 }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
          </svg>
          {actionError}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((u) => (
            <tr
              key={u.id}
              id={`admin-user-${u.id}`}
              className={Number(selectedUserId) === Number(u.id) ? "row-highlight" : ""}
            >
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#F0EDE4", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#5A5A52",
                    flexShrink: 0,
                  }}>
                    {initials(u.fullName)}
                  </div>
                  <span style={{ fontWeight: 500 }}>{u.fullName || "User"}</span>
                </div>
              </td>
              <td style={{ color: "#5A5A52", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{u.email}</td>
              <td>
                <span className={`badge ${u.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>
                  {u.role}
                </span>
              </td>
              <td>
                <span className={`badge ${u.status === "ACTIVE" ? "badge-active" : "badge-banned"}`}>
                  <span className="badge-dot" />
                  {u.status === "ACTIVE" ? "Active" : "Banned"}
                </span>
              </td>
              <td>
                <div className="btn-actions">
                  <button className="btn btn-outline" onClick={() => handleEditRole(u)} disabled={actionLoadingId === u.id}>
                    {actionLoadingId === u.id ? "Editing..." : "Edit"}
                  </button>
                  {u.status === "ACTIVE" ? (
                    <button className="btn btn-danger" onClick={() => handleBanUser(u.id)} disabled={actionLoadingId === u.id}>
                      {actionLoadingId === u.id ? "Please wait..." : "Ban"}
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={() => handleUnbanUser(u.id)} disabled={actionLoadingId === u.id}>
                      {actionLoadingId === u.id ? "Please wait..." : "Unban"}
                    </button>
                  )}
                  <button className="btn btn-danger" onClick={() => handleDeleteUser(u)} disabled={actionLoadingId === u.id}>
                    {actionLoadingId === u.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {userList.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 17a7 7 0 0114 0H5z" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="empty-title">No users</p>
          <p className="empty-sub">No accounts were found in the database.</p>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS TAB ──────────────────────────────────────────────
function ReportsTab({ reports, onReportsChange, setParentError, onFocusTarget }) {
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const reportList = Array.isArray(reports) ? reports : [];

  const updateReportsState = (updater) => {
    if (!onReportsChange) {
      return;
    }

    onReportsChange((prev) => {
      const source = Array.isArray(prev) ? prev : reportList;
      return typeof updater === "function" ? updater(source) : updater;
    });
  };

  const runReportAction = async (reportId, action) => {
    try {
      setActionError("");
      setActionLoadingId(reportId);
      await action();
    } catch (err) {
      const message = err?.message || "Action failed. Please try again.";
      setActionError(message);
      if (setParentError) {
        setParentError(message);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return String(dateValue);
    return parsed.toLocaleString("en-US");
  };

  const formatStatus = (status) => {
    const normalized = (status || "").toUpperCase();
    if (normalized === "RESOLVED") return "Report done";
    if (normalized === "REJECTED") return "Rejected";
    return "Pending";
  };

  const handleApprove = async (report) => {
    const targetId = Number(report?.targetId);
    if (!Number.isFinite(targetId)) {
      setActionError("Invalid report target.");
      return;
    }

    await runReportAction(report.id, async () => {
      const type = (report?.type || "").toUpperCase();

      const updated = await api.updateAdminReportStatus(report.id, "RESOLVED");
      updateReportsState((prev) => prev.map((r) =>
        r.id === report.id
          ? { ...r, status: updated?.status || "RESOLVED" }
          : r
      ));

      if (onFocusTarget && (type === "LISTING" || type === "USER")) {
        onFocusTarget({ type, targetId });
      }
    });
  };

  const handleReject = async (report) => {
    if (!window.confirm("Delete this report from the database?")) {
      return;
    }

    await runReportAction(report.id, async () => {
      await api.deleteAdminReport(report.id);
      updateReportsState((prev) => prev.filter((r) => r.id !== report.id));
    });
  };

  if (reportList.length === 0) {
    return (
      <div className="data-table-wrapper">
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="empty-title">No pending reports</p>
          <p className="empty-sub">The platform currently looks clean and safe.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {actionError && (
        <div className="error-banner" style={{ marginBottom: 12 }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
          </svg>
          {actionError}
        </div>
      )}

      {reportList.map((r) => (
        <div className="report-card" key={r.id}>
          <div className="report-card-inner">
            <div style={{ flex: 1 }}>
              <p className="report-reason">{r.reason || "No reason provided"}</p>
              <p className="report-desc">Type: {r.type || "-"} · Target ID: {r.targetId ?? "-"}</p>
              <p className="report-meta">Reported by: <span>{r.reportedById ?? "-"}</span> · Status: <span>{formatStatus(r.status)}</span> · Date: <span>{formatDate(r.createdAt)}</span></p>
            </div>
            <div className="btn-actions">
              {(r.status || "").toUpperCase() === "RESOLVED" ? (
                <span className="badge badge-active">
                  <span className="badge-dot" />
                  Report done
                </span>
              ) : (
                <>
                  <button className="btn btn-success" onClick={() => handleApprove(r)} disabled={actionLoadingId === r.id}>
                    {actionLoadingId === r.id ? "Processing..." : "Resolve"}
                  </button>
                  <button className="btn btn-outline" onClick={() => handleReject(r)} disabled={actionLoadingId === r.id}>
                    {actionLoadingId === r.id ? "Processing..." : "Reject"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LISTINGS TAB ─────────────────────────────────────────────
function ListingsTab({ listings, selectedListingId, onListingsChange, setParentError }) {
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const listingList = Array.isArray(listings) ? listings : [];

  const updateListingsState = (updater) => {
    if (!onListingsChange) {
      return;
    }

    onListingsChange((prev) => {
      const source = Array.isArray(prev) ? prev : listingList;
      return typeof updater === "function" ? updater(source) : updater;
    });
  };

  const runListingAction = async (listingId, action) => {
    try {
      setActionError("");
      setActionLoadingId(listingId);
      await action();
    } catch (err) {
      const message = err?.message || "Action failed. Please try again.";
      setActionError(message);
      if (setParentError) {
        setParentError(message);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeactivate = async (listing) => {
    const listingStatus = String(listing?.status || "ACTIVE").toUpperCase();
    if (listingStatus === "INACTIVE") {
      return;
    }

    if (!window.confirm("Deactivate this listing? It will no longer be visible to other users.")) {
      return;
    }

    await runListingAction(listing.id, async () => {
      const updated = await api.deactivateAdminListing(listing.id);
      updateListingsState((prev) => prev.map((item) =>
        Number(item.id) === Number(listing.id)
          ? { ...item, ...(updated || {}), status: updated?.status || "INACTIVE" }
          : item
      ));
    });
  };

  useEffect(() => {
    if (!selectedListingId) {
      return;
    }
    const card = document.getElementById(`admin-listing-${selectedListingId}`);
    card?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedListingId, listingList.length]);

  if (listingList.length === 0) {
    return (
      <div className="data-table-wrapper">
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="empty-title">No listings</p>
          <p className="empty-sub">No listings are available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {actionError && (
        <div className="error-banner" style={{ marginBottom: 12 }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
          </svg>
          {actionError}
        </div>
      )}

      {listingList.map((l) => {
        const listingStatus = String(l.status || "ACTIVE").toUpperCase();
        const isInactive = listingStatus === "INACTIVE";

        return (
          <div
            className={`listing-card ${Number(selectedListingId) === Number(l.id) ? "selected" : ""}`}
            key={l.id}
            id={`admin-listing-${l.id}`}
          >
            <div className="listing-card-inner">
              <div style={{ flex: 1 }}>
                <p className="listing-title">{l.title}</p>
                <p className="listing-desc">{l.description}</p>
                <div className="listing-meta-row">
                  <div className="listing-meta-item">
                    <span className="listing-meta-label">Price</span>
                    <span className="listing-price">{l.price} TND</span>
                  </div>
                  <div className="listing-meta-item">
                    <span className="listing-meta-label">Seller</span>
                    <span className="listing-meta-value">{l.owner?.fullName || l.seller?.fullName || "-"}</span>
                  </div>
                  <div className="listing-meta-item">
                    <span className="listing-meta-label">Location</span>
                    <span className="listing-meta-value">{l.location}</span>
                  </div>
                  <div className="listing-meta-item">
                    <span className="listing-meta-label">Status</span>
                    <span className="listing-meta-value">{listingStatus}</span>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => handleDeactivate(l)}
                disabled={actionLoadingId === l.id || isInactive}
                style={{ opacity: actionLoadingId === l.id || isInactive ? 0.6 : 1, cursor: actionLoadingId === l.id || isInactive ? "not-allowed" : "pointer" }}
              >
                {actionLoadingId === l.id ? "Processing..." : isInactive ? "Deactivated" : "Deactivate"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}