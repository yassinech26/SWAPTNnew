import React, { useState, useEffect } from "react";
import * as api from "../api";
import { useApp } from "../App";

export function AdminPage() {
  const { user, t } = useApp();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Pour l'instant, charger les listings publiques
      // Les endpoints admin seront créés au backend
      const allListings = await api.getListings();
      setListings(allListings || []);
    } catch (err) {
      console.error("Erreur chargement données admin:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">🛡️ Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenue, {user?.fullName}</p>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          👥 Utilisateurs
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "reports"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          ⚠️ Signalements
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "listings"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📦 Annonces
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">⌛</div>
          <p className="text-gray-600 mt-4">Chargement des données...</p>
        </div>
      ) : (
        <>
          {activeTab === "users" && <UsersTab users={users} />}
          {activeTab === "reports" && <ReportsTab reports={reports} />}
          {activeTab === "listings" && <ListingsTab listings={listings} />}
        </>
      )}
    </div>
  );
}

// ─── USERS TAB ───────────────────────────────────────────────
function UsersTab({ users }) {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Pour l'instant, afficher un placeholder
    // Les données viendront de l'API admin quand elle sera prête
    setUserList([
      {
        id: 1,
        fullName: "Admin User",
        email: "admin@swaptn.tn",
        role: "ADMIN",
        status: "ACTIVE",
      },
    ]);
  }, [users]);

  const handleBanUser = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir bannir cet utilisateur?")) {
      console.log("Bannir l'utilisateur:", userId);
      // Appel API à implémenter: POST /admin/users/{id}/ban
    }
  };

  const handleUnbanUser = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir débannir cet utilisateur?")) {
      console.log("Débannir l'utilisateur:", userId);
      // Appel API à implémenter: POST /admin/users/{id}/unban
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Rôle
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm">{user.fullName}</td>
              <td className="px-6 py-4 text-sm">{user.email}</td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  Éditer
                </button>
                {user.status === "ACTIVE" ? (
                  <button
                    onClick={() => handleBanUser(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Bannir
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnbanUser(user.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Débannir
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {userList.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Aucun utilisateur trouvé
        </div>
      )}
    </div>
  );
}

// ─── REPORTS TAB ──────────────────────────────────────────────
function ReportsTab({ reports }) {
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    // Placeholder jusqu'à ce que l'API soit prête
    setReportList([]);
  }, [reports]);

  const handleApproveReport = async (reportId) => {
    console.log("Approuver signalement:", reportId);
    // Appel API à implémenter
  };

  const handleRejectReport = async (reportId) => {
    console.log("Rejeter signalement:", reportId);
    // Appel API à implémenter
  };

  return (
    <div className="grid gap-4">
      {reportList.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center text-gray-500">
          ✅ Aucun signalement en attente
        </div>
      ) : (
        reportList.map((report) => (
          <div key={report.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{report.reason}</h3>
                <p className="text-gray-600 text-sm mt-2">{report.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Signalé par: {report.reportedBy}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApproveReport(report.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                >
                  ✓ Valider
                </button>
                <button
                  onClick={() => handleRejectReport(report.id)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  ✗ Rejeter
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── LISTINGS TAB ─────────────────────────────────────────────
function ListingsTab({ listings }) {
  const handleDeactivateListing = async (listingId) => {
    if (window.confirm("Êtes-vous sûr de vouloir désactiver cette annonce?")) {
      console.log("Désactiver annonce:", listingId);
      // Appel API à implémenter
    }
  };

  return (
    <div className="grid gap-4">
      {listings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center text-gray-500">
          Aucune annonce trouvée
        </div>
      ) : (
        listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{listing.title}</h3>
                <p className="text-gray-600 text-sm">{listing.description}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>💰 {listing.price} TND</span>
                  <span>👤 {listing.seller?.fullName}</span>
                  <span>📍 {listing.location}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeactivateListing(listing.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              >
                🚫 Désactiver
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
