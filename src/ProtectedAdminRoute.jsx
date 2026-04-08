import React from "react";
import { useApp } from "./App";

export function ProtectedAdminRoute({ children }) {
  const { user, setPage } = useApp();
  
  // Ensure user exists and has ADMIN role
  if (!user) {
    // Redirect to login
    setPage("login");
    return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
      <h2>⛔ Access Denied</h2>
      <p>Please sign in to access this page.</p>
    </div>;
  }
  
  if (user.role !== "ADMIN") {
    // Redirect to home
    setPage("home");
    return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
      <h2>🛡️ Admin Required</h2>
      <p>You do not have permission to access this page.</p>
    </div>;
  }
  
  return children;
}
