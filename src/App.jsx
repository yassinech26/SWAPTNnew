import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import * as api from "./api";
import { MessagesPage as MessagesPageComponent } from "./MessagesPageFixed";
import { ProtectedAdminRoute } from "./ProtectedAdminRoute";
import { AdminPage } from "./pages/AdminPage";

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div style={{padding: "40px", textAlign: "center", color: "red"}}>
        <h1>⚠️ App Error</h1>
        <p>{this.state.error?.message}</p>
        <button onClick={() => window.location.reload()} style={{padding: "10px 20px", marginTop: "20px"}}>Reload</button>
      </div>;
    }
    return this.props.children;
  }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

// ─── FILTER ENUMS ──────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Jackets", "Shoes", "Bags", "Accessories"];
const CONDITIONS = ["New", "Used"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "38", "40", "42", "44", "One size"];
const LOCATIONS = ["Ariana", "Bardo", "Ben Arous", "Bizerte", "Gabes", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kebili", "Kelibia", "Kerkennah", "Korba", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const EN_TRANSLATIONS = {
  sell: "Sell", wishlist: "Wishlist", messages: "Messages", login: "Login",
  startShopping: "Start Shopping", listItem: "List an Item", shopSustainably: "Shop Sustainably · Sell Effortlessly",
  warpdrobe2ndchance: "Your Wardrobe's\nSecond Chance", buyPreLoved: "Buy & sell pre-loved fashion in Tunisia. Join thousands of style lovers giving clothes a new life.",
  language: "Language", english: "English", french: "French", arabic: "Arabic",
  shopByCategory: "Shop by Category", newArrivals: "New Arrivals", seeAll: "See all →",
  howItWorks: "How It Works", photographList: "Photograph & List", chatNegotiate: "Chat & Negotiate",
  shipIt: "Ship It", getPaid: "Get Paid",
  discoverItems: "Discover amazing pre-loved items", listAnItem: "List an Item", addPhotos: "Add Photos",
  turnUnused: "Turn your unused clothes into cash 💸", dragDropPhotos: "Drag & drop photos here",
  clickBrowse: "or click to browse your device", choosePhotos: "Choose Photos", itemDetails: "Item Details",
  setPrice: "Set Your Price", reviewPublish: "Review & Publish", publishListing: "Publish Listing",
  browse: "Browse", back: "← Back", continue: "Continue →", total: "Total",
  searchItems: "Search brands, items…", noResults: "No items found", filter: "Filter", sort: "Sort by", newest: "Newest",
  priceHigh: "Price: High to Low", priceLow: "Price: Low to High", title: "Title", brand: "Brand",
  category: "Category", condition: "New", new: "New", used: "Used", size: "Size", price: "Price", description: "Description",
  details: "Details", seller: "Seller", location: "Location", cond: "Condition",
  addToWishlist: "Add to Wishlist",
  profile: "Profile", notifications: "Notifications", home: "Home", signOut: "Sign Out",
  email: "Email", password: "Password", name: "Name", signUp: "Sign up", signIn: "Sign in",
  donttHaveAccount: "Don't have an account?", haveAccount: "Already have an account?", forgotPassword: "Forgot password?",
  createAccount: "Create Account →",
};

const TRANSLATIONS = {
  en: EN_TRANSLATIONS,
  fr: EN_TRANSLATIONS,
  ar: EN_TRANSLATIONS,
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal: #1b9a8c;
    --teal-dark: #0f6f75;
    --teal-light: #e9f7f5;
    --coral: #ef6a62;
    --gold: #e7aa2f;
    --dark: #0f1723;
    --gray: #5d6b7c;
    --light-gray: #f3f6f8;
    --border: #d7e1eb;
    --white: #ffffff;
    --shadow: 0 12px 30px rgba(8, 24, 48, 0.08);
    --shadow-lg: 0 24px 60px rgba(8, 24, 48, 0.16);
    --radius: 18px;
    --radius-sm: 10px;
    --font-display: 'Fraunces', serif;
    --font-body: 'Space Grotesk', sans-serif;
    --primary: linear-gradient(135deg, #0f766e 0%, #155e75 100%);
  }

  html, body, #root { width: 100%; min-height: 100%; }

  body {
    font-family: var(--font-body);
    background:
      radial-gradient(circle at 6% 2%, rgba(27,154,140,0.14), transparent 26%),
      radial-gradient(circle at 94% 0%, rgba(239,106,98,0.10), transparent 30%),
      linear-gradient(180deg, #fbfdff 0%, #f4f8fb 100%);
    color: var(--dark);
    min-height: 100vh;
  }

  button { cursor: pointer; font-family: var(--font-body); }
  input, textarea, select { font-family: var(--font-body); }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: #edf2f7; }
  ::-webkit-scrollbar-thumb { background: #b5c3d1; border-radius: 8px; }
  ::-webkit-scrollbar-thumb:hover { background: #8fa1b4; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-24px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes pageReveal {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes floatIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in { animation: fadeIn 0.42s ease forwards; }
  .slide-in { animation: slideIn 0.32s ease forwards; }
  .page-transition { animation: pageReveal 0.45s cubic-bezier(0.2, 0.85, 0.2, 1); }

  .btn-primary {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 15px;
    transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 10px 24px rgba(15, 118, 110, 0.28);
  }

  .btn-primary:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 16px 30px rgba(15, 118, 110, 0.34);
    filter: saturate(1.08);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.9);
    color: var(--teal-dark);
    border: 1px solid #bcd7d4;
    padding: 10px 22px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 15px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .btn-secondary:hover {
    background: var(--teal-light);
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(16, 88, 92, 0.14);
  }

  .card {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(215, 225, 235, 0.8);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    backdrop-filter: blur(6px);
    overflow: hidden;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 38px rgba(8, 24, 48, 0.12);
  }

  .badge {
    background: var(--teal-light);
    color: var(--teal-dark);
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid #cde6e3;
  }

  .badge-coral {
    background: #fff1ef;
    color: var(--coral);
    border-color: #f5c7c3;
  }

  .input-field {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 15px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    outline: none;
    background: rgba(255, 255, 255, 0.92);
  }

  .input-field:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 4px rgba(27, 154, 140, 0.14);
    background: #ffffff;
  }

  .messages-container {
    scrollbar-width: thin;
    scrollbar-color: #98afc2 #edf2f7;
  }

  .messages-container::-webkit-scrollbar {
    width: 10px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: #edf2f7;
    border-radius: 6px;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: #9ab0c4;
    border-radius: 6px;
  }

  .messages-container::-webkit-scrollbar-thumb:hover {
    background: #7f9ab1;
  }

  .page-header {
    font-family: var(--font-display);
    font-size: 34px;
    font-weight: 800;
    color: var(--dark);
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  main {
    isolation: isolate;
  }

  main > * {
    animation: floatIn 0.35s ease-out;
  }

  @media (max-width: 920px) {
    .page-header { font-size: 28px; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Navbar({ page, setPage, selectedCategory, setSelectedCategory, language, searchVal, setSearchVal }) {
  const { wishlist, user } = useApp();
  const t = TRANSLATIONS[language];
  const quickLinks = [["🏠 Home", "home"], ["🛍️ Browse", "browse"], ["❤️ Wishlist", "wishlist"], ["💬 Messages", "messages"], ["📦 Sell", "sell"]];

  // Calculate user messages count
  const userMessageCount = 0;

  const navStyle = {
    position: "sticky", top: 0, zIndex: 1000,
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid var(--border)",
    boxShadow: "0 8px 24px rgba(12, 35, 67, 0.08)",
    width: "100%",
  };
  const innerStyle = {
    width: "100%",
    display: "flex", alignItems: "center",
    padding: "0 24px", height: 70, gap: 16,
  };

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, minWidth: "fit-content" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--teal), var(--teal-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "white", fontWeight: 900
          }}>SW</div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "var(--teal-dark)" }}>SwapTn</span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Search */}
        <div style={{ maxWidth: 500, display: "flex", gap: 8, width: "100%"}}>
          <div style={{ flex: 1, position: "relative"}}>
            <input
              className="input-field"
              style={{ paddingLeft: 44, borderRadius: 50, width: "100%" }}
              placeholder="Search items"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && setPage("browse")}
            />
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--gray)", fontSize: 16 }}>🔍</span>
          </div>
          <button
            onClick={() => setPage("browse")}
            className="btn-primary"
            style={{
              padding: "10px 20px",
              borderRadius: 50,
              fontWeight: 600,
              fontSize: 14,
              justifyContent: "center"
            }}
          >
            Search
          </button>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "var(--teal-dark)",
            background: "var(--teal-light)",
            border: "1px solid #cbe7e2",
            borderRadius: 999,
            padding: "6px 10px"
          }}>
            ENGLISH UI
          </span>
        </div>

        {/* Login / Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NavBtn icon="🏷️" label={t.sell} highlight onClick={() => setPage("sell")} />
          <NavBtn icon="❤️" label={wishlist.length || ""} onClick={() => setPage("wishlist")} />
          <NavBtn icon="💬" label={userMessageCount || ""} onClick={() => setPage("messages")} badge={userMessageCount > 0} />
          {user && user.role === "ADMIN" && (
            <button 
              onClick={() => setPage("admin")}
              style={{
                padding: "8px 16px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                border: "none",
                borderRadius: 50,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.target.style.opacity = "0.8"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              🛡️ Admin
            </button>
          )}
          {user
            ? <div onClick={() => setPage("profile")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 50, border: "1px solid var(--border)", background: "rgba(255,255,255,0.85)", transition: "all 0.2s" }}>
                <Avatar src={user.avatar} size={28} alt="User avatar" />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
              </div>
            : <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }} onClick={() => setPage("login")}>{t.login}</button>
          }
        </div>
      </div>
      {/* Quick Shortcut Bar */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "8px 24px", display: "flex", gap: 6, overflowX: "auto", width: "100%", background: "rgba(255,255,255,0.72)" }}>
        {quickLinks.map(([label, targetPage]) => (
          <button key={targetPage} onClick={() => setPage(targetPage)} style={{
            padding: "6px 16px", borderRadius: 50, border: "none", whiteSpace: "nowrap",
            background: page === targetPage ? "var(--teal)" : "var(--light-gray)",
            color: page === targetPage ? "white" : "var(--gray)",
            fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s"
          }}>{label}</button>
        ))}
      </div>

      {/* Category Bar */}
      <div style={{ borderTop: "1px solid var(--border)", overflowX: "auto", width: "100%" }}>
        <div style={{ width: "100%", padding: "0 24px", display: "flex", gap: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setSelectedCategory(c); setPage("browse"); }} style={{
              padding: "10px 16px", background: "none", border: "none",
              fontSize: 13, fontWeight: 500, color: c === selectedCategory ? "var(--teal)" : "var(--gray)",
              whiteSpace: "nowrap", cursor: "pointer",
              borderBottom: c === selectedCategory ? "2px solid var(--teal)" : "2px solid transparent",
              transition: "all 0.2s"
            }}>{c}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavBtn({ icon, label, highlight, badge, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 4, padding: "8px 12px",
      background: highlight ? "linear-gradient(135deg, var(--teal), var(--teal-dark))" : "none",
      color: highlight ? "white" : "var(--dark)",
      border: highlight ? "none" : "none",
      borderRadius: 50, fontSize: 14, fontWeight: 500,
      position: "relative", transition: "all 0.2s"
    }}>
      <span>{icon}</span>
      {label !== "" && label !== undefined && (
        <span style={{
          background: badge ? "var(--coral)" : "transparent",
          color: badge ? "white" : "inherit",
          fontSize: badge ? 11 : 13,
          fontWeight: 600,
          padding: badge ? "2px 6px" : "0",
          borderRadius: 50, minWidth: badge ? 18 : "auto",
          textAlign: "center"
        }}>{label}</span>
      )}
    </button>
  );
}

function Avatar({ src, size = 40, alt = "Avatar", style = {} }) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = typeof src === "string" ? src.trim() : "";
  const hasImage = normalizedSrc !== "" && !hasError;
  const numericSize = typeof size === "number" ? size : parseInt(size, 10) || 40;
  const baseStyle = {
    width: numericSize,
    height: numericSize,
    borderRadius: "50%",
    flexShrink: 0,
    ...style
  };

  if (hasImage) {
    return (
      <img
        src={normalizedSrc}
        alt={alt}
        style={{ ...baseStyle, objectFit: "cover" }}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div style={{
      ...baseStyle,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--light-gray)",
      color: "var(--gray)",
      fontSize: Math.max(12, Math.round(numericSize * 0.42)),
      fontWeight: 700,
      border: style.border || "1px solid var(--border)"
    }}>
      <span style={{ lineHeight: 1 }}>👤</span>
    </div>
  );
}

function ItemCard({ item, onClick }) {
  const { wishlist, setWishlist } = useApp();
  const [liked, setLiked] = useState(wishlist.some(i => i.id === item.id));

  const toggle = (e) => {
    e.stopPropagation();
    if (liked) {
      setWishlist(w => w.filter(i => i.id !== item.id));
    } else {
      setWishlist(w => [...w, item]);
    }
    setLiked(!liked);
  };

  return (
    <div onClick={onClick} style={{
      background: "white", borderRadius: "var(--radius)",
      overflow: "hidden", cursor: "pointer",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      transition: "all 0.25s", position: "relative"
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
        <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <button onClick={toggle} style={{
          position: "absolute", top: 8, right: 8,
          background: "rgba(255,255,255,0.9)",
          border: "none", borderRadius: "50%",
          width: 34, height: 34, fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)", transition: "transform 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >{liked ? "❤️" : "🤍"}</button>
        <span style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(0,0,0,0.65)", color: "white",
          fontSize: 11, padding: "3px 8px", borderRadius: 50, backdropFilter: "blur(4px)"
        }}>{item.condition}</span>
      </div>
      <div style={{ padding: "12px" }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
        <div style={{ fontSize: 12, color: "var(--gray)", marginBottom: 8 }}>{item.brand} · {item.size}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--teal-dark)" }}>{item.price} TND</span>
          <span style={{ fontSize: 12, color: "var(--gray)" }}>❤️ {item.likes}</span>
        </div>
      </div>
    </div>
  );
}


// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage({ setPage, setSelectedItem, language }) {
  const t = TRANSLATIONS[language];
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #00b09b 0%, #009688 50%, #1a1a2e 100%)",
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
        direction: "ltr"
      }}>
        {/* Decorative circles */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: [300, 200, 150, 400, 100][i],
            height: [300, 200, 150, 400, 100][i],
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            top: [-50, 60, 200, -100, 150][i],
            right: [100, 300, -50, -200, 500][i],
            pointerEvents: "none"
          }} />
        ))}
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ flex: 1, color: "white" }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 50, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20, backdropFilter: "blur(8px)" }}>
              🌿 {t.shopSustainably}
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
              {t.warpdrobe2ndchance}
            </h1>
            <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 32, maxWidth: 480, lineHeight: 1.6 }}>
              {t.buyPreLoved}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ background: "white", color: "var(--teal-dark)", padding: "14px 32px", fontSize: 16 }} onClick={() => setPage("browse")}>
                🛍️ {t.startShopping}
              </button>
              <button className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.5)", color: "black", padding: "14px 32px", fontSize: 16 }} onClick={() => setPage("sell")}>
                ➕ {t.listItem}
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
              {[["50k+", "Members"], ["120k+", "Items"], ["4.9★", "Trust Score"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900 }}>{n}</div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero Cards - Coming from Backend */}
          <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 16, padding: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "white", textAlign: "center" }}>
            <p>Featured items will appear here</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px 0" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 24 }}>{t.shopByCategory}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
          {[
            { name: "Tops", emoji: "👕", color: "#e3f2fd" },
            { name: "Bottoms", emoji: "👖", color: "#fce4ec" },
            { name: "Dresses", emoji: "👗", color: "#f3e5f5" },
            { name: "Jackets", emoji: "🧥", color: "#e8f5e9" },
            { name: "Shoes", emoji: "👟", color: "#fff8e1" },
            { name: "Bags", emoji: "👜", color: "#e0f7fa" },
            { name: "Accessories", emoji: "💍", color: "#fff3e0" },
          ].map(cat => (
            <div key={cat.name} onClick={() => setPage("browse")} style={{
              background: cat.color, borderRadius: "var(--radius)",
              padding: "24px 16px", textAlign: "center", cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{cat.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Items - Coming from Backend */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900 }}>{t.newArrivals}</h2>
          <button className="btn-secondary" onClick={() => setPage("browse")}>{t.seeAll}</button>
        </div>
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
          <p>Items will be loaded from your backend API</p>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: "var(--teal-light)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, marginBottom: 48 }}>{t.howItWorks}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {[
              { icon: "📸", step: "1", title: t.photographList, desc: "Snap your items, set a price, and list them in minutes." },
              { icon: "💬", step: "2", title: t.chatNegotiate, desc: "Buyers can ask questions or make offers directly." },
              { icon: "📦", step: "3", title: t.shipIt, desc: "Use our integrated shipping labels for hassle-free delivery." },
              { icon: "💸", step: "4", title: t.getPaid, desc: "Receive your money once the buyer confirms receipt." },
            ].map(s => (
              <div key={s.step} style={{ background: "white", borderRadius: "var(--radius)", padding: 32, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ background: "var(--teal)", color: "white", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, margin: "0 auto 12px" }}>{s.step}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowsePage({ setPage, setSelectedItem, selectedCategory, language, listings = [], loading = false, searchVal = "", setSearchVal }) {
  const t = TRANSLATIONS[language];
  const { listingError } = useApp();
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "All");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({ minPrice: "", maxPrice: "", condition: "", size: "", location: "", brand: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState(null);  // null = not searched, [] = searched but no results
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setActiveCategory(selectedCategory || "All");
  }, [selectedCategory]);

  // Call backend search when searchVal changes and is not empty
  useEffect(() => {
    if (searchVal.trim() === "") {
      setSearchResults(null);  // Clear search results
      setSearchError("");
      return;
    }

    const performSearch = async () => {
      setSearching(true);
      setSearchError("");
      try {
        const results = await api.searchListings(searchVal);
        // Normalize search results to include avatar from database
        const normalized = Array.isArray(results) ? results.map(item => ({
          ...item,
          image: item.image || item.imageUrl,
          seller: item.owner?.fullName || item.seller || "Seller",
          sellerAvatar: item.owner?.imageUrl || null,
          sellerCity: item.owner?.city || item.location || "Tunisia",
          sellerId: item.owner?.id
        })) : [];
        setSearchResults(normalized);
      } catch (err) {
        setSearchError(err.message || "Failed to search. Please try again.");
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    performSearch();
  }, [searchVal]);

  // Use search results if available, otherwise use all listings
  const baseListings = searchResults !== null ? searchResults : listings;

  // Filter and sort listings (apply other filters on top of search or all listings)
  let filtered = baseListings.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    
    const price = parseFloat(item.price) || 0;
    const matchesPrice = (!filters.minPrice || price >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || price <= parseFloat(filters.maxPrice));
    
    const matchesCondition = !filters.condition || item.condition === filters.condition;
    const matchesSize = !filters.size || item.size === filters.size;
    const matchesLocation = !filters.location || item.location === filters.location;
    const matchesBrand = !filters.brand || (item.brand && item.brand.toLowerCase().includes(filters.brand.toLowerCase()));
    
    return matchesCategory && matchesPrice && matchesCondition && matchesSize && matchesLocation && matchesBrand;
  });

  // Sort
  if (sortBy === "price-asc") filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sortBy === "price-desc") filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sortBy === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", animation: "fadeIn 0.4s ease" }}>
      {listingError && !searchVal && (
        <div style={{ background: "#fff0f0", border: "1px solid var(--coral)", color: "var(--coral)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: 14, fontWeight: 500, textAlign: "center" }}>
          {listingError}
        </div>
      )}
      {searchError && (
        <div style={{ background: "#fff0f0", border: "1px solid var(--coral)", color: "var(--coral)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: 14, fontWeight: 500, textAlign: "center" }}>
          {searchError}
        </div>
      )}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input className="input-field" style={{ maxWidth: 400, borderRadius: 50 }} placeholder="🔍 Search items, brands…" value={searchVal} onChange={e => setSearchVal(e.target.value)} />
          <button
            onClick={() => setPage("browse")}
            style={{
              padding: "10px 20px",
              background: "var(--primary, #333)",
              color: "white",
              border: "none",
              borderRadius: 50,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.3s ease"
            }}
            onMouseEnter={e => e.target.style.opacity = "0.8"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            Search
          </button>
        </div>
        <button className="btn-secondary" style={{ padding: "10px 20px" }} onClick={() => setShowFilters(!showFilters)}>
          ⚙️ Filters {showFilters ? "▲" : "▼"}
        </button>
        <select className="input-field" style={{ maxWidth: 180 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
          <option value="popular">Most popular</option>
        </select>
        <span style={{ color: "var(--gray)", fontSize: 14 }}>{filtered.length} items found</span>
      </div>

      {/* Category Bar */}
      <div style={{ borderBottom: "1px solid var(--border)", marginBottom: 24, paddingBottom: 12, display: "flex", gap: 8, overflowX: "auto" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{
            padding: "8px 16px", background: "none", border: "1px solid var(--border)",
            fontSize: 13, fontWeight: 500, color: c === activeCategory ? "white" : "var(--gray)",
            backgroundColor: c === activeCategory ? "var(--teal)" : "transparent",
            borderRadius: "var(--radius-sm)",
            whiteSpace: "nowrap", cursor: "pointer",
            transition: "all 0.2s"
          }}>{c}</button>
        ))}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div style={{ background: "white", borderRadius: "var(--radius)", padding: 24, marginBottom: 24, boxShadow: "var(--shadow)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, animation: "fadeIn 0.3s ease" }}>
          <div>
            <label htmlFor="filter-brand" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Brand</label>
            <input id="filter-brand" className="input-field" type="text" placeholder="Put the brand" value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} />
          </div>
          {[["Min Price (TND)", "minPrice"], ["Max Price (TND)", "maxPrice"]].map(([label, key]) => (
            <div key={key}>
              <label htmlFor={`filter-${key}`} style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
              <input id={`filter-${key}`} className="input-field" type="number" placeholder="0" value={filters[key]} onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label htmlFor="filter-condition" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Condition</label>
            <select id="filter-condition" className="input-field" value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))}>
              <option value="">Any condition</option>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-size" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Size</label>
            <select id="filter-size" className="input-field" value={filters.size} onChange={e => setFilters(f => ({ ...f, size: e.target.value }))}>
              <option value="">Any size</option>
              {SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-location" style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Location</label>
            <select id="filter-location" className="input-field" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
              <option value="">All locations</option>
              {LOCATIONS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn-secondary" style={{ width: "100%", padding: 12 }} onClick={() => setFilters({ minPrice: "", maxPrice: "", condition: "", size: "", location: "", brand: "" })}>Clear Filters</button>
          </div>
        </div>
      )}

      {searching ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1.5s infinite" }}>🔍</div>
          <div>Searching for items...</div>
        </div>
      ) : loading && searchVal === "" ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1.5s infinite" }}>⏳</div>
          <div>Loading items...</div>
        </div>
      ) : filtered.length === 0 && !searchVal ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No items found</div>
          <div>Try adjusting your filters</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {filtered.map(item => <ItemCard key={item.id} item={item} onClick={() => { setSelectedItem(item); setPage("item"); }} />)}
        </div>
      )}
    </div>
  );
}

function ItemPage({ item, setPage, setSelectedSeller, language }) {
  const t = TRANSLATIONS[language];
  const { wishlist, setWishlist, user } = useApp();
  const [liked, setLiked] = useState(wishlist.some(i => i.id === item.id));
  const [activeImg, setActiveImg] = useState(0);
  const [messageSending, setMessageSending] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // ✅ FIXED: Get seller info from owner object - avatar comes from database imageUrl
  const sellerObj = item?.owner || {};
  const seller = { 
    name: item?.seller || sellerObj?.fullName || "Seller", 
    id: item?.sellerId || sellerObj?.id,
    avatar: item?.sellerAvatar || sellerObj?.imageUrl || null,
    rating: 4.5, 
    sales: 10, 
    location: item?.sellerCity || sellerObj?.city || item?.location || "Tunisia" 
  };
  
  // Debug log to see what we're receiving
  useEffect(() => {
    console.log("Item data:", { item, sellerObj, seller, avatar: seller.avatar });
  }, [item]);
  
  const imgs = [item?.image].filter(Boolean);

  const startConversation = async () => {
    setMessageSending(true);
    try {
      const conversation = await api.createConversation(item?.id, seller?.id);
      if (conversation?.id) {
        setPage("messages");
      }
    } catch (err) {
      console.error("Conversation error:", err);
      alert(err.message || "Request failed");
    } finally {
      setMessageSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("browse")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Back to results</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
        {/* Images */}
        <div>
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", aspectRatio: "1", marginBottom: 12 }}>
            <img src={imgs[activeImg]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {imgs.map((img, i) => (
              <div key={i} onClick={() => setActiveImg(i)} style={{
                width: 80, height: 80, borderRadius: "var(--radius-sm)", overflow: "hidden",
                border: `2px solid ${activeImg === i ? "var(--teal)" : "transparent"}`,
                cursor: "pointer", transition: "border-color 0.2s"
              }}>
                <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span className="badge">{item.category}</span>
            <span className="badge">{item.condition}</span>
            <span className="badge">{item.brand}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, marginBottom: 8 }}>{item.title}</h1>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, color: "var(--teal-dark)", marginBottom: 24 }}>{item.price} TND</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[["📏 Size", item.size], ["🏷️ Brand", item.brand], ["✨ Condition", item.condition], ["📍 Location", item.location]].map(([label, val]) => (
              <div key={label} style={{ background: "var(--light-gray)", borderRadius: "var(--radius-sm)", padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "var(--gray)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{val}</div>
              </div>
            ))}
          </div>

          {(!user || user.id !== seller.id) ? (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: 14, background: "linear-gradient(135deg, #ff6b6b, #ee5a24)", opacity: messageSending ? 0.7 : 1 }} onClick={startConversation} disabled={messageSending}>
                  {messageSending ? "⏳ Opening chat..." : "⚡ Buy Now"}
                </button>
              </div>
              <button onClick={() => { setLiked(!liked); liked ? setWishlist(w => w.filter(i => i.id !== item.id)) : setWishlist(w => [...w, item]); }} style={{
                width: "100%", padding: 12, border: `2px solid ${liked ? "var(--coral)" : "var(--border)"}`,
                borderRadius: 50, background: liked ? "#fff0f0" : "white",
                color: liked ? "var(--coral)" : "var(--gray)",
                fontWeight: 600, fontSize: 15, marginBottom: 24, transition: "all 0.2s"
              }}>
                {liked ? "❤️ Saved to Wishlist" : "🤍 Save to Wishlist"}
              </button>
              <button className="btn-secondary" style={{ width: "100%", padding: 12, marginBottom: 32, justifyContent: "center", display: "flex", gap: 8, opacity: messageSending ? 0.6 : 1, cursor: messageSending ? "not-allowed" : "pointer" }} onClick={startConversation} disabled={messageSending}>
                {messageSending ? "⏳ Opening chat..." : "💬 Message Seller"}
              </button>
            </>
          ) : (
            <div style={{ background: "#fff3cd", border: "2px solid #ffc107", padding: "16px", borderRadius: "12px", textAlign: "center", marginBottom: 32, fontWeight: "600", color: "#856404", fontSize: 15 }}>
              ⚠️ This is your listing.
            </div>
          )}

          {/* Report Button */}
          <button style={{ width: "100%", padding: 12, marginBottom: 32, justifyContent: "center", display: "flex", gap: 8, background: "#fff", color: "#dc2626", border: "2px solid #fecaca", borderRadius: 50, fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all 0.2s", opacity: reportSubmitting ? 0.6 : 1 }} onClick={() => setShowReportModal(true)} disabled={reportSubmitting}>
            🚩 Report this Listing
          </button>

          {/* Report Modal */}
          {showReportModal && (
            <div style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 20
            }}>
              <div style={{
                background: "white", borderRadius: "var(--radius)", padding: 32, maxWidth: 500, width: "100%",
                boxShadow: "var(--shadow-lg)", animation: "fadeIn 0.3s ease"
              }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  🚩 Report Listing
                </h2>
                <p style={{ color: "var(--gray)", marginBottom: 20, fontSize: 14 }}>
                  Please tell us why you're reporting this listing. This helps us maintain a safe marketplace.
                </p>
                <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Describe the issue (e.g., inappropriate content, scam, etc.)" style={{
                  width: "100%", height: 120, padding: 12, border: "2px solid var(--border)", borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-body)", fontSize: 14, resize: "vertical", marginBottom: 20, outline: "none"
                }} />
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => { setShowReportModal(false); setReportReason(""); }} style={{
                    flex: 1, padding: 12, border: "2px solid var(--border)", borderRadius: 50,
                    background: "white", color: "var(--gray)", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                  }}>
                    Cancel
                  </button>
                  <button onClick={async () => {
                    setReportSubmitting(true);
                    try {
                      await api.createReport({
                        type: "LISTING",
                        targetId: item.id,
                        reason: reportReason.trim()
                      });
                      alert("✅ Report submitted successfully! Thank you for helping keep our community safe.");
                      setShowReportModal(false);
                      setReportReason("");
                    } catch (err) {
                      console.error("Report error:", err);
                      alert(err.message || "Request failed");
                    } finally {
                      setReportSubmitting(false);
                    }
                  }} style={{
                    flex: 1, padding: 12, background: "linear-gradient(135deg, #dc2626, #b91c1c)", color: "white",
                    border: "none", borderRadius: 50, fontWeight: 600, cursor: reportSubmitting ? "not-allowed" : "pointer",
                    transition: "all 0.2s", opacity: reportSubmitting ? 0.7 : 1
                  }} disabled={reportSubmitting}>
                    {reportSubmitting ? "⏳ Reporting..." : "Submit Report"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Seller */}
          <div style={{ background: "var(--light-gray)", borderRadius: "var(--radius)", padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar src={seller.avatar} size={56} alt={`${seller.name} avatar`} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{seller.name}</div>
              <div style={{ color: "var(--gray)", fontSize: 13 }}>⭐ {seller.rating} · {seller.sales} sales · {seller.location}</div>
            </div>
            <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => { setSelectedSeller(seller); setPage("seller"); }}>View Profile</button>
          </div>
        </div>
      </div>

      {/* Similar Items - Coming from Backend */}
      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 24 }}>You May Also Like</h2>
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--gray)" }}>
          <p>Similar items will load from backend</p>
        </div>
      </div>
    </div>
  );
}

function SellPage({ setPage, language }) {
  const { user, setListings } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", category: "", brand: "", size: "", condition: "", price: "", description: "", imageUrl: "", location: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[language];

  const update = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (fieldErrors[k]) setFieldErrors(errs => ({ ...errs, [k]: undefined }));
  };

  const handleNextStep = () => {
    if (step === 2) {
      const errors = {};
      if (!form.title?.trim()) errors.title = "Title is required";
      if (!form.category) errors.category = "Category is required";
      if (!form.description?.trim()) errors.description = "Description is required";

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
    }
    if (step === 3) {
      const errors = {};
      if (!form.price || parseFloat(form.price) <= 0) errors.price = "Price must be a positive number";
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
    }
    
    setFieldErrors({});
    setStep(s => s + 1);
  };

  const handlePublish = async () => {
    setError("");
    setLoading(true);
    try {
      // For now, store the first image URL if available, or use a placeholder
      const listingData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        brand: form.brand || "N/A",
        size: form.size || "N/A",
        condition: form.condition || "New",
        location: form.location || "Tunis",
        imageUrl: form.imageUrl || "https://via.placeholder.com/500x500?text=" + encodeURIComponent(form.title || "Item"),
        status: "ACTIVE"
      };

      const result = await api.createListing(listingData);
      
      if (result?.id) {
        // Refresh listings
        const allListings = await api.fetchListings();
        setListings(Array.isArray(allListings) ? allListings : []);
        
        alert("✅ Listing published successfully!");
        setPage("profile");
      }
    } catch (err) {
      setError(err.message || "Failed to publish listing. Please try again.");
      console.error("Publish error:", err);
    } finally {
      setLoading(false);
    }
  };

  const steps = ["📸 " + t.addPhotos, "📝 " + t.itemDetails, "💰 " + t.setPrice, "✅ " + t.reviewPublish];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <h1 className="page-header">{t.listItem}</h1>
      <p style={{ color: "var(--grey)", marginBottom: 32 }}>{t.turnUnused}</p>

      {error && <div style={{ background: "#7232c5", border: "1px solid var(--coral)", color: "var(--coral)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: 14, fontWeight: 500 }}>{error}</div>}

      {/* Steps */}
      <div style={{ display: "flex", gap: 0, marginBottom: 40 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", margin: "0 auto 6px",
              background: step > i + 1 ? "var(--teal)" : step === i + 1 ? "var(--teal)" : "var(--border)",
              color: step >= i + 1 ? "white" : "var(--gray)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14, transition: "all 0.3s"
            }}>{step > i + 1 ? "✓" : i + 1}</div>
            <div style={{ fontSize: 12, color: step === i + 1 ? "var(--teal)" : "var(--gray)", fontWeight: step === i + 1 ? 600 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: "var(--radius)", padding: 40, boxShadow: "var(--shadow)" }}>
        {step === 1 && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Add Photos</h2>
            <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius)", padding: "24px", textAlign: "center", background: "var(--light-gray)" }}>
              <label htmlFor="sell-image-url" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 8 }}>📸 Image URL</label>
              <input 
                id="sell-image-url"
                className="input-field"
                type="url"
                placeholder="Paste image URL (e.g., https://images.unsplash.com/...)"
                value={form.imageUrl}
                onChange={e => update("imageUrl", e.target.value)}
                style={{ marginBottom: 8 }}
              />
              {form.imageUrl && (
                <div style={{ marginTop: 16 }}>
                  <img src={form.imageUrl} style={{ maxWidth: "100%", maxHeight: 200, borderRadius: "var(--radius-sm)", objectFit: "cover" }} alt="Preview" onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=Invalid+URL"; }} />
                </div>
              )}
            </div>
            <p style={{ color: "var(--gray)", fontSize: 13, marginTop: 16 }}>💡 Tip: Good lighting and multiple angles get 3x more views!</p>
          </div>
        )}
        {step === 2 && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Item Details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[["Title", "title", "e.g. Zara Blue Linen Blouse"], ["Brand", "brand", "e.g. Zara, H&M, Nike..."], ["Location", "location", "e.g. Tunis"]].map(([label, key, ph]) => (
                <div key={key}>
                  <label htmlFor={`sell-${key}`} style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                  <input id={`sell-${key}`} className="input-field" placeholder={ph} value={form[key]} onChange={e => update(key, e.target.value)} />
                  {fieldErrors[key] && <div style={{ color: "var(--coral)", fontSize: 12, marginTop: 4 }}>{fieldErrors[key]}</div>}
                </div>
              ))}
              {[["Category", "category", CATEGORIES.slice(1)], ["Condition", "condition", CONDITIONS], ["Size", "size", SIZES]].map(([label, key, opts]) => (
                <div key={key}>
                  <label htmlFor={`sell-${key}`} style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                  <select id={`sell-${key}`} className="input-field" value={form[key]} onChange={e => update(key, e.target.value)}>
                    <option value="">Select {label.toLowerCase()}</option>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                  {fieldErrors[key] && <div style={{ color: "var(--coral)", fontSize: 12, marginTop: 4 }}>{fieldErrors[key]}</div>}
                </div>
              ))}
              <div>
                <label htmlFor="sell-description" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
                <textarea id="sell-description" className="input-field" rows={4} placeholder="Describe any details, measurements, or flaws…" value={form.description} onChange={e => update("description", e.target.value)} style={{ resize: "vertical" }} />
                {fieldErrors.description && <div style={{ color: "var(--coral)", fontSize: 12, marginTop: 4 }}>{fieldErrors.description}</div>}
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Set Your Price</h2>
            <div style={{ position: "relative", marginBottom: 24 }}>
              <input className="input-field" type="number" placeholder="0" value={form.price} onChange={e => update("price", e.target.value)} style={{ paddingRight: 60, fontSize: 24, fontWeight: 700, height: 64 }} />
              <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 18, fontWeight: 700, color: "var(--gray)" }}>TND</span>
            </div>
            {fieldErrors.price && <div style={{ color: "var(--coral)", fontSize: 14, marginTop: -16, marginBottom: 16 }}>{fieldErrors.price}</div>}
            
            <div style={{ background: "var(--teal-light)", borderRadius: "var(--radius-sm)", padding: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>💡 Pricing Estimate</div>
              {[["Your earnings (after 5% fee)", `${form.price ? Math.round(form.price * 0.95) : "—"} TND`], ["Buyer pays", `${form.price ? Number(form.price) : "—"} TND`]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                  <span style={{ color: "var(--gray)" }}>{l}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Review & Publish</h2>
            <div style={{ background: "var(--light-gray)", borderRadius: "var(--radius-sm)", padding: 20, marginBottom: 24 }}>
              {Object.entries(form).filter(([k, v]) => v && k !== "images").map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: "var(--gray)", textTransform: "capitalize" }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}{k === "price" ? " TND" : ""}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16, justifyContent: "center", opacity: loading ? 0.6 : 1 }} onClick={handlePublish} disabled={loading}>
              {loading ? "Publishing..." : "🚀 Publish Listing"}
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          {step > 1 && <button className="btn-secondary" style={{ flex: 1, padding: 14 }} onClick={() => setStep(s => s - 1)} disabled={loading}>← Back</button>}
          {step < 4 && <button className="btn-primary" style={{ flex: 1, padding: 14, justifyContent: "center" }} onClick={handleNextStep} disabled={loading}>Continue →</button>}
        </div>
      </div>
    </div>
  );
}

function WishlistPage({ setPage, setSelectedItem, language }) {
  const t = TRANSLATIONS[language];
  const { wishlist, setWishlist } = useApp();
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">My Wishlist</h1>
      <p style={{ color: "var(--gray)", marginBottom: 32 }}>{wishlist.length} saved items</p>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🤍</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>No saved items yet</h2>
          <p style={{ color: "var(--gray)", marginBottom: 24 }}>Tap the heart icon on items you love</p>
          <button className="btn-primary" onClick={() => setPage("browse")}>Discover Items</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {wishlist.map(item => <ItemCard key={item.id} item={item} onClick={() => { setSelectedItem(item); setPage("item"); }} />)}
        </div>
      )}
    </div>
  );
}


// ✅ MessagesPage is now imported from MessagesPage.jsx

function ProfilePage({ setPage, setSelectedItem, setUser, language, listings = [] }) {
  const t = TRANSLATIONS[language];
  const { user } = useApp();
  const [tab, setTab] = useState("listings");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.location || "",
    imageUrl: user?.avatar || ""
  });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  // ✅ FIXED: Filter listings to only show current user's listings
  const userItems = user && user.id ? listings.filter(l => l.owner?.id === user.id || l.seller?.id === user.id) : [];
  const u = user || { name: "User", avatar: null, rating: 0, sales: 0, location: "Tunisia", bio: "User profile", followers: 0, following: 0 };

  const handleEditProfile = async () => {
    setEditError("");
    setEditLoading(true);
    try {
      if (!user?.id) throw new Error("User not found");
      const response = await api.updateProfile(user.id, editForm);
      if (response?.id) {
        // Update user in context and localStorage
        const updatedUser = {
          ...user,
          name: editForm.fullName,
          email: editForm.email,
          phone: editForm.phone,
          location: editForm.city,
          avatar: editForm.imageUrl
        };
        setUser(updatedUser);
        localStorage.setItem('swaptn_user', JSON.stringify(updatedUser));
        setEditMode(false);
        alert("✅ Profile updated successfully!");
      }
    } catch (err) {
      setEditError(err.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      {/* Profile Header */}
      <div className="card" style={{ padding: 40, marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Avatar src={u.avatar} size={100} alt={`${u.name} avatar`} style={{ border: "4px solid var(--teal)" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, background: "var(--teal)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ color: "white", fontSize: 12 }}>✏️</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{u.name}</h1>
            <p style={{ color: "var(--gray)", marginBottom: 16 }}>{u.bio}</p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[["⭐", u.rating, "Rating"], ["🛍️", u.sales, "Sales"], ["👥", u.followers, "Followers"], ["📍", u.location, ""]].map(([icon, val, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{icon} {val}</div>
                  {label && <div style={{ fontSize: 12, color: "var(--gray)" }}>{label}</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-primary" style={{ padding: "10px 24px" }} onClick={() => setPage("sell")}>+ List Item</button>
            <button className="btn-secondary" style={{ padding: "10px 24px" }} onClick={() => {
              setEditForm({
                fullName: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                city: user?.location || "",
                imageUrl: user?.avatar || ""
              });
              setEditMode(true);
            }}>Edit Profile</button>
            <button className="btn-secondary" style={{ padding: "10px 24px", color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => { setUser(null); localStorage.removeItem('swaptn_user'); localStorage.removeItem('swaptn_remember_session'); api.logout(); setPage("home"); }}>Sign Out</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "white", borderRadius: "var(--radius)", padding: 6, boxShadow: "var(--shadow)" }}>
        {[["listings", "🏷️ My Listings"], ["sold", "✅ Sold"], ["reviews", "⭐ Reviews"], ["orders", "📦 Orders"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "10px 16px", borderRadius: "var(--radius-sm)",
            background: tab === key ? "var(--teal)" : "none",
            color: tab === key ? "white" : "var(--gray)",
            border: "none", fontWeight: 600, fontSize: 14, transition: "all 0.2s"
          }}>{label}</button>
        ))}
      </div>

      {tab === "listings" && (
        userItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
            <p>Your listings will appear here once you post them</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {userItems.map(item => <ItemCard key={item.id} item={item} onClick={() => { setSelectedItem(item); setPage("item"); }} />)}
          </div>
        )
      )}
      {tab === "sold" && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
          <p>Sold items will appear here</p>
        </div>
      )}
      {tab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.3s ease" }}>
          {[{ user: "mouldi_h", avatar: null, rating: 5, text: "Amazing seller! Item was exactly as described. Fast shipping too! 🌟", item: "Zara Floral Dress" }, { user: "ahmed_k", avatar: null, rating: 5, text: "Very fast and professional. Would buy again!", item: "H&M Hoodie" }].map((r, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <Avatar src={r.avatar} size={44} alt={`${r.user} avatar`} />
                <div>
                  <div style={{ fontWeight: 700 }}>{r.user}</div>
                  <div style={{ color: "var(--gold)" }}>{"⭐".repeat(r.rating)}</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--gray)" }}>Re: {r.item}</span>
              </div>
              <p style={{ color: "var(--dark)", fontSize: 15 }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
      {tab === "orders" && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
          <p>Your orders will appear here</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editMode && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div className="card" style={{ width: "100%", maxWidth: 500, padding: 32, animation: "fadeIn 0.3s ease" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Edit Profile</h2>
            
            {editError && <div style={{ background: "#fff0f0", border: "1px solid var(--coral)", color: "var(--coral)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: 14 }}>{editError}</div>}
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[["Full Name", "fullName"], ["Email", "email"], ["Phone", "phone"], ["City", "city"], ["Avatar URL", "imageUrl"]].map(([label, key]) => (
                <div key={key}>
                  <label htmlFor={`profile-${key}`} style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                  <input 
                    id={`profile-${key}`}
                    className="input-field" 
                    placeholder={label}
                    value={editForm[key]}
                    onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    disabled={editLoading}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="btn-secondary" style={{ flex: 1, padding: 12 }} onClick={() => setEditMode(false)} disabled={editLoading}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, padding: 12, justifyContent: "center" }} onClick={handleEditProfile} disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SellerPage({ setPage, sellerData, language }) {
  const t = TRANSLATIONS[language];
  const { user } = useApp();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const seller = sellerData || { name: "Seller", avatar: null, bio: "Seller profile", rating: 4.5, sales: 0, followers: 0, location: "Tunisia" };
  const items = [];
  const canReportSeller = Boolean(seller?.id) && (!user || Number(user.id) !== Number(seller.id));

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("item")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24 }}>← Back</button>
      <div className="card" style={{ padding: 40, marginBottom: 32, background: "linear-gradient(135deg, var(--teal-light), white)" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar src={seller.avatar} size={90} alt={`${seller.name} avatar`} style={{ border: "3px solid var(--teal)" }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900 }}>{seller.name}</h1>
            <p style={{ color: "var(--gray)", margin: "6px 0 12px" }}>{seller.bio}</p>
            <div style={{ display: "flex", gap: 20 }}>
              {[["⭐ " + seller.rating, "Rating"], [seller.sales + " items sold", ""], [seller.followers + " followers", ""]].map(([val, label]) => (
                <span key={val} style={{ fontSize: 14, fontWeight: 600, color: "var(--teal-dark)" }}>{val}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={() => setPage("messages")}>💬 Message</button>
          </div>
        </div>

        {canReportSeller && (
          <div style={{ marginTop: 18 }}>
            <button
              style={{
                width: "100%",
                padding: 12,
                justifyContent: "center",
                display: "flex",
                gap: 8,
                background: "#fff",
                color: "#dc2626",
                border: "2px solid #fecaca",
                borderRadius: 50,
                fontWeight: 600,
                fontSize: 15,
                cursor: reportSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: reportSubmitting ? 0.6 : 1
              }}
              onClick={() => setShowReportModal(true)}
              disabled={reportSubmitting}
            >
              🚩 Report this Profile
            </button>
          </div>
        )}
      </div>

      {showReportModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 20
        }}>
          <div style={{
            background: "white", borderRadius: "var(--radius)", padding: 32, maxWidth: 500, width: "100%",
            boxShadow: "var(--shadow-lg)", animation: "fadeIn 0.3s ease"
          }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              🚩 Report Profile
            </h2>
            <p style={{ color: "var(--gray)", marginBottom: 20, fontSize: 14 }}>
              Tell us why this profile should be reviewed by our moderation team.
            </p>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe the issue (e.g., fake profile, abusive behavior, scam attempts...)"
              style={{
                width: "100%", height: 120, padding: 12, border: "2px solid var(--border)", borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-body)", fontSize: 14, resize: "vertical", marginBottom: 20, outline: "none"
              }}
            />

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                style={{
                  flex: 1,
                  padding: 12,
                  border: "2px solid var(--border)",
                  borderRadius: 50,
                  background: "white",
                  color: "var(--gray)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setReportSubmitting(true);
                  try {
                    await api.createReport({
                      type: "USER",
                      targetId: seller.id,
                      reason: reportReason.trim()
                    });
                    alert("✅ Profile report submitted successfully.");
                    setShowReportModal(false);
                    setReportReason("");
                  } catch (err) {
                    console.error("Profile report error:", err);
                    alert(err.message || "Request failed");
                  } finally {
                    setReportSubmitting(false);
                  }
                }}
                style={{
                  flex: 1,
                  padding: 12,
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  color: "white",
                  border: "none",
                  borderRadius: 50,
                  fontWeight: 600,
                  cursor: reportSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: reportSubmitting ? 0.7 : 1
                }}
                disabled={reportSubmitting}
              >
                {reportSubmitting ? "⏳ Reporting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, marginBottom: 20 }}>{seller.name.split(" ")[0]}'s Listings (0)</h2>
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
        <p>Seller listings will load from backend</p>
      </div>
    </div>
  );
}

function LoginPage({ setPage, language }) {
  const t = TRANSLATIONS[language];
  const { setUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        const response = await api.login(form.email, form.password);
        if (response?.token) {
          const userData = { 
            id: response.id,
            name: response.fullName,
            email: response.email,
            avatar: response.imageUrl || "",
            role: response.role || "USER",
            rating: 0,
            sales: 0,
            location: "Tunisia",
            bio: "User",
            joined: new Date().getFullYear().toString(),
            followers: 0,
            following: 0
          };
          setUser(userData);
          localStorage.setItem('swaptn_user', JSON.stringify(userData));
          localStorage.removeItem('swaptn_remember_session');
          setPage("home");
        }
      } else {
        // Register
        const response = await api.register(form.name, form.email, form.password);
        if (response?.id) {
          // Auto-login after registration
          const loginResponse = await api.login(form.email, form.password);
          if (loginResponse?.token) {
            const userData = { 
              id: loginResponse.id,
              name: loginResponse.fullName,
              email: loginResponse.email,
              avatar: loginResponse.imageUrl || "",
              role: loginResponse.role || "USER",
              rating: 0,
              sales: 0,
              location: "Tunisia",
              bio: "New seller",
              joined: new Date().getFullYear().toString(),
              followers: 0,
              following: 0
            };
            setUser(userData);
            localStorage.setItem('swaptn_user', JSON.stringify(userData));
            localStorage.removeItem('swaptn_remember_session');
            setPage("home");
          }
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.4s ease" }}>
      <div style={{ position: "absolute", top: 24, left: 24 }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>← Back to Home</button>
      </div>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "white", fontWeight: 900, margin: "0 auto 16px" }}>SW</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900 }}>{isLogin ? "Welcome back!" : "Join SwapTn"}</h1>
          <p style={{ color: "var(--gray)", marginTop: 8 }}>{isLogin ? "Sign in to your account" : "Create your free account"}</p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          {error && <div style={{ background: "#fff0f0", border: "1px solid var(--coral)", color: "var(--coral)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: 14, fontWeight: 500, textAlign: "center" }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!isLogin && (
              <div>
                <label htmlFor="fullname-input" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Full Name</label>
                <input id="fullname-input" className="input-field" placeholder="Yassine Cherif" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={loading} />
              </div>
            )}
            <div>
              <label htmlFor="email-input" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
              <input id="email-input" className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={loading} />
            </div>
            <div>
              <label htmlFor="password-input" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
              <input id="password-input" className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} disabled={loading} />
            </div>
          </div>

          {isLogin && <div style={{ textAlign: "right", marginTop: 8 }}><a href="#" style={{ color: "var(--teal)", fontSize: 13, fontWeight: 500 }}>Forgot password?</a></div>}

          <button className="btn-primary" style={{ width: "100%", marginTop: 24, padding: 14, fontSize: 16, justifyContent: "center", opacity: loading ? 0.6 : 1 }} onClick={handle} disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "var(--gray)", fontSize: 14 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { if (!loading) { setIsLogin(!isLogin); setError(""); setForm({ email: "", password: "", name: "" }); } }} style={{ color: "var(--teal)", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

function NotificationsPage({ language, setPage }) {
  const t = TRANSLATIONS[language];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">Notifications</h1>
      <div className="card" style={{ overflow: "hidden" }}>
        {notifs.map((n, i) => (
          <div key={i} style={{
            display: "flex", gap: 16, padding: 20, alignItems: "center",
            borderBottom: i < notifs.length - 1 ? "1px solid var(--border)" : "none",
            background: n.unread ? "rgba(0,176,155,0.04)" : "white",
            borderLeft: n.unread ? "3px solid var(--teal)" : "3px solid transparent",
            transition: "background 0.2s"
          }}>
            <span style={{ fontSize: 24 }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
              <div style={{ fontSize: 12, color: "var(--gray)", marginTop: 4 }}>{n.time}</div>
            </div>
            {n.unread && <div style={{ width: 8, height: 8, background: "var(--teal)", borderRadius: "50%", flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — SwapTn
   Palette: Cream/Sand base · Forest green accent · Warm charcoal text
   Fonts: Playfair Display (headings) · Instrument Sans (body)
═══════════════════════════════════════════════════════════════ */

const DS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:    #FAF8F3;
    --sand:     #F0EBE0;
    --sand2:    #E5DDD0;
    --green:    #2C5F2E;
    --green-lt: #3D7A40;
    --green-bg: #EDF2ED;
    --charcoal: #1C1C1A;
    --muted:    #7A7468;
    --border:   #DDD8CE;
    --white:    #FFFFFF;
    --danger:   #C0392B;
    --danger-bg:#FDF0EF;
    --success:  #276749;
    --success-bg:#EDF6F1;
    --radius:   10px;
    --radius-lg:16px;
  }

  .swp * { box-sizing: border-box; margin: 0; padding: 0; }

  .swp {
    font-family: 'Instrument Sans', sans-serif;
    background: var(--cream);
    color: var(--charcoal);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Page shell ── */
  .swp-page {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px 28px 80px;
    animation: swp-in 0.35s ease both;
  }
  .swp-page-wide { max-width: 960px; }

  @keyframes swp-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Back button ── */
  .swp-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: 36px;
    letter-spacing: 0.01em;
    transition: color 0.15s;
    font-family: inherit;
  }
  .swp-back:hover { color: var(--green); }
  .swp-back svg { width: 14px; height: 14px; }

  /* ── Page headers ── */
  .swp-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 10px;
  }

  .swp-h1 {
    font-family: 'Playfair Display', serif;
    font-size: 40px;
    font-weight: 700;
    color: var(--charcoal);
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }

  .swp-h1-italic {
    font-style: italic;
    color: var(--green);
  }

  .swp-lead {
    font-size: 15.5px;
    color: var(--muted);
    line-height: 1.65;
    margin-bottom: 40px;
    max-width: 600px;
    font-weight: 300;
  }

  .swp-h2 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--charcoal);
    letter-spacing: -0.015em;
    margin-bottom: 6px;
  }

  /* ── Divider ── */
  .swp-divider {
    height: 1px;
    background: var(--border);
    margin: 32px 0;
  }

  /* ── Cards ── */
  .swp-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px 32px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .swp-card:hover {
    border-color: var(--sand2);
    box-shadow: 0 4px 20px rgba(44,95,46,0.06);
  }

  .swp-card-grid {
    display: grid;
    gap: 16px;
  }

  /* Section header inside card */
  .swp-card-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .swp-card-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--green-bg);
  }

  .swp-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 19px;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 14px;
    line-height: 1.3;
  }

  /* ── Content lines ── */
  .swp-line {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.85;
    padding: 3px 0;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .swp-line-bullet {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
    margin-top: 9px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  /* Numbered steps */
  .swp-step {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid var(--sand);
  }
  .swp-step:last-child { border-bottom: none; }
  .swp-step-num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--green-bg);
    border: 1.5px solid rgba(44,95,46,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--green);
    flex-shrink: 0;
    margin-top: 1px;
  }
  .swp-step-text {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    padding-top: 3px;
  }

  /* ── Buttons ── */
  .swp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 12px 24px;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.01em;
    border: none;
  }

  .swp-btn-primary {
    background: var(--green);
    color: #fff;
  }
  .swp-btn-primary:hover { background: var(--green-lt); }

  .swp-btn-outline {
    background: transparent;
    color: var(--green);
    border: 1.5px solid var(--green);
  }
  .swp-btn-outline:hover { background: var(--green-bg); }

  .swp-btn-ghost {
    background: var(--sand);
    color: var(--charcoal);
  }
  .swp-btn-ghost:hover { background: var(--sand2); }

  .swp-btn-full { width: 100%; }

  .swp-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  /* ── Alert banner ── */
  .swp-banner {
    border-radius: var(--radius);
    padding: 16px 20px;
    margin-bottom: 24px;
    font-size: 14px;
    font-weight: 500;
  }
  .swp-banner-success {
    background: var(--success-bg);
    color: var(--success);
    border: 1px solid rgba(39,103,73,0.2);
  }
  .swp-banner-info {
    background: var(--green-bg);
    color: var(--green);
    border: 1px solid rgba(44,95,46,0.2);
  }

  /* ── CTA block ── */
  .swp-cta {
    background: var(--charcoal);
    border-radius: var(--radius-lg);
    padding: 40px;
    text-align: center;
    margin-top: 40px;
    position: relative;
    overflow: hidden;
  }
  .swp-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(44,95,46,0.25) 0%, transparent 70%);
    pointer-events: none;
  }
  .swp-cta-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-bottom: 10px;
  }
  .swp-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .swp-cta-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.55);
    margin-bottom: 24px;
    font-weight: 300;
  }

  /* ── Pill badges ── */
  .swp-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 11px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  .swp-pill-green { background: var(--green-bg); color: var(--green); }
  .swp-pill-sand  { background: var(--sand);     color: var(--muted); }
  .swp-pill-dark  { background: var(--charcoal); color: #fff; }

  /* ── Form elements ── */
  .swp-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 7px;
    letter-spacing: 0.02em;
  }
  .swp-input, .swp-textarea, .swp-select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-size: 14px;
    font-family: inherit;
    background: var(--white);
    color: var(--charcoal);
    transition: border-color 0.15s;
    outline: none;
  }
  .swp-input:focus, .swp-textarea:focus, .swp-select:focus {
    border-color: var(--green);
  }
  .swp-textarea { min-height: 130px; resize: vertical; line-height: 1.6; }

  /* ── Feature icon item ── */
  .swp-feature {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 14px 0;
    border-bottom: 1px solid var(--sand);
  }
  .swp-feature:last-child { border-bottom: none; }
  .swp-feature-icon {
    width: 38px;
    height: 38px;
    border-radius: 9px;
    background: var(--green-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .swp-feature-icon svg { width: 17px; height: 17px; color: var(--green); }
  .swp-feature-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 3px;
  }
  .swp-feature-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
  }

  /* ── Press mention ── */
  .swp-mention {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color 0.15s;
  }
  .swp-mention:hover { border-color: var(--sand2); }

  /* ── Job card ── */
  .swp-job {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 24px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .swp-job:hover {
    border-color: var(--green);
    box-shadow: 0 2px 12px rgba(44,95,46,0.08);
  }
  .swp-job-title { font-size: 15px; font-weight: 600; color: var(--charcoal); margin-bottom: 4px; }
  .swp-job-meta  { font-size: 12.5px; color: var(--muted); }

  /* ── Blog card ── */
  .swp-blog-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px 32px;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .swp-blog-card:hover {
    border-color: var(--green);
    box-shadow: 0 4px 20px rgba(44,95,46,0.07);
  }
  .swp-blog-date {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .swp-blog-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--charcoal);
    line-height: 1.3;
    margin-bottom: 10px;
    transition: color 0.15s;
  }
  .swp-blog-card:hover .swp-blog-title { color: var(--green); }
  .swp-blog-excerpt { font-size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 16px; }
  .swp-blog-read { font-size: 13px; font-weight: 600; color: var(--green); display: flex; align-items: center; gap: 5px; }

  /* ── Contact row ── */
  .swp-contact-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 0;
    border-bottom: 1px solid var(--sand);
  }
  .swp-contact-row:last-child { border-bottom: none; }
  .swp-contact-icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: var(--green-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .swp-contact-icon svg { width: 15px; height: 15px; color: var(--green); }
  .swp-contact-title { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
  .swp-contact-value { font-size: 14.5px; font-weight: 500; color: var(--charcoal); }
  .swp-contact-note { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* ── Pricing formula card ── */
  .swp-formula {
    background: var(--charcoal);
    border-radius: var(--radius);
    padding: 20px 24px;
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    color: #fff;
    text-align: center;
    letter-spacing: -0.01em;
    margin: 16px 0;
  }
  .swp-formula em { color: rgba(255,255,255,0.55); font-style: normal; font-size: 13px; display: block; margin-top: 6px; font-family: 'Instrument Sans', sans-serif; }

  /* ── Condition grid ── */
  .swp-condition-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 14px 0;
  }
  .swp-condition-item {
    background: var(--sand);
    border-radius: 8px;
    padding: 12px 10px;
    text-align: center;
  }
  .swp-condition-pct { font-size: 17px; font-weight: 600; color: var(--green); margin-bottom: 3px; }
  .swp-condition-lbl { font-size: 11px; color: var(--muted); font-weight: 500; }

  /* ── Zone table ── */
  .swp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  .swp-table th {
    background: var(--sand);
    padding: 9px 14px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  .swp-table td {
    padding: 11px 14px;
    color: var(--charcoal);
    border-bottom: 1px solid var(--sand);
    vertical-align: middle;
  }
  .swp-table tr:last-child td { border-bottom: none; }
  .swp-table tr:hover td { background: var(--sand); }

  /* Two-col layout */
  .swp-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: 640px) {
    .swp-two-col { grid-template-columns: 1fr; }
    .swp-h1 { font-size: 30px; }
    .swp-condition-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* ── Tiny SVG icons ── */
const Icon = {
  arrow: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2.5 7h9M8 4l3.5 3L8 10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevLeft: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 7l4 4 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1" y="3" width="14" height="10" rx="2"/><path d="M1 5l7 5 7-5"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 2a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V2z" strokeLinecap="round"/>
      <circle cx="8" cy="13" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M14 9a2 2 0 01-2 2H5l-3 3V4a2 2 0 012-2h8a2 2 0 012 2v5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="8" cy="8" r="7"/><path d="M8 4.5V8l2.5 2.5" strokeLinecap="round"/>
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 1a5 5 0 015 5c0 4-5 9-5 9S3 10 3 6a5 5 0 015-5z" strokeLinecap="round"/>
      <circle cx="8" cy="6" r="1.8"/>
    </svg>
  ),
  box: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M14 5L8 2 2 5v6l6 3 6-3V5z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 5l6 3 6-3M8 8v5" strokeLinecap="round"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 1l6 2.5v4C14 11 11 14 8 15c-3-1-6-4-6-7.5V3.5L8 1z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M13 3C7 2 2 7 3 13c5 1 10-2 10-8V3z" strokeLinecap="round"/>
      <path d="M3 13l5-5" strokeLinecap="round"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 1l2.2 4.4L15 6.2l-3.5 3.4.8 4.8L8 12l-4.3 2.4.8-4.8L1 6.2l4.8-.8L8 1z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M9 1H3a2 2 0 00-2 2v6l8 8 7-7-7-9z" strokeLinecap="round"/>
      <circle cx="5" cy="5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="6" cy="5" r="2.5"/><path d="M1 14a5 5 0 0110 0"/>
      <circle cx="12" cy="5" r="2" opacity=".6"/><path d="M14 14a4 4 0 00-4-4" opacity=".6"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="7" width="10" height="8" rx="2"/>
      <path d="M5 7V5a3 3 0 016 0v2" strokeLinecap="round"/>
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 1L1 14h14L8 1z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 7v3M8 12h.01" strokeLinecap="round"/>
    </svg>
  ),
};

/* ══════════════════════════════════════════════════════════════ */

function PageShell({ children, wide = false }) {
  return (
    <>
      <style>{DS}</style>
      <div className="swp">
        <div className={`swp-page${wide ? " swp-page-wide" : ""}`}>
          {children}
        </div>
      </div>
    </>
  );
}

function BackBtn({ onClick }) {
  return (
    <button className="swp-back" onClick={onClick}>
      {Icon.chevLeft} Back
    </button>
  );
}

function CardSection({ label, title, children }) {
  return (
    <div className="swp-card">
      {label && <div className="swp-card-label">{label}</div>}
      {title && <div className="swp-card-title">{title}</div>}
      {children}
    </div>
  );
}

/* ══════════════════════════════ SELLER GUIDE ══════════════════ */
export function SellerGuidePage({ setPage }) {
  const sections = [
    {
      label: "Before You List",
      steps: [
        "Take quality photos in natural lighting from multiple angles",
        "Clean and inspect the item thoroughly",
        "Check for authenticity — ensure brand tags are intact",
        "Gather info: brand, size, material, condition, any defects",
        "Decide your price competitively by checking similar items",
      ],
    },
    {
      label: "Creating the Perfect Listing",
      bullets: [
        "Use clear, accurate titles (e.g., 'Vintage Nike Blue Hoodie Size M')",
        "Write detailed descriptions: condition, fit, measurements",
        "Mention any flaws honestly — buyers appreciate transparency",
        "Use all 8 photo slots — show different angles and details",
        "Include close-ups of brand tags and condition markers",
      ],
    },
    {
      label: "Pricing Strategy",
      bullets: [
        "Price 20–50% below retail depending on condition",
        "Compare similar items that sold recently",
        "Factor in: brand, condition, demand, season",
        "Start slightly higher to allow for negotiation",
        "Bundle items to attract bulk buyers",
      ],
    },
    {
      label: "Communicating with Buyers",
      bullets: [
        "Respond to messages within 24 hours",
        "Be honest about condition and fit",
        "Answer questions about measurements and materials",
        "Be open to negotiation — it builds reputation",
        "Provide tracking information once sold",
      ],
    },
    {
      label: "Efficient Shipping",
      steps: [
        "Weigh item accurately to calculate correct postage",
        "Package securely with padding to prevent damage",
        "Use tracked shipping for high-value items",
        "Take photos of item before packing",
        "Send tracking info to buyer immediately",
        "Pack within 24 hours of sale",
      ],
    },
    {
      label: "Building Your Reputation",
      bullets: [
        "Communicate professionally and promptly",
        "Deliver items in the condition described",
        "Encourage buyer feedback with great service",
        "Handle disputes fairly and professionally",
        "Your rating determines your visibility — maintain quality!",
      ],
    },
  ];

  return (
    <PageShell>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Your complete guide</div>
      <h1 className="swp-h1">Sell with <span className="swp-h1-italic">confidence</span></h1>
      <p className="swp-lead">Everything you need to know about listing, pricing, and shipping your fashion finds on SwapTn.</p>

      <div className="swp-card-grid">
        {sections.map((s, i) => (
          <CardSection key={i} label={s.label}>
            {s.steps
              ? s.steps.map((t, j) => (
                  <div className="swp-step" key={j}>
                    <div className="swp-step-num">{j + 1}</div>
                    <div className="swp-step-text">{t}</div>
                  </div>
                ))
              : s.bullets.map((t, j) => (
                  <div className="swp-line" key={j}>
                    <span className="swp-line-bullet" />
                    {t}
                  </div>
                ))}
          </CardSection>
        ))}
      </div>

      <div className="swp-cta">
        <div className="swp-cta-eyebrow">Ready?</div>
        <div className="swp-cta-title">Start selling today</div>
        <div className="swp-cta-sub">Join thousands of sellers on SwapTn's marketplace</div>
        <button className="swp-btn swp-btn-outline" onClick={() => setPage("sell")}
          style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>
          Create a listing {Icon.arrow}
        </button>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ PRICING TIPS ══════════════════ */
export function PricingTipsPage({ setPage }) {
  const tactics = [
    "Use psychological pricing (99, 199, 299) for better conversion",
    "Offer 'Make an Offer' to encourage negotiations",
    "Price hot items higher initially — test the market",
    "Gradually reduce difficult-to-sell items every 2 weeks",
    "Monitor competitor pricing weekly",
  ];

  const mistakes = [
    "Overpricing compared to similar items",
    "Underpricing and losing profit potential",
    "Not factoring shipping costs into your margin",
    "Ignoring seasonal market demand",
    "Using round numbers (129 TND converts better than 130 TND)",
  ];

  return (
    <PageShell>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Maximize your earnings</div>
      <h1 className="swp-h1">Pricing <span className="swp-h1-italic">mastery</span></h1>
      <p className="swp-lead">Science-backed strategies to price your items for faster sales and higher earnings.</p>

      <div className="swp-card-grid">
        {/* Formula */}
        <CardSection label="The Pricing Formula">
          <div className="swp-formula">
            Retail Price × (1 − Depreciation Factor)
            <em>Use condition to determine the depreciation factor below</em>
          </div>
          <div className="swp-condition-grid">
            {[["80–90%", "Excellent"], ["60–80%", "Good"], ["40–60%", "Fair"], ["20–40%", "Poor"]].map(([pct, lbl]) => (
              <div className="swp-condition-item" key={lbl}>
                <div className="swp-condition-pct">{pct}</div>
                <div className="swp-condition-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </CardSection>

        {/* Competitive */}
        <CardSection label="Competitive Pricing">
          {[
            "Search similar items and note their prices",
            "Price 5–10% lower to sell faster",
            "Price 5–10% higher if your condition is better",
            "Aim for middle ground unless your item is unique",
          ].map((t, i) => (
            <div className="swp-line" key={i}><span className="swp-line-bullet" />{t}</div>
          ))}
        </CardSection>

        {/* Designer */}
        <CardSection label="Designer &amp; Premium Brands">
          {[
            "Designer items hold value better — retain 50–70% of retail",
            "Limited editions can command above-market prices",
            "Collaborations are especially sought-after — research comps",
            "Always verify and document authenticity clearly",
          ].map((t, i) => (
            <div className="swp-line" key={i}><span className="swp-line-bullet" />{t}</div>
          ))}
        </CardSection>

        {/* Seasonal */}
        <CardSection label="Seasonal Pricing">
          {[
            "Winter coats → price higher in fall/winter, lower in spring",
            "Summer dresses → list in late spring for peak demand",
            "Off-season items should be priced lower to move inventory faster",
            "Track trends — fashion cycles affect resale value",
          ].map((t, i) => (
            <div className="swp-line" key={i}><span className="swp-line-bullet" />{t}</div>
          ))}
        </CardSection>

        {/* Time strategy */}
        <CardSection label="Pricing Over Time">
          {[
            ["Week 1", "Start slightly high — room to negotiate"],
            ["Week 2–3", "Lower by 5–10% if no interested buyers"],
            ["Week 4+", "Further reduction or bundle with another item"],
          ].map(([t, d]) => (
            <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--sand)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--green)" }}>{t}</span>
              <span style={{ fontSize: 13, color: "var(--muted)", textAlign: "right", maxWidth: "65%" }}>{d}</span>
            </div>
          ))}
        </CardSection>

        {/* Tactics + Mistakes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <CardSection label="Winning Tactics">
            {tactics.map((t, i) => (
              <div className="swp-line" key={i}><span className="swp-line-bullet" />{t}</div>
            ))}
          </CardSection>
          <div className="swp-card" style={{ borderColor: "rgba(192,57,43,0.2)", background: "#FFF8F8" }}>
            <div className="swp-card-label" style={{ color: "var(--danger)" }}>Mistakes to Avoid</div>
            {mistakes.map((t, i) => (
              <div className="swp-line" key={i} style={{ color: "var(--muted)" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--danger)", marginTop: 9, flexShrink: 0, opacity: 0.6 }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ SHIPPING ══════════════════════ */
export function ShippingPage({ setPage }) {
  return (
    <PageShell wide>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Delivery across Tunisia</div>
      <h1 className="swp-h1">Shipping <span className="swp-h1-italic">information</span></h1>
      <p className="swp-lead">Fast, tracked, and insured delivery options for every order on SwapTn.</p>

      {/* Options */}
      <CardSection label="Shipping Options">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 4 }}>
          {[
            { name: "Standard", days: "5–7 days", note: "Within Tunisia", price: "7–15 TND" },
            { name: "Express",  days: "2–3 days", note: "Major cities",  price: "15–25 TND" },
            { name: "Pickup",   days: "Same day", note: "Tunis area",    price: "Free" },
          ].map((o) => (
            <div key={o.name} style={{ background: "var(--sand)", borderRadius: 10, padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{o.name}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "var(--charcoal)", marginBottom: 3 }}>{o.days}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>{o.note}</div>
              <div className="swp-pill swp-pill-green" style={{ display: "inline-flex" }}>{o.price}</div>
            </div>
          ))}
        </div>
      </CardSection>

      {/* Cost table */}
      <CardSection label="Cost by Weight">
        <table className="swp-table">
          <thead><tr><th>Weight</th><th>Standard</th><th>Express</th></tr></thead>
          <tbody>
            {[
              ["Under 500g",  "5–7 TND",   "12–15 TND"],
              ["500g – 1kg",  "8–12 TND",  "15–18 TND"],
              ["1kg – 2kg",   "12–18 TND", "20–25 TND"],
              ["Over 2kg",    "Quote",     "Quote"],
            ].map(([w, s, e]) => (
              <tr key={w}><td style={{ fontWeight: 500 }}>{w}</td><td>{s}</td><td>{e}</td></tr>
            ))}
          </tbody>
        </table>
      </CardSection>

      {/* Zones + Process */}
      <div className="swp-two-col">
        <CardSection label="Delivery Zones">
          {[
            ["Zone 1 — Tunis & Ariana", "All options available"],
            ["Zone 2 — Sfax, Sousse, Monastir", "Standard & Express"],
            ["Zone 3 — All other cities", "Standard only"],
            ["Rural areas", "+2–3 extra days"],
          ].map(([zone, avail]) => (
            <div key={zone} style={{ display: "flex", flexDirection: "column", gap: 2, padding: "10px 0", borderBottom: "1px solid var(--sand)" }}>
              <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--charcoal)" }}>{zone}</span>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{avail}</span>
            </div>
          ))}
        </CardSection>

        <CardSection label="Shipping Process">
          {[
            "Item sold → buyer receives shipping notification",
            "Seller has 24 hours to prepare and drop off item",
            "Shipping partner picks up the package",
            "Tracking number sent to buyer automatically",
            "Real-time tracking updates available",
            "Delivery confirmation sent to both parties",
          ].map((t, i) => (
            <div className="swp-step" key={i}>
              <div className="swp-step-num">{i + 1}</div>
              <div className="swp-step-text">{t}</div>
            </div>
          ))}
        </CardSection>
      </div>

      {/* Protection */}
      <CardSection label="Shipping Protection">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            "All items insured during transit",
            "Package damage covered up to 500 TND",
            "Loss covered up to full item value",
            "Free reshipping if item arrives damaged",
            "30-day return if item arrives damaged",
            "24/7 claims support",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 0" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, color: "var(--green)" }}>
                {Icon.check}
              </div>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{t}</span>
            </div>
          ))}
        </div>
      </CardSection>
    </PageShell>
  );
}

/* ══════════════════════════════ ABOUT US ══════════════════════ */
export function AboutUsPage({ setPage }) {
  const whys = [
    { icon: Icon.leaf,   title: "Sustainable",  desc: "Reduce fashion waste and promote a circular economy" },
    { icon: Icon.tag,    title: "Affordable",   desc: "Access quality brands at a fraction of retail price" },
    { icon: Icon.check,  title: "Authentic",    desc: "Verified sellers and genuine items guaranteed" },
    { icon: Icon.shield, title: "Secure",       desc: "Buyer protection and safe transactions always" },
    { icon: Icon.users,  title: "Community",    desc: "Join thousands of fashion lovers nationwide" },
    { icon: Icon.star,   title: "Empowering",   desc: "Earn real money selling your unwanted clothes" },
  ];

  return (
    <PageShell>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Tunisia's fashion marketplace</div>
      <h1 className="swp-h1">About <span className="swp-h1-italic">SwapTn</span></h1>
      <p className="swp-lead">We believe every garment deserves a second chapter — and every Tunisian deserves access to great style.</p>

      <div className="swp-card-grid">
        <CardSection label="Our Mission">
          <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.8 }}>
            SwapTn is Tunisia's leading marketplace for pre-loved fashion. We give clothes a second life, make sustainable fashion accessible to everyone, and create real economic opportunities for sellers across every governorate.
          </p>
        </CardSection>

        <CardSection label="Our Story">
          <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.8 }}>
            Founded in 2023, SwapTn started as a simple idea: connect style-conscious Tunisians who want to buy and sell pre-owned fashion. What began as a passion project has grown into a community of over <strong style={{ color: "var(--charcoal)" }}>50,000 active users</strong> buying and selling authentic clothes, shoes, and accessories across Tunisia.
          </p>
        </CardSection>

        <CardSection label="Why SwapTn?">
          {whys.map((w, i) => (
            <div className="swp-feature" key={i}>
              <div className="swp-feature-icon">{w.icon}</div>
              <div>
                <div className="swp-feature-title">{w.title}</div>
                <div className="swp-feature-desc">{w.desc}</div>
              </div>
            </div>
          ))}
        </CardSection>

        <CardSection label="Values We Live By">
          {[
            ["Transparency", "Honest descriptions, no hidden fees, clear communication"],
            ["Trust", "Every transaction is secure and protected"],
            ["Quality", "We verify authenticity and ensure satisfaction in every dispute"],
            ["Sustainability", "Every sale keeps clothes out of landfills"],
            ["Inclusivity", "Accessible to everyone, from all backgrounds and budgets"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--sand)" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--charcoal)", minWidth: 110 }}>{k}</span>
              <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{v}</span>
            </div>
          ))}
        </CardSection>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ BLOG ══════════════════════════ */
export function BlogPage({ setPage }) {
  const posts = [
    { title: "How to Spot Counterfeit Luxury Brands", date: "28 March 2025", excerpt: "Learn the telltale signs of fake designer items and how to verify authenticity before you buy." },
    { title: "Sustainable Fashion: Your Guide to Pre-Loved Shopping", date: "20 March 2025", excerpt: "Discover how buying pre-owned fashion reduces waste and helps the environment in measurable ways." },
    { title: "10 Hidden Gems Under 50 TND Worth Adding to Your Wardrobe", date: "15 March 2025", excerpt: "Uncover amazing fashion finds that won't break the bank on SwapTn — curated picks this week." },
    { title: "The Psychology of Pricing: Why Your Items Sell Better at 99 TND", date: "10 March 2025", excerpt: "Understanding buyer behavior to optimize your listings and increase conversion rates." },
  ];

  return (
    <PageShell>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Stories & insights</div>
      <h1 className="swp-h1">The SwapTn <span className="swp-h1-italic">Journal</span></h1>
      <p className="swp-lead">Fashion tips, marketplace insights, and sustainability stories from our community.</p>

      <div className="swp-card-grid">
        {posts.map((p, i) => (
          <div className="swp-blog-card" key={i}>
            <div className="swp-blog-date">{p.date}</div>
            <div className="swp-blog-title">{p.title}</div>
            <div className="swp-blog-excerpt">{p.excerpt}</div>
            <div className="swp-blog-read">Read article {Icon.arrow}</div>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="swp-cta">
        <div className="swp-cta-eyebrow">Stay in the loop</div>
        <div className="swp-cta-title">Weekly fashion & marketplace news</div>
        <div className="swp-cta-sub">Join 8,000+ subscribers getting the best of SwapTn</div>
        <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
          <input className="swp-input" placeholder="your@email.com" style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "#fff" }} />
          <button className="swp-btn swp-btn-primary" style={{ background: "var(--green-lt)", whiteSpace: "nowrap" }}>Subscribe</button>
        </div>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ CAREERS ═══════════════════════ */
export function CareersPage({ setPage }) {
  const jobs = [
    { title: "Product Manager",             location: "Tunis",  type: "Full-time" },
    { title: "Senior Full Stack Developer", location: "Remote", type: "Full-time" },
    { title: "Customer Support Specialist", location: "Tunis",  type: "Full-time" },
    { title: "Marketing Manager",           location: "Tunis",  type: "Full-time" },
    { title: "Operations Coordinator",      location: "Tunis",  type: "Part-time" },
  ];

  const perks = [
    "Competitive salary & benefits",
    "Remote work opportunities",
    "Professional development",
    "Collaborative, flat culture",
    "Real impact on sustainability",
    "Creative freedom",
  ];

  return (
    <PageShell>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Join the team</div>
      <h1 className="swp-h1">Build the future of <span className="swp-h1-italic">fashion</span></h1>
      <p className="swp-lead">We're a small, ambitious team on a mission to make sustainable fashion the default in Tunisia. Come work with us.</p>

      {/* Perks */}
      <CardSection label="Why Join SwapTn?">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {perks.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>{Icon.check}</div>
              <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{p}</span>
            </div>
          ))}
        </div>
      </CardSection>

      <div className="swp-h2" style={{ marginTop: 36, marginBottom: 16 }}>Open Positions</div>
      <div className="swp-card-grid">
        {jobs.map((j, i) => (
          <div className="swp-job" key={i}>
            <div>
              <div className="swp-job-title">{j.title}</div>
              <div className="swp-job-meta">
                <span className="swp-pill swp-pill-sand" style={{ marginRight: 6 }}>{Icon.pin} {j.location}</span>
                <span className="swp-pill swp-pill-green">{j.type}</span>
              </div>
            </div>
            <button className="swp-btn swp-btn-outline" style={{ flexShrink: 0, padding: "8px 18px" }}>Apply {Icon.arrow}</button>
          </div>
        ))}
      </div>

      <div className="swp-card" style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Don't see your role?</div>
          <div style={{ fontSize: 13.5, color: "var(--muted)" }}>Send your resume to <strong style={{ color: "var(--green)" }}>careers@swaptn.tn</strong></div>
        </div>
        <button className="swp-btn swp-btn-ghost">Send spontaneous application</button>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ PRESS ════════════════════════ */
export function PressPage({ setPage }) {
  const mentions = [
    { pub: "Tunisia Tech Weekly",   headline: "The Platform Changing Fashion Habits" },
    { pub: "Startup Africa",        headline: "SwapTn: E-commerce Innovation" },
    { pub: "Sustainability Mag",    headline: "Pre-Loved Fashion Reduces Waste" },
    { pub: "entrepreneur.tn",       headline: "Inside SwapTn's Growth Story" },
  ];

  return (
    <PageShell>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Media & Press</div>
      <h1 className="swp-h1">Press <span className="swp-h1-italic">& media</span></h1>
      <p className="swp-lead">For media inquiries, download our press kit or contact our communications team directly.</p>

      {/* Contact */}
      <CardSection label="Press Contact">
        {[
          { icon: Icon.mail,  title: "Email",         value: "press@swaptn.tn",    note: "Response within 24 hours" },
          { icon: Icon.phone, title: "Phone",         value: "+216 XX XXX XXXX",   note: "Weekdays 10am – 6pm" },
          { icon: Icon.clock, title: "Response Time", value: "Within 24 hours",    note: null },
        ].map((c, i) => (
          <div className="swp-contact-row" key={i}>
            <div className="swp-contact-icon">{c.icon}</div>
            <div>
              <div className="swp-contact-title">{c.title}</div>
              <div className="swp-contact-value">{c.value}</div>
              {c.note && <div className="swp-contact-note">{c.note}</div>}
            </div>
          </div>
        ))}
      </CardSection>

      {/* Featured */}
      <div className="swp-h2" style={{ marginTop: 36, marginBottom: 16 }}>Featured In</div>
      <div className="swp-card-grid">
        {mentions.map((m, i) => (
          <div className="swp-mention" key={i}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{m.pub}</div>
              <div style={{ fontSize: 14, color: "var(--charcoal)", fontWeight: 500 }}>"{m.headline}"</div>
            </div>
            <div style={{ color: "var(--green)", flexShrink: 0 }}>{Icon.arrow}</div>
          </div>
        ))}
      </div>

      {/* Press kit */}
      <div className="swp-cta" style={{ marginTop: 32 }}>
        <div className="swp-cta-eyebrow">Resources</div>
        <div className="swp-cta-title">Download our Press Kit</div>
        <div className="swp-cta-sub">Logos, brand guidelines, and company boilerplate — all in one package</div>
        <button className="swp-btn swp-btn-outline" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}>
          Download PDF {Icon.arrow}
        </button>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ HELP CENTER ═══════════════════ */
export function HelpCenterPage({ setPage }) {
  const [open, setOpen] = useState(null);

  const sections = [
    { q: "How do I buy an item?", steps: ["Browse using categories or search for specific brands", "Click an item to view details, photos, and seller info", "Add to cart or purchase directly", "Check out securely with multiple payment methods", "Track your order and receive your item"] },
    { q: "How do I sell an item?", steps: ["Click 'Sell' or 'List an Item' in the navigation", "Take clear photos from multiple angles", "Add details: title, brand, size, condition, description", "Set your price competitively", "Publish your listing and communicate with buyers", "Ship once sold and get paid within 5–7 business days"] },
    { q: "How do search and filters work?", bullets: ["Search for specific brands (e.g., 'Nike', 'Zara')", "Filter by Category, Condition, Size, or Price Range", "Sort by Newest, Price High→Low, or Price Low→High", "Save searches to get notified of new matches"] },
    { q: "What payment methods are accepted?", bullets: ["Credit/Debit Cards (Visa, Mastercard)", "Online Banking", "Mobile Wallets", "Bank Transfers", "All transactions are SSL-encrypted"] },
    { q: "What are my shipping options?", bullets: ["Standard: 5–7 business days", "Express: 2–3 business days (major cities)", "Free returns within 30 days if item doesn't match description", "Tracking included on all shipments"] },
    { q: "Can I return an item?", bullets: ["30-day return window if item doesn't match description", "Open a dispute through the platform", "Seller covers return shipping for defective items", "Refund processed within 3–5 business days after return"] },
  ];

  return (
    <PageShell>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Support</div>
      <h1 className="swp-h1">Help <span className="swp-h1-italic">Center</span></h1>
      <p className="swp-lead">Find answers to common questions about buying and selling on SwapTn.</p>

      <div className="swp-card-grid">
        {sections.map((s, i) => (
          <div key={i} className="swp-card" style={{ padding: "0", overflow: "hidden" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", background: "none", border: "none", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit" }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--charcoal)", textAlign: "left" }}>{s.q}</span>
              <svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" strokeWidth="1.8" style={{ width: 14, height: 14, flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M2 5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {open === i && (
              <div style={{ padding: "0 28px 20px", borderTop: "1px solid var(--sand)" }}>
                {s.steps
                  ? s.steps.map((t, j) => (
                      <div className="swp-step" key={j}>
                        <div className="swp-step-num">{j + 1}</div>
                        <div className="swp-step-text">{t}</div>
                      </div>
                    ))
                  : s.bullets.map((t, j) => (
                      <div className="swp-line" key={j} style={{ paddingTop: j === 0 ? 12 : 0 }}>
                        <span className="swp-line-bullet" />{t}
                      </div>
                    ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="swp-cta" style={{ marginTop: 32 }}>
        <div className="swp-cta-eyebrow">Still need help?</div>
        <div className="swp-cta-title">Talk to our support team</div>
        <div className="swp-cta-sub">We reply within 24 hours, every weekday</div>
        <button className="swp-btn swp-btn-outline" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}
          onClick={() => setPage("contact-us")}>
          Contact Us {Icon.arrow}
        </button>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ CONTACT US ════════════════════ */
export function ContactUsPage({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const valid = Object.values(form).every(Boolean);

  const submit = () => {
    if (!valid) return;
    console.log("Sent:", form);
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }, 4000);
  };

  return (
    <PageShell wide>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">We'd love to hear from you</div>
      <h1 className="swp-h1">Get in <span className="swp-h1-italic">touch</span></h1>
      <p className="swp-lead">Have a question, issue, or idea? Our team is here to help.</p>

      <div className="swp-two-col">
        {/* Info */}
        <div>
          <div className="swp-card">
            <div className="swp-card-label">Contact Information</div>
            {[
              { icon: Icon.mail,  t: "Email",       v: "support@swaptn.tn",      n: "Response within 24 hours" },
              { icon: Icon.phone, t: "Phone",       v: "+216 XX XXX XXXX",        n: "Mon–Fri 10am–6pm" },
              { icon: Icon.chat,  t: "Live Chat",   v: "Available in app",         n: "Instant support for members" },
              { icon: Icon.clock, t: "Office Hours",v: "Mon – Fri, 10am – 6pm",   n: "Closed weekends & holidays" },
            ].map((c) => (
              <div className="swp-contact-row" key={c.t}>
                <div className="swp-contact-icon">{c.icon}</div>
                <div>
                  <div className="swp-contact-title">{c.t}</div>
                  <div className="swp-contact-value">{c.v}</div>
                  <div className="swp-contact-note">{c.n}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="swp-card">
          <div className="swp-card-label">Send a Message</div>
          {sent && (
            <div className="swp-banner swp-banner-success" style={{ marginBottom: 20 }}>
              Message received — we'll reply within 24 hours.
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="swp-label">Your Name</label>
              <input className="swp-input" placeholder="Aymen Trabelsi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="swp-label">Email Address</label>
              <input className="swp-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="swp-label">Subject</label>
              <input className="swp-input" placeholder="What is this about?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <label className="swp-label">Message</label>
              <textarea className="swp-textarea" placeholder="Tell us more…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button className="swp-btn swp-btn-primary swp-btn-full" disabled={!valid} onClick={submit}>
              Send Message {Icon.arrow}
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ SAFE BUYING ═══════════════════ */
export function SafeBuyingPage({ setPage }) {
  const sections = [
    {
      label: "Verify Sellers",
      icon: Icon.shield,
      items: [
        "Look for the ✓ Verified badge next to seller names",
        "Check ratings and reviews from previous buyers",
        "New sellers: start with purchases under 100 TND first",
        "Avoid sellers with multiple complaints about authenticity",
      ],
    },
    {
      label: "Secure Payments",
      icon: Icon.lock,
      items: [
        "Always use SwapTn's payment system — never wire transfers",
        "Use credit/debit cards for built-in fraud protection",
        "Enable two-factor authentication on your account",
        "Check for SSL lock in your browser during checkout",
      ],
    },
    {
      label: "Recognize Scams",
      icon: Icon.alert,
      items: [
        "Prices that seem too good to be true usually are",
        "Sellers asking to pay via gift cards or wire transfers",
        "Extreme urgency or pressure to buy immediately",
        "Requests to communicate outside SwapTn's messaging",
        "Professionally shot photos that look borrowed from brand sites",
      ],
    },
    {
      label: "Inspect Item Photos",
      icon: Icon.star,
      items: [
        "Request multiple angles if photos seem limited",
        "Look for flaws, stains, or wear in the photos",
        "Reverse image search to confirm photos are original",
        "Ask for natural-lighting photos if items look artificially lit",
      ],
    },
    {
      label: "Secure Delivery",
      icon: Icon.box,
      items: [
        "Always use tracked/registered shipping",
        "Request signature confirmation for expensive items",
        "Photograph packaging when it arrives",
        "Check item condition immediately upon receipt",
        "Report damage or issues within 48 hours",
      ],
    },
    {
      label: "Dispute Resolution",
      icon: Icon.shield,
      items: [
        "Item not as described? Open a dispute within 30 days",
        "Provide evidence: photos, messages, shipping receipts",
        "Our team mediates and resolves within 5–7 business days",
        "Money-Back Guarantee covers all eligible disputes",
      ],
    },
  ];

  return (
    <PageShell wide>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Shop with confidence</div>
      <h1 className="swp-h1">Safe <span className="swp-h1-italic">buying</span> guide</h1>
      <p className="swp-lead">Everything you need to know to protect yourself and shop confidently on SwapTn.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {sections.map((s, i) => (
          <div className="swp-card" key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div className="swp-feature-icon">{s.icon}</div>
              <div className="swp-card-label" style={{ marginBottom: 0 }}>{s.label}</div>
            </div>
            {s.items.map((t, j) => (
              <div className="swp-line" key={j}><span className="swp-line-bullet" />{t}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="swp-cta" style={{ marginTop: 32 }}>
        <div className="swp-cta-eyebrow">Something wrong?</div>
        <div className="swp-cta-title">Report a suspicious seller</div>
        <div className="swp-cta-sub">Our trust & safety team investigates every report within 24 hours</div>
        <button className="swp-btn swp-btn-outline" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff" }}
          onClick={() => setPage("report-issue")}>
          Report an Issue {Icon.arrow}
        </button>
      </div>
    </PageShell>
  );
}

/* ══════════════════════════════ REPORT ISSUE ══════════════════ */
export function ReportIssuePage({ setPage }) {
  const [form, setForm] = useState({ issueType: "", listingId: "", description: "", email: "" });
  const [sent, setSent] = useState(false);

  const valid = form.issueType && form.description && form.email;

  const submit = () => {
    if (!valid) return;
    console.log("Report:", form);
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ issueType: "", listingId: "", description: "", email: "" }); }, 4000);
  };

  const types = ["Counterfeit / Fake Item", "Item Not As Described", "Damaged Item", "Missing Item", "Fraudulent Seller", "Offensive Content", "Other"];

  return (
    <PageShell>
      <BackBtn onClick={() => setPage("home")} />
      <div className="swp-eyebrow">Trust & Safety</div>
      <h1 className="swp-h1">Report an <span className="swp-h1-italic">issue</span></h1>
      <p className="swp-lead">Help us keep SwapTn safe. We investigate every report seriously and respond within 24–48 hours.</p>

      <div className="swp-card">
        {sent && (
          <div className="swp-banner swp-banner-success" style={{ marginBottom: 24 }}>
            Report submitted — our team will investigate within 24–48 hours.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="swp-label">Issue Type <span style={{ color: "var(--danger)" }}>*</span></label>
            <select className="swp-select" value={form.issueType} onChange={e => setForm({ ...form, issueType: e.target.value })}>
              <option value="">Select issue type…</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="swp-label">Listing ID <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
            <input className="swp-input" placeholder="e.g. #12345" value={form.listingId} onChange={e => setForm({ ...form, listingId: e.target.value })} />
          </div>

          <div>
            <label className="swp-label">Description <span style={{ color: "var(--danger)" }}>*</span></label>
            <textarea className="swp-textarea" placeholder="Describe what happened in as much detail as possible…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ minHeight: 150 }} />
          </div>

          <div>
            <label className="swp-label">Your Email <span style={{ color: "var(--danger)" }}>*</span></label>
            <input className="swp-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="swp-banner swp-banner-info">
            Tip: Include screenshots or photos if you have them — it speeds up investigation significantly.
          </div>

          <button className="swp-btn swp-btn-primary swp-btn-full" disabled={!valid} onClick={submit}>
            Submit Report {Icon.arrow}
          </button>
        </div>

        <div className="swp-divider" />

        <div className="swp-card-label">What happens next</div>
        {[
          "Our team reviews your report within 24–48 hours",
          "We investigate and may contact both parties",
          "Actions may include warnings, suspension, or removal",
          "We'll email you with the outcome",
        ].map((t, i) => (
          <div className="swp-step" key={i}>
            <div className="swp-step-num">{i + 1}</div>
            <div className="swp-step-text">{t}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function Footer({ setPage, language }) {
  const t = TRANSLATIONS[language];

  const getPageRoute = (linkName) => {
    const linkMap = {
      // Sell
      "List an Item": "sell",
      "Seller Guide": "seller-guide",
      "Pricing Tips": "pricing-tips",
      "Shipping": "shipping",
      
      // Support
      "Help Center": "help-center",
      "Contact Us": "contact-us",
      "Safe Buying": "safe-buying",
      "Report an Issue": "report-issue",
      
      // Company
      "About Us": "about-us",
      "Blog": "blog",
      "Careers": "careers",
      "Press": "press"
    };
    return linkMap[linkName] || "home";
  };

  return (
    <footer style={{ background: "var(--dark)", color: "white", padding: "60px 24px 32px", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, color: "var(--teal)", marginBottom: 12 }}>SwapTn</div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7 }}>Tunisia's #1 marketplace for pre-loved fashion. Shop sustainably, sell effortlessly.</p>
          </div>
          {[
            { title: "Sell", links: ["List an Item", "Seller Guide", "Pricing Tips", "Shipping"] },
            { title: "Support", links: ["Help Center", "Contact Us", "Safe Buying", "Report an Issue"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map(l => <span key={l} onClick={() => setPage(getPageRoute(l))} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "var(--teal)"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}>{l}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>© 2025 SwapTn.tn · All rights reserved</span>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy Policy", "Terms of Service", "Cookies"].map(l => <span key={l} style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer" }}>{l}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchVal, setSearchVal] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("en");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingError, setListingError] = useState("");

  // ─── Load user from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    try {
      if (api.isLoggedIn()) {
        const savedUser = localStorage.getItem('swaptn_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Ensure role is present (default to USER for old data)
          if (!userData.role) {
            userData.role = "USER";
          }
          setUser(userData);
        }
      } else {
        // Clear stale auth data when token is missing or expired.
        setUser(null);
        localStorage.removeItem('swaptn_user');
        api.clearToken();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
  }, []);

  // ─── Save current page to localStorage ──────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('swaptn_page', page);
  }, [page]);

  // ─── Fetch listings on mount and when needed ───────────────────────────────
  useEffect(() => {
    const fetchListingData = async () => {
      try {
        setLoading(true);
        setListingError("");
        const data = await api.fetchListings();
        // Normalize listing data: map imageUrl to image, and extract owner avatar from database
        const normalized = Array.isArray(data) ? data.map(item => ({
          ...item,
          image: item.image || item.imageUrl,
          seller: item.owner?.fullName || item.seller || "Seller",
          sellerAvatar: item.owner?.imageUrl || null,
          sellerCity: item.owner?.city || item.location || "Tunisia",
          sellerId: item.owner?.id
        })) : [];
        setListings(normalized);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setListingError(err.message || "⚠️ Failed to load items. Please refresh the page.");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListingData();
  }, []);

  const ctx = { 
    wishlist, setWishlist, 
    user, setUser, 
    language, setLanguage,
    listings, setListings,
    loading,
    listingError,
    setPage,
    setSelectedItem,
    setSelectedSeller,
    t: TRANSLATIONS[language]
  };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
      case "browse": return <BrowsePage setPage={setPage} setSelectedItem={setSelectedItem} selectedCategory={selectedCategory} language={language} listings={listings} loading={loading} searchVal={searchVal} setSearchVal={setSearchVal} />;
      case "item": return <ItemPage item={selectedItem} setPage={setPage} setSelectedSeller={setSelectedSeller} language={language} />;
      case "sell": return <SellPage setPage={setPage} language={language} />;
      case "wishlist": return <WishlistPage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
      case "messages": return <MessagesPageComponent language={language} setPage={setPage} user={user} TRANSLATIONS={TRANSLATIONS} />;
      case "profile": return <ProfilePage setPage={setPage} setSelectedItem={setSelectedItem} setUser={setUser} language={language} listings={listings} />;
      case "seller": return <SellerPage setPage={setPage} sellerData={selectedSeller} language={language} />;
      case "login": return <LoginPage setPage={setPage} language={language} />;
      case "admin": return <ProtectedAdminRoute><AdminPage /></ProtectedAdminRoute>;
      case "notifications": return <NotificationsPage language={language} setPage={setPage} />;
      // Sell Section
      case "seller-guide": return <SellerGuidePage setPage={setPage} />;
      case "pricing-tips": return <PricingTipsPage setPage={setPage} />;
      case "shipping": return <ShippingPage setPage={setPage} />;
      
      // Support Section
      case "help-center": return <HelpCenterPage setPage={setPage} />;
      case "contact-us": return <ContactUsPage setPage={setPage} />;
      case "safe-buying": return <SafeBuyingPage setPage={setPage} />;
      case "report-issue": return <ReportIssuePage setPage={setPage} />;
      
      // Company Section
      case "about-us": return <AboutUsPage setPage={setPage} />;
      case "blog": return <BlogPage setPage={setPage} />;
      case "careers": return <CareersPage setPage={setPage} />;
      case "press": return <PressPage setPage={setPage} />;
      
      default: return <HomePage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
    }
  };

  return (
    <AppContext.Provider value={ctx}>
      <style>{globalStyle}</style>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar page={page} setPage={setPage} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} language={language} searchVal={searchVal} setSearchVal={setSearchVal} />
        <main style={{ flex: 1 }}>
          <div key={page} className="page-transition">{renderPage()}</div>
        </main>
        <Footer setPage={setPage} language={language} />
      </div>
    </AppContext.Provider>
  );
}
