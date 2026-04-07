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
const TRANSLATIONS = {
  en: {
    sell: "Sell", wishlist: "Wishlist", messages: "Messages", cart: "Cart", login: "Login",
    startShopping: "Start Shopping", listItem: "List an Item", shopSustainably: "Shop Sustainably · Sell Effortlessly",
    warpdrobe2ndchance: "Your Wardrobe's\nSecond Chance", buyPreLoved: "Buy & sell pre-loved fashion in Tunisia. Join thousands of style lovers giving clothes a new life.",
    language: "Language", english: "English", french: "Français", arabic: "العربية",
    shopByCategory: "Shop by Category", newArrivals: "New Arrivals", seeAll: "See all →",
    howItWorks: "How It Works", photographList: "Photograph & List", chatNegotiate: "Chat & Negotiate",
    shipIt: "Ship It", getPaid: "Get Paid", myCart: "My Cart", cartEmpty: "Your cart is empty",
    discoverItems: "Discover amazing pre-loved items", listAnItem: "List an Item", addPhotos: "Add Photos",
    turnUnused: "Turn your unused clothes into cash 💸", dragDropPhotos: "Drag & drop photos here",
    clickBrowse: "or click to browse your device", choosePhotos: "Choose Photos", itemDetails: "Item Details",
    setPrice: "Set Your Price", reviewPublish: "Review & Publish", publishListing: "Publish Listing",
    browse: "Browse", back: "← Back", continue: "Continue →", total: "Total", checkout: "Checkout →",
    searchItems: "Search brands, items…", noResults: "No items found", filter: "Filter", sort: "Sort by", newest: "Newest",
    priceHigh: "Price: High to Low", priceLow: "Price: Low to High", title: "Title", brand: "Brand", 
    category: "Category", condition: "New", new: "New", used: "Used", size: "Size", price: "Price", description: "Description",
    details: "Details", seller: "Seller", location: "Location", cond: "Condition",
    addToCart: "Add to Cart", addToWishlist: "Add to Wishlist", removeFromCart: "Remove from Cart",
    profile: "Profile", notifications: "Notifications", home: "Home", signOut: "Sign Out", 
    email: "Email", password: "Password", name: "Name", signUp: "Sign up", signIn: "Sign in",
    donttHaveAccount: "Don't have an account?", haveAccount: "Already have an account?", forgotPassword: "Forgot password?",
    createAccount: "Create Account →", reviewOrder: "Review Your Order", selectPayment: "Select Payment Method",
    shippingAddress: "Shipping Address", placeOrder: "Place Order", orderConfirmed: "Order Confirmed!",
  },
  fr: {
    sell: "Vendre", wishlist: "Favoris", messages: "Messages", cart: "Panier", login: "Connexion",
    startShopping: "Commencer à faire du shopping", listItem: "Lister un article", shopSustainably: "Shopping Durable · Vente Facile",
    warpdrobe2ndchance: "Donnez une Seconde Vie\nà Votre Garde-robe", buyPreLoved: "Achetez et vendez de la mode pré-aimée en Tunisie. Rejoignez des milliers d'amateurs de style qui donnent une nouvelle vie aux vêtements.",
    language: "Langue", english: "English", french: "Français", arabic: "العربية",
    shopByCategory: "Magasiner par Catégorie", newArrivals: "Nouveautés", seeAll: "Voir tous →",
    howItWorks: "Comment ça Marche", photographList: "Prendre une Photo et Lister", chatNegotiate: "Discuter et Négocier",
    shipIt: "Expédier", getPaid: "Recevoir un Paiement", myCart: "Mon Panier", cartEmpty: "Votre panier est vide",
    discoverItems: "Découvrez des articles pré-aimés incroyables", listAnItem: "Lister un article", addPhotos: "Ajouter des Photos",
    turnUnused: "Transformez vos vêtements inutilisés en argent 💸", dragDropPhotos: "Faites glisser les photos ici",
    clickBrowse: "ou cliquez pour parcourir votre appareil", choosePhotos: "Choisir des Photos", itemDetails: "Détails de l'article",
    setPrice: "Définir votre prix", reviewPublish: "Éxaminer et Publier", publishListing: "Publier l'annonce",
    browse: "Parcourir", back: "← Retour", continue: "Continuer →", total: "Total", checkout: "Passer la commande →",
    searchItems: "Rechercher marques, articles…", noResults: "Aucun élément trouvé", filter: "Filtre", sort: "Trier par", newest: "Plus récent",
    priceHigh: "Prix: Élevé à Bas", priceLow: "Prix: Bas à Élevé", title: "Titre", brand: "Marque",
    category: "Catégorie", condition: "État", new: "Neuf", used: "Utilisé", size: "Taille", price: "Prix", description: "Description",
    details: "Détails", seller: "Vendeur", location: "Lieu", cond: "État",
    addToCart: "Ajouter au panier", addToWishlist: "Ajouter aux favoris", removeFromCart: "Retirer du panier",
    profile: "Profil", notifications: "Notifications", home: "Accueil", signOut: "Déconnexion",
    email: "Email", password: "Mot de passe", name: "Nom", signUp: "S'inscrire", signIn: "Se connecter",
    donttHaveAccount: "Vous n'avez pas de compte?", haveAccount: "Vous avez déjà un compte?", forgotPassword: "Mot de passe oublié?",
    createAccount: "Créer un compte →", reviewOrder: "Examiner votre commande", selectPayment: "Sélectionner le mode de paiement",
    shippingAddress: "Adresse de livraison", placeOrder: "Passer la commande", orderConfirmed: "Commande confirmée!",
  },
  ar: {
    sell: "بيع", wishlist: "المفضلة", messages: "الرسائل", cart: "السلة", login: "تسجيل الدخول",
    startShopping: "ابدأ التسوق", listItem: "نشر عنصر", shopSustainably: "تسوق مستدام · بيع سهل",
    warpdrobe2ndchance: "أعطِ خزانة ملابسك\nفرصة ثانية", buyPreLoved: "اشتري وبيع الملابس المستعملة في تونس. انضم لآلاف محبي الأسلوب الذين يعطون حياة جديدة للملابس.",
    language: "اللغة", english: "English", french: "Français", arabic: "العربية",
    shopByCategory: "التسوق حسب الفئة", newArrivals: "الوصول الجديدة", seeAll: "عرض الكل →",
    howItWorks: "كيف يعمل", photographList: "التقط صورة ونشر", chatNegotiate: "دردشة وتفاوض",
    shipIt: "شحن", getPaid: "الحصول على الدفع", myCart: "سلتي", cartEmpty: "سلتك فارغة",
    discoverItems: "اكتشف عناصر رائعة مستعملة", listAnItem: "نشر عنصر", addPhotos: "إضافة صور",
    turnUnused: "حول ملابسك غير المستخدمة إلى نقود 💸", dragDropPhotos: "اسحب الصور هنا",
    clickBrowse: "أو انقر للاستعراض على جهازك", choosePhotos: "اختر صورًا", itemDetails: "تفاصيل العنصر",
    setPrice: "حدد السعر", reviewPublish: "مراجعة والنشر", publishListing: "نشر الإدراج",
    browse: "استعراض", back: "← العودة", continue: "المتابعة →", total: "المجموع", checkout: "الدفع →",
    searchItems: "البحث عن العلامات التجارية والعناصر…", noResults: "لم يتم العثور على عناصر", filter: "تصفية", sort: "الترتيب حسب", newest: "الأحدث",
    priceHigh: "السعر: مرتفع إلى منخفض", priceLow: "السعر: منخفض إلى مرتفع", title: "العنوان", brand: "العلامة التجارية",
    category: "الفئة", condition: "الحالة", new: "جديد", used: "مستعمل", size: "الحجم", price: "السعر", description: "الوصف",
    details: "التفاصيل", seller: "البائع", location: "الموقع",
    addToCart: "أضف إلى السلة", addToWishlist: "أضف إلى المفضلة", removeFromCart: "إزالة من السلة",
    profile: "الملف الشخصي", notifications: "الإخطارات", home: "الرئيسية", signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني", password: "كلمة المرور", name: "الاسم", signUp: "التسجيل", signIn: "تسجيل الدخول",
    donttHaveAccount: "ليس لديك حساب؟", haveAccount: "هل لديك حساب بالفعل؟", forgotPassword: "هل نسيت كلمة المرور؟",
    createAccount: "إنشاء حساب →", reviewOrder: "ملخص الطلب", selectPayment: "اختر طريقة الدفع",
    shippingAddress: "عنوان الشحن", placeOrder: "طلب الشراء", orderConfirmed: "تم تأكيد الطلب!",
  }
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal: #00b09b;
    --teal-dark: #008577;
    --teal-light: #e0f7f4;
    --coral: #ff6b6b;
    --gold: #f7c948;
    --dark: #1a1a2e;
    --gray: #6b7280;
    --light-gray: #f4f5f7;
    --border: #e5e7eb;
    --white: #ffffff;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 48px rgba(0,0,0,0.15);
    --radius: 16px;
    --radius-sm: 8px;
    --font-display: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body {
    font-family: var(--font-body);
    background: #f9fafb;
    color: var(--dark);
    min-height: 100vh;
  }

  button { cursor: pointer; font-family: var(--font-body); }
  input, textarea, select { font-family: var(--font-body); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 3px; }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .fade-in { animation: fadeIn 0.4s ease forwards; }
  .slide-in { animation: slideIn 0.3s ease forwards; }

  /* Utility */
  .btn-primary {
    background: linear-gradient(135deg, var(--teal), var(--teal-dark));
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,176,155,0.35); }

  .btn-secondary {
    background: white;
    color: var(--teal);
    border: 2px solid var(--teal);
    padding: 10px 22px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s;
  }
  .btn-secondary:hover { background: var(--teal-light); }

  .card {
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .badge {
    background: var(--teal-light);
    color: var(--teal-dark);
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 50px;
  }

  .badge-coral {
    background: #fff0f0;
    color: var(--coral);
  }

  .input-field {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 15px;
    transition: border-color 0.2s;
    outline: none;
    background: white;
  }
  .input-field:focus { border-color: var(--teal); }

  .messages-container {
    scrollbar-width: thin;
    scrollbar-color: var(--teal) var(--light-gray);
  }
  .messages-container::-webkit-scrollbar {
    width: 10px;
  }
  .messages-container::-webkit-scrollbar-track {
    background: var(--light-gray);
    border-radius: 5px;
  }
  .messages-container::-webkit-scrollbar-thumb {
    background: var(--teal);
    border-radius: 5px;
  }
  .messages-container::-webkit-scrollbar-thumb:hover {
    background: var(--teal-dark);
  }

  .page-header {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 900;
    color: var(--dark);
    margin-bottom: 8px;
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Navbar({ page, setPage, selectedCategory, setSelectedCategory, language, setLanguage, searchVal, setSearchVal }) {
  const { cart, wishlist, user } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const t = TRANSLATIONS[language];

  // Calculate user messages count
  const userMessageCount = 0;

  const navStyle = {
    position: "sticky", top: 0, zIndex: 1000,
    background: "white",
    borderBottom: "1px solid var(--border)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    width: "100%",
  };
  const innerStyle = {
    width: "100%",
    display: "flex", alignItems: "center",
    padding: "0 24px", height: 64, gap: 16,
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

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
          {/* Language Selector */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setLangOpen(!langOpen)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              background: "var(--light-gray)", border: "1px solid var(--border)",
              borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "all 0.2s"
            }}>
              🌐 {language.toUpperCase()}
            </button>
            {langOpen && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 8,
                background: "white", borderRadius: "var(--radius-sm)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 1001,
                overflow: "hidden", minWidth: 140
              }}>
                {["en", "fr", "ar"].map(lang => (
                  <button key={lang} onClick={() => { setLanguage(lang); setLangOpen(false); }} style={{
                    width: "100%", padding: "10px 16px", textAlign: "left",
                    background: language === lang ? "var(--teal-light)" : "transparent",
                    border: "none", cursor: "pointer", fontSize: 13,
                    color: language === lang ? "var(--teal-dark)" : "var(--dark)",
                    fontWeight: language === lang ? 600 : 400,
                    transition: "background 0.2s"
                  }}>
                    {lang === "en" ? "🇬🇧 English" : lang === "fr" ? "🇫🇷 Français" : "🇹🇳 العربية"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Login / Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NavBtn icon="🏷️" label={t.sell} highlight onClick={() => setPage("sell")} />
          <NavBtn icon="❤️" label={wishlist.length || ""} onClick={() => setPage("wishlist")} />
          <NavBtn icon="💬" label={userMessageCount || ""} onClick={() => setPage("messages")} badge={userMessageCount > 0} />
          <NavBtn icon="🛒" label={cart.length || ""} onClick={() => setPage("cart")} />
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
            ? <div onClick={() => setPage("profile")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 50, border: "2px solid var(--border)", transition: "border-color 0.2s" }}>
                <img src={user.avatar} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} alt="" />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
              </div>
            : <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }} onClick={() => setPage("login")}>{t.login}</button>
          }
        </div>
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
        direction: language === "ar" ? "rtl" : "ltr"
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
  const { cart, setCart, wishlist, setWishlist, user } = useApp();
  const [liked, setLiked] = useState(wishlist.some(i => i.id === item.id));
  const [addedToCart, setAddedToCart] = useState(false);
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
    avatar: item?.sellerAvatar || sellerObj?.imageUrl || "https://i.pravatar.cc/150?img=1", 
    rating: 4.5, 
    sales: 10, 
    location: item?.sellerCity || sellerObj?.city || item?.location || "Tunisia" 
  };
  
  // Debug log to see what we're receiving
  useEffect(() => {
    console.log("Item data:", { item, sellerObj, seller, avatar: seller.avatar });
  }, [item]);
  
  const imgs = [item?.image].filter(Boolean);

  const handleCart = () => {
    if (!cart.find(i => i.id === item.id)) setCart(c => [...c, item]);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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
                <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: 14 }} onClick={() => {
                  if (user && user.id === seller.id) {
                    alert("❌ You cannot buy your own listing!");
                    return;
                  }
                  handleCart();
                }}>
                  {addedToCart ? "✅ Added to Cart!" : "🛒 Add to Cart"}
                </button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: 14, background: "linear-gradient(135deg, #ff6b6b, #ee5a24)" }} onClick={() => {
                  if (user && user.id === seller.id) {
                    alert("❌ You cannot buy your own listing!");
                    return;
                  }
                  setPage("checkout");
                }}>
                  ⚡ Buy Now
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
              {/* ✅ FIXED: Message button now creates conversation */}
              <button className="btn-secondary" style={{ width: "100%", padding: 12, marginBottom: 32, justifyContent: "center", display: "flex", gap: 8, opacity: messageSending ? 0.6 : 1, cursor: messageSending ? "not-allowed" : "pointer" }} onClick={async () => {
                if (!user) {
                  alert("🔒 Please log in to message the seller");
                  setPage("login");
                  return;
                }
                if (user.id === seller.id) {
                  alert("❌ You cannot message yourself");
                  return;
                }
                setMessageSending(true);
                try {
                  const conversation = await api.createConversation(item.id, seller.id);
                  if (conversation?.id) {
                    alert("✅ Conversation started! Redirecting to Messages...");
                    setPage("messages");
                  }
                } catch (err) {
                  console.error("Conversation error:", err);
                  alert("❌ " + (err.message || "Failed to start conversation"));
                } finally {
                  setMessageSending(false);
                }
              }} disabled={messageSending}>
                {messageSending ? "⏳ Starting chat..." : "💬 Message Seller"}
              </button>
            </>
          ) : (
            <div style={{ background: "#fff3cd", border: "2px solid #ffc107", padding: "16px", borderRadius: "12px", textAlign: "center", marginBottom: 32, fontWeight: "600", color: "#856404", fontSize: 15 }}>
              ⚠️ This is your listing - You cannot purchase your own item
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
                    if (!reportReason.trim()) {
                      alert("⚠️ Please provide a reason for reporting");
                      return;
                    }
                    if (!user) {
                      alert("🔒 Please log in to report listings");
                      setShowReportModal(false);
                      setPage("login");
                      return;
                    }
                    setReportSubmitting(true);
                    try {
                      const result = await api.createReport({
                        type: "LISTING",
                        targetId: item.id,
                        reason: reportReason.trim()
                      });
                      alert("✅ Report submitted successfully! Thank you for helping keep our community safe.");
                      setShowReportModal(false);
                      setReportReason("");
                    } catch (err) {
                      console.error("Report error:", err);
                      alert("⚠️ Failed to submit report: " + (err.message || "Unknown error"));
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
            <img src={seller.avatar} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} alt="" />
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

function CartPage({ setPage, language }) {
  const t = TRANSLATIONS[language];
  const { cart, setCart } = useApp();
  const total = cart.reduce((s, i) => s + i.price, 0);
  const fee = Math.round(total * 0.05);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">My Cart</h1>
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ color: "var(--gray)", marginBottom: 24 }}>Discover amazing pre-loved items</p>
          <button className="btn-primary" onClick={() => setPage("browse")}>Start Shopping</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cart.map(item => (
              <div key={item.id} className="card" style={{ display: "flex", gap: 16, padding: 16 }}>
                <img src={item.image} style={{ width: 100, height: 100, borderRadius: "var(--radius-sm)", objectFit: "cover" }} alt="" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: "var(--gray)", fontSize: 14, marginBottom: 8 }}>{item.brand} · {item.size} · {item.condition}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "var(--teal-dark)" }}>{item.price} TND</div>
                </div>
                <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))} style={{ background: "none", border: "none", color: "var(--gray)", fontSize: 20, cursor: "pointer", alignSelf: "flex-start" }}>✕</button>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 24, position: "sticky", top: 90 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Order Summary</h3>
            {[["Subtotal", `${total} TND`], ["Platform fee (5%)", `${fee} TND`], ["Shipping", "Calculated at checkout"]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: "var(--gray)" }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: "2px solid var(--border)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "var(--teal-dark)" }}>{total + fee} TND</span>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16, justifyContent: "center" }} onClick={() => setPage("checkout")}>Proceed to Checkout →</button>
            <button className="btn-secondary" style={{ width: "100%", padding: 12, marginTop: 12, textAlign: "center", display: "block" }} onClick={() => setPage("browse")}>Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutPage({ setPage, language }) {
  const t = TRANSLATIONS[language];
  const { cart, setCart } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "", cardNum: "", expiry: "", cvv: "", method: "card" });
  const total = cart.reduce((s, i) => s + i.price, 0) + 8;

  const steps = ["📦 " + t.shippingAddress, "💳 " + t.selectPayment, "✅ " + t.orderConfirmed];

  if (step === 3) return (
    <div style={{ maxWidth: 480, margin: "80px auto", padding: "40px 24px", textAlign: "center", animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, marginBottom: 12 }}>Order Placed!</h1>
      <p style={{ color: "var(--gray)", fontSize: 16, marginBottom: 32 }}>Your order has been confirmed. The seller will ship within 2–3 days.</p>
      <div style={{ background: "var(--teal-light)", borderRadius: "var(--radius)", padding: 20, marginBottom: 32 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Order #VTN-{Math.floor(Math.random() * 99999)}</div>
        <div style={{ color: "var(--gray)", fontSize: 14 }}>Track your order in your profile</div>
      </div>
      <button className="btn-primary" style={{ padding: "14px 40px" }} onClick={() => { setCart([]); setPage("home"); }}>Back to Home 🏡</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <h1 className="page-header">Checkout</h1>
      <div style={{ display: "flex", gap: 0, marginBottom: 40 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", margin: "0 auto 6px",
              background: step > i + 1 ? "var(--teal)" : step === i + 1 ? "var(--teal)" : "var(--border)",
              color: step >= i + 1 ? "white" : "var(--gray)",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14
            }}>{step > i + 1 ? "✓" : i + 1}</div>
            <div style={{ fontSize: 12, color: step === i + 1 ? "var(--teal)" : "var(--gray)", fontWeight: step === i + 1 ? 600 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        <div className="card" style={{ padding: 32 }}>
          {step === 1 && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Shipping Address</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[["Full Name", "name", "text"], ["Phone Number", "phone", "tel"], ["Address", "address", "text"], ["City", "city", "text"]].map(([l, k, t]) => (
                  <div key={k}>
                    <label htmlFor={`checkout-${k}`} style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>{l}</label>
                    <input id={`checkout-${k}`} className="input-field" type={t} placeholder={l} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div style={{ animation: "slideIn 0.3s ease" }}>
              <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Payment Method</h2>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {[["card", "💳 Card"], ["cod", "💵 Cash on Delivery"]].map(([v, l]) => (
                  <button key={v} onClick={() => setForm(f => ({ ...f, method: v }))} style={{
                    flex: 1, padding: 16, border: `2px solid ${form.method === v ? "var(--teal)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)", background: form.method === v ? "var(--teal-light)" : "white",
                    cursor: "pointer", fontWeight: 600, fontSize: 14
                  }}>{l}</button>
                ))}
              </div>
              {form.method === "card" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label htmlFor="card-number" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Card Number</label>
                    <input id="card-number" className="input-field" placeholder="1234 5678 9012 3456" value={form.cardNum} onChange={e => setForm(f => ({ ...f, cardNum: e.target.value }))} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label htmlFor="card-expiry" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Expiry</label>
                      <input id="card-expiry" className="input-field" placeholder="MM/YY" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
                    </div>
                    <div>
                      <label htmlFor="card-cvv" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>CVV</label>
                      <input id="card-cvv" className="input-field" placeholder="123" type="password" value={form.cvv} onChange={e => setForm(f => ({ ...f, cvv: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {step > 1 && <button className="btn-secondary" style={{ flex: 1, padding: 14 }} onClick={() => setStep(s => s - 1)}>← Back</button>}
            <button className="btn-primary" style={{ flex: 1, padding: 14, justifyContent: "center" }} onClick={() => setStep(s => s + 1)}>
              {step === 2 ? "Confirm Order 🎉" : "Continue →"}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: 20, alignSelf: "start" }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Summary</h3>
          {cart.slice(0, 3).map(item => (
            <div key={item.id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <img src={item.image} style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", objectFit: "cover" }} alt="" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "var(--gray)" }}>{item.price} TND</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: "var(--teal-dark)" }}>{total} TND</span>
            </div>
          </div>
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
  const u = user || { name: "User", avatar: "https://i.pravatar.cc/150?img=1", rating: 0, sales: 0, location: "Tunisia", bio: "User profile", followers: 0, following: 0 };

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
            <img src={u.avatar} style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "4px solid var(--teal)" }} alt="" />
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
            <button className="btn-secondary" style={{ padding: "10px 24px", color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => { setUser(null); localStorage.removeItem('swaptn_user'); api.logout(); setPage("home"); }}>Déconnexion</button>
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
          {[{ user: "mouldi_h", avatar: "https://i.pravatar.cc/150?img=13", rating: 5, text: "Amazing seller! Item was exactly as described. Fast shipping too! 🌟", item: "Zara Floral Dress" }, { user: "ahmed_k", avatar: "https://i.pravatar.cc/150?img=12", rating: 5, text: "Very fast and professional. Would buy again!", item: "H&M Hoodie" }].map((r, i) => (
            <div key={i} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <img src={r.avatar} style={{ width: 44, height: 44, borderRadius: "50%" }} alt="" />
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
  const seller = sellerData || { name: "Seller", avatar: "https://i.pravatar.cc/150?img=1", bio: "Seller profile", rating: 4.5, sales: 0, followers: 0, location: "Tunisia" };
  const items = [];

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("item")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24 }}>← Back</button>
      <div className="card" style={{ padding: 40, marginBottom: 32, background: "linear-gradient(135deg, var(--teal-light), white)" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <img src={seller.avatar} style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--teal)" }} alt="" />
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
      </div>
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
            avatar: response.imageUrl || `https://i.pravatar.cc/150?u=${response.email}`,
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
              avatar: loginResponse.imageUrl || `https://i.pravatar.cc/150?u=${loginResponse.email}`,
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

function SellerGuidePage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">📖 Seller Guide</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Everything you need to know about selling on SwapTn successfully</p>

      <div style={{ display: "grid", gap: 24 }}>
        {[
          {
            title: "✅ Before You List",
            content: [
              "1. Take quality photos in natural lighting from multiple angles",
              "2. Clean and inspect the item thoroughly",
              "3. Check for authenticity - ensure brand tags are intact",
              "4. Gather info: brand, size, material, condition, any defects",
              "5. Decide your price competitively by checking similar items"
            ]
          },
          {
            title: "🏆 Creating the Perfect Listing",
            content: [
              "• Use clear, accurate titles (e.g., 'Vintage Nike Blue Hoodie Size M')",
              "• Write detailed descriptions: condition, fit, measurements",
              "• Mention any flaws honestly - buyers appreciate transparency",
              "• Use all 8 photo slots - show different angles and details",
              "• Include close-ups of brand tags and condition markers"
            ]
          },
          {
            title: "💰 Pricing Strategy",
            content: [
              "• Price 20-50% below retail depending on condition",
              "• Compare similar items that sold recently",
              "• Factor in: brand, condition, demand, season",
              "• Start slightly higher to allow for negotiation",
              "• Bundle items to attract bulk buyers"
            ]
          },
          {
            title: "💬 Communicating with Buyers",
            content: [
              "• Respond to messages within 24 hours",
              "• Be honest about condition and fit",
              "• Answer questions about measurements and materials",
              "• Be open to negotiation - it builds reputation",
              "• Provide tracking information once sold"
            ]
          },
          {
            title: "📦 Efficient Shipping",
            content: [
              "• Weigh item accurately to calculate correct postage",
              "• Package securely with padding to prevent damage",
              "• Use tracked/registered shipping for high-value items",
              "• Take photos of item before packing",
              "• Send tracking info to buyer immediately",
              "• Pack within 24 hours of sale"
            ]
          },
          {
            title: "⭐ Building Your Reputation",
            content: [
              "• Communicate professionally and promptly",
              "• Deliver items in the condition described",
              "• Encourage buyer feedback by providing great service",
              "• Handle disputes fairly and professionally",
              "• Your rating determines your visibility - maintain quality!"
            ]
          }
        ].map((section, i) => (
          <div key={i} className="card">
            <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>{section.title}</h3>
            {section.content.map((line, j) => (
              <div key={j} style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.8, marginBottom: 4 }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button onClick={() => setPage("sell")} style={{ background: "var(--teal)", color: "white", border: "none", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 32, width: "100%" }}>
        Start Selling Now →
      </button>
    </div>
  );
}

// ─── PRICING TIPS PAGE ────────────────────────────────────────────────────────
function PricingTipsPage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">💲 Pricing Tips</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Master the art of price optimization to maximize your sales</p>

      <div style={{ display: "grid", gap: 24 }}>
        {[
          {
            title: "📊 Pricing Formula",
            content: "Use this formula to calculate your price: Original Retail Price × (1 - Depreciation Factor). Depreciation varies by condition: Excellent (80-90% of retail), Good (60-80%), Fair (40-60%), Poor (20-40%)"
          },
          {
            title: "🎯 Competitive Pricing",
            content: "Search for similar items on SwapTn and note their prices. Price yours 5-10% lower if you want to sell faster, or 5-10% higher if condition is better. Aim for middle ground unless your item is unique."
          },
          {
            title: "👑 Designer & Premium Brands",
            content: "Designer items hold value better. Retain 50-70% of retail price if in good condition. Limited editions and collaboration pieces can command higher prices. Verify authenticity clearly."
          },
          {
            title: "📈 Seasonal Pricing",
            content: "Adjust prices seasonally: Winter coats sell well in fall/winter (price higher), summer dresses in spring/summer. Off-season items should be priced lower to move inventory faster."
          },
          {
            title: "🎁 Bundle Deals",
            content: "Offer 10-15% discount when buying 2-3 items together. This moves inventory faster and increases total transaction value. Good for clearing out slower-moving pieces."
          },
          {
            title: "⏰ Price Strategy by Time",
            content: "Start slightly high when listing (allows negotiation room). Lower price by 5-10% after 2 weeks if no interested buyers. Further reduction after 4 weeks. Use 'Just Added' promotion for first week."
          },
          {
            title: "🚫 Pricing Mistakes to Avoid",
            content: "• Overpricing compared to similar items (buyers scroll past)\n• Underpricing and losing profit potential\n• Not considering shipping costs in your margin\n• Ignoring market demand for the item\n• Setting round numbers (129 TND converts better than 130 TND)"
          },
          {
            title: "✨ Special Pricing Tactics",
            content: "• Use psychological pricing (99, 199, 299) for better conversion\n• Offer 'Make an Offer' option to encourage negotiations\n• Price hot items higher initially (test market)\n• Gradually reduce difficult-to-sell items\n• Monitor competitor pricing weekly"
          }
        ].map((section, i) => (
          <div key={i} className="card">
            <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>{section.title}</h3>
            <div style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SHIPPING PAGE ────────────────────────────────────────────────────────────
function ShippingPage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">📦 Shipping Information</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Everything you need to know about shipping on SwapTn</p>

      <div style={{ display: "grid", gap: 24 }}>
        {[
          {
            title: "🚚 Shipping Options",
            content: [
              "Standard Shipping: 5-7 business days (within Tunisia) - Most affordable",
              "Express Shipping: 2-3 business days (major cities) - Premium rate",
              "Same-Day Pickup: Available in Tunis area - Instant delivery"
            ]
          },
          {
            title: "📍 Delivery Zones",
            content: [
              "Zone 1 (Tunis & Ariana): All options available",
              "Zone 2 (Major cities: Sfax, Sousse, Monastir): Standard & Express",
              "Zone 3 (All other cities): Standard shipping only",
              "Rural areas: May take additional 2-3 days"
            ]
          },
          {
            title: "💰 Shipping Costs",
            content: [
              "Standard: 7-15 TND depending on weight",
              "Express: 15-25 TND depending on zone",
              "Items under 500g: 5-7 TND",
              "Items 500g-1kg: 8-12 TND",
              "Items 1kg-2kg: 12-18 TND",
              "Items over 2kg: Quote-based pricing"
            ]
          },
          {
            title: "📋 Shipping Process",
            content: [
              "1. Item sold → Buyer receives shipping notification",
              "2. Seller has 24 hours to prepare and drop-off item",
              "3. Shipping partner picks up the package",
              "4. Tracking number sent to buyer",
              "5. Item in transit - tracking updates available",
              "6. Delivery confirmation sent to both parties"
            ]
          },
          {
            title: "🛡️ Shipping Protection",
            content: [
              "All items are insured during transit",
              "Package damage covered up to 500 TND",
              "Loss covered up to full item value",
              "Free reshipping if item arrives damaged",
              "Buyer protection: Return within 30 days if damaged"
            ]
          },
          {
            title: "❌ Shipping Restrictions",
            content: [
              "Prohibited items: Electronics over 50 TND, liquids, hazardous materials",
              "Cannot ship: Items violating authenticity policy, counterfeit goods",
              "Large items: Must arrange special pickup (quoted separately)",
              "Fragile items: Use Express with insurance recommended"
            ]
          },
          {
            title: "💡 Shipping Best Practices",
            content: [
              "• Weigh items accurately - overestimate if unsure",
              "• Use quality packaging to prevent damage",
              "• Add padding and protective materials",
              "• Clearly label package with recipient address",
              "• Take photos before packing (evidence if damage claim)",
              "• Provide tracking info within 2 hours of shipment"
            ]
          }
        ].map((section, i) => (
          <div key={i} className="card">
            <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>{section.title}</h3>
            {Array.isArray(section.content) ? (
              section.content.map((line, j) => (
                <div key={j} style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.8, marginBottom: 4 }}>
                  {line}
                </div>
              ))
            ) : (
              <div style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.8 }}>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ABOUT US PAGE ────────────────────────────────────────────────────────────
function AboutUsPage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">About SwapTn</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>Our Mission</h3>
        <p style={{ color: "var(--gray)", lineHeight: 1.8 }}>
          SwapTn is Tunisia's leading online marketplace for pre-loved fashion. We believe in giving clothes a second life, making sustainable fashion accessible to everyone, and creating economic opportunities for sellers across Tunisia.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>Our Story</h3>
        <p style={{ color: "var(--gray)", lineHeight: 1.8 }}>
          Founded in 2023, SwapTn started with a simple idea: connecting style-conscious Tunisians who wanted to buy and sell pre-owned fashion. What began as a passion project has grown into a thriving community of over 50,000 active users buying and selling authentic clothes, shoes, and accessories across Tunisia.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>Why SwapTn?</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { icon: "♻️", title: "Sustainable", desc: "Reduce fashion waste and promote circular economy" },
            { icon: "💚", title: "Affordable", desc: "Access quality brands at a fraction of retail price" },
            { icon: "✅", title: "Authentic", desc: "Verified sellers and authentic items guaranteed" },
            { icon: "🛡️", title: "Secure", desc: "Buyer protection and safe transactions" },
            { icon: "🤝", title: "Community", desc: "Join thousands of fashion lovers nationwide" },
            { icon: "💰", title: "Empowering", desc: "Earn money selling your unwanted clothes" }
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ fontSize: 24 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--dark)", marginBottom: 4 }}>{item.title}</div>
                <div style={{ color: "var(--gray)", fontSize: 14 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>Values We Live By</h3>
        <ul style={{ lineHeight: 2, color: "var(--gray)", fontSize: 14, marginLeft: 20 }}>
          <li><strong>Transparency:</strong> Honest descriptions, no hidden fees, clear communication</li>
          <li><strong>Trust:</strong> Every transaction is secure and protected</li>
          <li><strong>Quality:</strong> We verify authenticity and dispute resolution ensures satisfaction</li>
          <li><strong>Sustainability:</strong> Every sale keeps clothes out of landfills</li>
          <li><strong>Inclusivity:</strong> Accessible to everyone, from all backgrounds and budgets</li>
        </ul>
      </div>
    </div>
  );
}

// ─── BLOG PAGE ────────────────────────────────────────────────────────────────
function BlogPage({ setPage }) {
  const posts = [
    { title: "How to Spot Counterfeit Luxury Brands", date: "March 28, 2025", excerpt: "Learn the telltale signs of fake designer items and how to verify authenticity before buying..." },
    { title: "Sustainable Fashion: Your Guide to Pre-Loved Shopping", date: "March 20, 2025", excerpt: "Discover how buying pre-owned fashion reduces waste and helps the environment..." },
    { title: "10 Hidden Gems Under 50 TND Worth Adding to Your Wardrobe", date: "March 15, 2025", excerpt: "Uncover amazing fashion finds that won't break the bank on SwapTn..." },
    { title: "The Psychology of Pricing: Why Your Items Sell Better at 99 TND", date: "March 10, 2025", excerpt: "Understanding buyer behavior to optimize your listings and increase sales..." },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">📰 Blog</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Fashion tips, marketplace insights, and sustainability stories from the SwapTn community.</p>

      <div style={{ display: "grid", gap: 20 }}>
        {posts.map((post, i) => (
          <div key={i} className="card" style={{ cursor: "pointer", transition: "border-color 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--teal)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
            <div style={{ color: "var(--gray)", fontSize: 12, marginBottom: 8 }}>📅 {post.date}</div>
            <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18, fontWeight: 700 }}>{post.title}</h3>
            <p style={{ color: "var(--gray)", lineHeight: 1.6, marginBottom: 12 }}>{post.excerpt}</p>
            <button style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, padding: 0, cursor: "pointer", fontSize: 14 }}>Read More →</button>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(0,176,155,0.06)", border: "1px solid var(--teal)", borderRadius: 12, padding: 24, marginTop: 32, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 16 }}>Stay updated with SwapTn news and tips</p>
        <button style={{ background: "var(--teal)", color: "white", border: "none", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Subscribe to Newsletter →
        </button>
      </div>
    </div>
  );
}

// ─── CAREERS PAGE ─────────────────────────────────────────────────────────────
function CareersPage({ setPage }) {
  const jobs = [
    { title: "Product Manager", location: "Tunis", type: "Full-time" },
    { title: "Senior Full Stack Developer", location: "Remote", type: "Full-time" },
    { title: "Customer Support Specialist", location: "Tunis", type: "Full-time" },
    { title: "Marketing Manager", location: "Tunis", type: "Full-time" },
    { title: "Operations Coordinator", location: "Tunis", type: "Part-time" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">💼 Careers</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Join the SwapTn team and help us revolutionize sustainable fashion in Tunisia!</p>

      <div className="card" style={{ marginBottom: 24, background: "rgba(0,176,155,0.06)", borderColor: "var(--teal)" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>Why Join SwapTn?</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14, color: "var(--gray)" }}>
          <div>✓ Competitive salary & benefits</div>
          <div>✓ Remote work opportunities</div>
          <div>✓ Professional development</div>
          <div>✓ Collaborative culture</div>
          <div>✓ Impact on sustainability</div>
          <div>✓ Creative freedom</div>
        </div>
      </div>

      <h3 style={{ color: "var(--dark)", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Open Positions</h3>
      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        {jobs.map((job, i) => (
          <div key={i} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: "var(--gray)" }}>📍 {job.location} · {job.type}</div>
              </div>
              <button style={{ background: "var(--teal)", color: "white", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 16 }}>Don't see your role?</h3>
        <p style={{ color: "var(--gray)", marginBottom: 12 }}>We're always looking for talented individuals. Send your resume and portfolio to:</p>
        <div style={{ background: "rgba(0,176,155,0.06)", padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 500, color: "var(--teal)" }}>
          careers@swaptn.tn
        </div>
      </div>
    </div>
  );
}

// ─── PRESS PAGE ───────────────────────────────────────────────────────────────
function PressPage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">📢 Press & Media</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Media inquiries, press kit, and featured stories about SwapTn</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 16 }}>Press Contact</h3>
        <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
          <div><strong>Email:</strong> <span style={{ color: "var(--teal)" }}>press@swaptn.tn</span></div>
          <div><strong>Phone:</strong> <span style={{ color: "var(--teal)" }}>+216 XX XXX XXXX</span></div>
          <div><strong>Response Time:</strong> <span style={{ color: "var(--gray)" }}>Within 24 hours</span></div>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Featured In</h3>
      <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
        {[
          "🌟 Tunisia Tech Weekly - 'The Platform Changing Fashion Habits'",
          "🌟 Startup Africa - 'SwapTn: E-commerce Innovation'",
          "🌟 Sustainability Magazine - 'Pre-Loved Fashion Reduces Waste'",
          "🌟 entrepreneur.tn - 'Inside SwapTn's Growth Story'"
        ].map((mention, i) => (
          <div key={i} className="card">
            <div style={{ color: "var(--gray)", fontSize: 14 }}>{mention}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: "rgba(0,176,155,0.06)", borderColor: "var(--teal)" }}>
        <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 16 }}>📥 Download Press Kit</h3>
        <p style={{ color: "var(--gray)", fontSize: 14, marginBottom: 12 }}>Logo files, brand guidelines, and company information</p>
        <button style={{ background: "var(--teal)", color: "white", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Download Press Kit (PDF)
        </button>
      </div>
    </div>
  );
}

// ─── HELP CENTER PAGE ─────────────────────────────────────────────────────────
function HelpCenterPage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">Help Center</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Find answers to common questions about buying and selling on SwapTn</p>

      <div style={{ display: "grid", gap: 24 }}>
        {[
          {
            title: "🛍️ How to Buy Items",
            content: [
              "1. Browse our marketplace using categories or search for specific brands/items",
              "2. Click on an item to view details, photos, and seller information",
              "3. Add items to your cart or purchase directly",
              "4. Check out securely with multiple payment methods",
              "5. Track your order and receive your item safely"
            ]
          },
          {
            title: "💰 How to Sell Items",
            content: [
              "1. Click 'Sell' or 'List an Item' in the navigation",
              "2. Take clear photos of your item from multiple angles",
              "3. Add item details: title, brand, size, condition, description",
              "4. Set your price competitively",
              "5. Review and publish your listing",
              "6. Communicate with interested buyers via messages",
              "7. Ship the item once sold and get paid within 5-7 business days"
            ]
          },
          {
            title: "🔍 How to Use Search & Filters",
            content: [
              "• Use the search bar to find specific brands (e.g., 'Nike', 'Adidas')",
              "• Filter by Category: Tops, Bottoms, Dresses, Jackets, Shoes, Bags, Accessories",
              "• Filter by Condition: New or Used items",
              "• Filter by Size: Choose your preferred size",
              "• Filter by Price Range: Set minimum and maximum price",
              "• Sort by: Newest, Price (High to Low), or Price (Low to High)"
            ]
          },
          {
            title: "💳 Payment Methods",
            content: [
              "We accept multiple secure payment methods:",
              "• Credit/Debit Cards (Visa, Mastercard)",
              "• Online Banking",
              "• Mobile Wallets",
              "• Bank Transfers",
              "All transactions are secured with SSL encryption"
            ]
          },
          {
            title: "📦 Shipping & Delivery",
            content: [
              "• Standard Shipping: 5-7 business days (within Tunisia)",
              "• Express Shipping: 2-3 business days (available in major cities)",
              "• Free Returns: 30 days if item doesn't match description",
              "• Tracking: You'll receive tracking information for all shipments",
              "• Protection: Seller covers return shipping for defective items"
            ]
          },
          {
            title: "❓ Frequently Asked Questions",
            content: [
              "Q: Is my payment secure? - Yes, all payments are encrypted and PCI-DSS compliant.",
              "Q: Can I return an item? - Yes, you have 30 days for returns if item doesn't match description.",
              "Q: How long does delivery take? - Standard: 5-7 days. Express: 2-3 days.",
              "Q: What if I don't receive my order? - Contact our support team immediately for investigation.",
              "Q: Can I cancel a listing? - Yes, you can cancel anytime before the item is purchased."
            ]
          }
        ].map((section, i) => (
          <div key={i} className="card">
            <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>{section.title}</h3>
            {section.content.map((line, j) => (
              <div key={j} style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.8, marginBottom: 4 }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(0,176,155,0.06)", border: "1px solid var(--teal)", borderRadius: 12, padding: 24, marginTop: 32, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--gray)" }}>Didn't find what you're looking for?</p>
        <button onClick={() => setPage("contact-us")} style={{ background: "var(--teal)", color: "white", border: "none", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 12 }}>
          Contact Us →
        </button>
      </div>
    </div>
  );
}

// ─── CONTACT US PAGE ──────────────────────────────────────────────────────────
function ContactUsPage({ setPage }) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.subject && formData.message) {
      // In a real app, this would send to backend
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">Contact Us</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Have questions? We're here to help! Reach out to our support team.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
        {/* Contact Information */}
        <div>
          <h3 style={{ color: "var(--teal)", marginBottom: 20, fontSize: 16 }}>Get In Touch</h3>
          {[
            { icon: "📧", title: "Email", value: "support@swaptn.tn", desc: "Response within 24 hours" },
            { icon: "📱", title: "Phone", value: "+216 XX XXX XXXX", desc: "Mon-Fri: 10am-6pm CET" },
            { icon: "💬", title: "Live Chat", value: "Available in app", desc: "Instant support for members" },
            { icon: "🏢", title: "Hours", value: "Mon - Fri: 10am - 6pm", desc: "Closed on weekends & holidays" }
          ].map((contact, i) => (
            <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{contact.icon}</div>
              <div style={{ fontWeight: 600, color: "var(--dark)", marginBottom: 4 }}>{contact.title}</div>
              <div style={{ fontSize: 14, color: "var(--teal)", fontWeight: 500, marginBottom: 4 }}>{contact.value}</div>
              <div style={{ fontSize: 13, color: "var(--gray)" }}>{contact.desc}</div>
            </div>
          ))}

          <div style={{ background: "rgba(0,176,155,0.06)", border: "1px solid var(--teal)", borderRadius: 12, padding: 16, marginTop: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "var(--teal)" }}>Follow Us</div>
            <div style={{ display: "flex", gap: 12 }}>
              {["Facebook", "Instagram", "Twitter"].map(social => (
                <div key={social} style={{ fontSize: 24, cursor: "pointer" }}>
                  {social === "Facebook" && "📘"}{social === "Instagram" && "📷"}{social === "Twitter" && "𝕏"}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 style={{ color: "var(--teal)", marginBottom: 20, fontSize: 16 }}>Send us a Message</h3>
          {submitted && (
            <div style={{ background: "rgba(76,175,80,0.1)", border: "1px solid #4caf50", color: "#2e7d32", padding: 16, borderRadius: 8, marginBottom: 20 }}>
              ✓ Thank you! We've received your message. We'll get back to you within 24 hours.
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
            />
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
            />
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", minHeight: 120, resize: "vertical" }}
            />
            <button
              type="submit"
              disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
              style={{
                background: !formData.name || !formData.email || !formData.subject || !formData.message ? "var(--light-gray)" : "var(--teal)",
                color: !formData.name || !formData.email || !formData.subject || !formData.message ? "var(--gray)" : "white",
                border: "none", padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── SAFE BUYING PAGE ─────────────────────────────────────────────────────────
function SafeBuyingPage({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">Safe Buying Guide</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Learn how to shop safely and protect yourself on SwapTn</p>

      <div style={{ display: "grid", gap: 24 }}>
        {[
          {
            title: "✔️ How to Verify Sellers",
            tips: [
              "• Look for the ✓ Verified badge next to seller names",
              "• Check seller ratings and reviews from previous buyers",
              "• Read recent feedback - look for patterns of positive or negative comments",
              "• New sellers: Start with purchases under 100 TND until they build reputation",
              "• Avoid sellers with multiple complaints about authenticity or item condition"
            ]
          },
          {
            title: "🛡️ Secure Payment Methods",
            tips: [
              "• Always use SwapTn's payment system - NEVER use cash transfers",
              "• Use verified credit/debit cards - they offer fraud protection",
              "• Enable two-factor authentication on your account",
              "• Don't share your payment details via messages",
              "• Check SSL lock in your browser address bar for secure checkout",
              "• Keep transaction receipts for your records"
            ]
          },
          {
            title: "💡 Recognizing Scams",
            tips: [
              "• Prices that seem too good to be true (usually are)",
              "• Sellers who ask you to pay through unusual methods (wire transfers, gift cards)",
              "• Items described as 'payment upon receipt' - use SwapTn escrow instead",
              "• Pressure to buy quickly or extreme urgency",
              "• Requests to communicate outside SwapTn's messaging system",
              "• Photos that look professionally shot (likely stolen product images)"
            ]
          },
          {
            title: "🔍 Inspecting Item Photos",
            tips: [
              "• Request multiple photos from different angles",
              "• Look for flaws, stains, wear, or damage mentioned in sellers' photos",
              "• Ask for close-ups of specific areas if concerned",
              "• Reverse image search to confirm photos are original (not stolen)",
              "• Compare condition claims to photos - do they match?",
              "• Ask for photos in natural lighting if they look artificially lit"
            ]
          },
          {
            title: "📮 Secure Delivery",
            tips: [
              "• Use registered/tracked shipping - track your package",
              "• Never meet sellers in person for high-value items",
              "• Request signature confirmation for expensive purchases",
              "• Take photos of packaging when it arrives",
              "• Check item condition immediately upon receipt",
              "• Report any damage or theft to us within 48 hours",
              "• Keep all shipping receipts and tracking numbers"
            ]
          },
          {
            title: "⚖️ Dispute Resolution",
            tips: [
              "• Item not as described? Open a dispute within 30 days",
              "• Provide evidence: photos, messages, shipping receipts",
              "• Our support team will investigate and mediate",
              "• Most disputes resolved within 5-7 business days",
              "• Buyers protected by our Money-Back Guarantee",
              "• Escalate to customer service if needed"
            ]
          }
        ].map((section, i) => (
          <div key={i} className="card">
            <h3 style={{ color: "var(--teal)", marginBottom: 12, fontSize: 18 }}>{section.title}</h3>
            {section.tips.map((tip, j) => (
              <div key={j} style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.8, marginBottom: 4 }}>
                {tip}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(0,176,155,0.06)", border: "1px solid var(--teal)", borderRadius: 12, padding: 24, marginTop: 32 }}>
        <h3 style={{ color: "var(--teal)", marginBottom: 12 }}>Need Help?</h3>
        <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 16 }}>
          If you encounter a suspicious seller or have concerns about a transaction, report it to our support team immediately.
        </p>
        <button onClick={() => setPage("report-issue")} style={{ background: "var(--teal)", color: "white", border: "none", padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Report an Issue →
        </button>
      </div>
    </div>
  );
}

// ─── REPORT ISSUE PAGE ────────────────────────────────────────────────────────
function ReportIssuePage({ setPage }) {
  const [formData, setFormData] = useState({ issueType: "", listingId: "", description: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    "Counterfeit/Fake Item",
    "Item Not As Described",
    "Damaged Item",
    "Missing Item",
    "Fraudulent Seller",
    "Offensive Content",
    "Other"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.issueType && formData.description && formData.email) {
      console.log("Issue reported:", formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ issueType: "", listingId: "", description: "", email: "" });
      }, 3000);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">Report an Issue</h1>
      <p style={{ fontSize: 16, color: "var(--gray)", marginBottom: 32 }}>Help us maintain a safe and trustworthy marketplace. Report any issues you encounter.</p>

      <div className="card">
        {submitted && (
          <div style={{ background: "rgba(76,175,80,0.1)", border: "1px solid #4caf50", color: "#2e7d32", padding: 16, borderRadius: 8, marginBottom: 20 }}>
            ✓ Thank you for reporting! Our team will investigate your report within 24-48 hours.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "var(--dark)" }}>Issue Type *</label>
            <select
              value={formData.issueType}
              onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
              style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
            >
              <option value="">Select an issue type...</option>
              {issueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "var(--dark)" }}>Listing ID (if applicable)</label>
            <input
              type="text"
              placeholder="e.g., #12345"
              value={formData.listingId}
              onChange={(e) => setFormData({ ...formData, listingId: e.target.value })}
              style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "var(--dark)" }}>Description of Issue *</label>
            <textarea
              placeholder="Please describe the issue in detail. Include what happened, when it happened, and any relevant information..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, fontFamily: "inherit", minHeight: 140, resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "var(--dark)" }}>Email Address *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          <div style={{ background: "rgba(0,176,155,0.06)", border: "1px solid var(--teal)", borderRadius: 8, padding: 12, fontSize: 13, color: "var(--teal)" }}>
            💡 Tip: Provide as much detail as possible. Attach screenshots or photos if you have them.
          </div>

          <button
            type="submit"
            disabled={!formData.issueType || !formData.description || !formData.email}
            style={{
              background: !formData.issueType || !formData.description || !formData.email ? "var(--light-gray)" : "var(--teal)",
              color: !formData.issueType || !formData.description || !formData.email ? "var(--gray)" : "white",
              border: "none", padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8
            }}
          >
            Submit Report →
          </button>
        </form>

        <div style={{ borderTop: "1px solid var(--border)", marginTop: 24, paddingTop: 24 }}>
          <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 12 }}>
            <strong>What happens next?</strong>
          </p>
          <ul style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.8, marginLeft: 20 }}>
            <li>Our support team will review your report within 24-48 hours</li>
            <li>We'll investigate the issue and contact both parties if necessary</li>
            <li>Actions may include warnings, account suspension, or item removal</li>
            <li>We'll email you with the outcome of our investigation</li>
          </ul>
        </div>
      </div>
    </div>
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
  const [page, setPage] = useState(() => localStorage.getItem('swaptn_page') || "home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchVal, setSearchVal] = useState("");
  const [cart, setCart] = useState([]);
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
    cart, setCart, 
    wishlist, setWishlist, 
    user, setUser, 
    language, setLanguage,
    listings, setListings,
    loading,
    listingError,
    setPage,
    t: TRANSLATIONS[language]
  };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
      case "browse": return <BrowsePage setPage={setPage} setSelectedItem={setSelectedItem} selectedCategory={selectedCategory} language={language} listings={listings} loading={loading} searchVal={searchVal} setSearchVal={setSearchVal} />;
      case "item": return <ItemPage item={selectedItem} setPage={setPage} setSelectedSeller={setSelectedSeller} language={language} />;
      case "sell": return <SellPage setPage={setPage} language={language} />;
      case "cart": return <CartPage setPage={setPage} language={language} />;
      case "checkout": return <CheckoutPage setPage={setPage} language={language} />;
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
        <Navbar page={page} setPage={setPage} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} language={language} setLanguage={setLanguage} searchVal={searchVal} setSearchVal={setSearchVal} />
        {/* Quick Nav (mobile-friendly shortcut bar for demo) */}
        <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "8px 24px", display: "flex", gap: 6, overflowX: "auto", fontSize: 13 }}>
          {[["🏠 Home", "home"], ["🛍️ Browse", "browse"], ["❤️ Wishlist", "wishlist"], ["💬 Messages", "messages"], ["🔔 Notifications", "notifications"], ["👤 Profile", "profile"], ["📦 Sell", "sell"]].map(([label, p]) => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: "6px 16px", borderRadius: 50, border: "none", whiteSpace: "nowrap",
              background: page === p ? "var(--teal)" : "var(--light-gray)",
              color: page === p ? "white" : "var(--gray)",
              fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
            }}>{label}</button>
          ))}
        </div>
        <main style={{ flex: 1 }}>{renderPage()}</main>
        <Footer setPage={setPage} language={language} />
      </div>
    </AppContext.Provider>
  );
}
