import React from "react";
import { useApp } from "./App";

export function ProtectedAdminRoute({ children }) {
  const { user, setPage } = useApp();
  
  // Vérifier si l'utilisateur existe et a le rôle ADMIN
  if (!user) {
    // Rediriger vers login
    setPage("login");
    return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
      <h2>⛔ Accès Refusé</h2>
      <p>Veuillez vous connecter pour accéder à cette page.</p>
    </div>;
  }
  
  if (user.role !== "ADMIN") {
    // Rediriger vers home
    setPage("home");
    return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
      <h2>🛡️ Administrateur Requis</h2>
      <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
    </div>;
  }
  
  return children;
}
