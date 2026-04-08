// ─── API SERVICE LAYER ──────────────────────────────────────────────────────
// Centralized API calls for SwapTN frontend → Spring Boot backend
// Backend runs on http://localhost:8081

// Use full URL for CORS-enabled backend, or relative URL for proxy
const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8081'
  : 'https://api.swaptn.com'; // Update with production URL

// ─── TOKEN HELPERS ────────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem('swaptn_token');
}

export function setToken(token) {
  localStorage.setItem('swaptn_token', token);
}

export function clearToken() {
  localStorage.removeItem('swaptn_token');
}

function authHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export function getCurrentUserEmail() {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.sub || null;
}

// ─── GENERIC FETCH WRAPPER ────────────────────────────────────────────────────

async function request(url, options = {}) {
  // Always use relative URL - Vite proxy handles routing in dev, production proxies handle prod
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  
  console.log(`[API] ${options.method || 'GET'} ${url} -> ${res.status}`);

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const body = await res.json();
      errorMsg = body.message || body.error || JSON.stringify(body);
    } catch {
      try { errorMsg = await res.text(); } catch {}
    }
    console.error(`[REQUEST] Failed: ${res.status} - ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // Some endpoints return empty body (204, etc.)
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  try {
    console.log(`[LOGIN] Attempting login for ${email}`);
    // Clear any expired tokens before logging in
    clearToken();
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    console.log(`[LOGIN] Success:`, data);
    // data = { message, token, id, fullName, email, imageUrl }
    if (data?.token) setToken(data.token);
    return data;
  } catch (err) {
    console.error(`[LOGIN] Error:`, err);
    throw err;
  }
}

export async function register(fullName, email, password) {
  const data = await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });
  // data = { id, fullName, email }
  return data;
}

export async function logout() {
  clearToken();
}

// ─── USER ─────────────────────────────────────────────────────────────────────

export async function getUserById(id) {
  return request(`/users/${id}`);
}

export async function updateProfile(id, data) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ─── ADMIN USERS ─────────────────────────────────────────────────────────────

export async function fetchAdminUsers() {
  return request('/admin/users');
}

export async function updateAdminUserRole(id, role) {
  return request(`/admin/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
}

export async function banAdminUser(id) {
  return request(`/admin/users/${id}/ban`, {
    method: 'POST',
  });
}

export async function unbanAdminUser(id) {
  return request(`/admin/users/${id}/unban`, {
    method: 'POST',
  });
}

export async function deleteAdminUser(id) {
  return request(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchAdminReports() {
  return request('/admin/reports');
}

export async function fetchAdminListings() {
  return request('/admin/listings');
}

export async function deleteAdminReport(id) {
  return request(`/admin/reports/${id}`, {
    method: 'DELETE',
  });
}

export async function updateAdminReportStatus(id, status) {
  return request(`/admin/reports/${id}/status?status=${encodeURIComponent(status)}`, {
    method: 'PATCH',
  });
}

export async function deactivateAdminListing(id) {
  return request(`/admin/listings/${id}/deactivate`, {
    method: 'PATCH',
  });
}

// ─── LISTINGS ─────────────────────────────────────────────────────────────────

export async function fetchListings() {
  return request('/api/listings');
}

export async function fetchListingById(id) {
  return request(`/api/listings/${id}`);
}

export async function createListing(listingData) {
  return request('/api/listings', {
    method: 'POST',
    body: JSON.stringify(listingData),
  });
}

export async function updateListing(id, listingData) {
  return request(`/api/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(listingData),
  });
}

export async function deleteListing(id) {
  return request(`/api/listings/${id}`, { method: 'DELETE' });
}

export async function searchListings(title) {
  return request(`/api/listings/search?title=${encodeURIComponent(title)}`);
}

export async function filterByCategory(category) {
  return request(`/api/listings/category/${encodeURIComponent(category)}`);
}

// ─── CONVERSATIONS ────────────────────────────────────────────────────────────

export async function fetchConversations() {
  return request('/api/conversations');
}

export async function createConversation(listingId, otherUserId) {
  return request('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ listingId, otherUserId }),
  });
}

export async function fetchConversationById(id) {
  return request(`/api/conversations/${id}`);
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export async function fetchMessages(conversationId) {
  return request(`/api/messages/conversation/${conversationId}`);
}

export async function sendMessage(conversationId, content) {
  return request(`/api/messages?conversationId=${conversationId}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export async function fetchAllReviews() {
  return request('/api/reviews');
}

export async function fetchReviewsByUser(userId) {
  return request(`/api/reviews/user/${userId}`);
}

export async function createReview(reviewData) {
  return request('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

export async function deleteReview(id) {
  return request(`/api/reviews/${id}`, { method: 'DELETE' });
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────

export async function createReport(reportData) {
  return request('/api/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
}

export async function getReportsByStatus(status) {
  return request(`/api/reports/status?status=${status}`);
}

export async function getReportsByType(type) {
  return request(`/api/reports/type?type=${type}`);
}

// ─── JWT DECODE (without library) ─────────────────────────────────────────────

export function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded; // { sub: email, iat, exp }
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

export function isLoggedIn() {
  const token = getToken();
  return token && !isTokenExpired(token);
}
