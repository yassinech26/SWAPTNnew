import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import * as api from "./api";
import { MessagesPage as MessagesPageComponent } from "./MessagesPageFixed";

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
const AppContext = createContext();
const useApp = () => useContext(AppContext);

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

function Navbar({ page, setPage, selectedCategory, setSelectedCategory, language, setLanguage }) {
  const { cart, wishlist, user } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
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
        <div style={{ maxWidth: 500, position: "relative", width: "100%"}}>
          <input
            className="input-field"
            style={{ paddingLeft: 44, borderRadius: 50 }}
            placeholder="Search brands, items…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setPage("browse")}
          />
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--gray)", fontSize: 16 }}>🔍</span>
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

function BrowsePage({ setPage, setSelectedItem, selectedCategory, language, listings = [], loading = false }) {
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "All");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({ minPrice: "", maxPrice: "", condition: "", size: "", location: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setActiveCategory(selectedCategory || "All");
  }, [selectedCategory]);

  // Filter and sort listings
  let filtered = listings.filter(item => {
    const matchesSearch = search === "" || 
      item.title?.toLowerCase().includes(search.toLowerCase()) || 
      item.brand?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    
    const price = parseFloat(item.price) || 0;
    const matchesPrice = (!filters.minPrice || price >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || price <= parseFloat(filters.maxPrice));
    
    const matchesCondition = !filters.condition || item.condition === filters.condition;
    const matchesSize = !filters.size || item.size === filters.size;
    const matchesLocation = !filters.location || item.location === filters.location;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesCondition && matchesSize && matchesLocation;
  });

  // Sort
  if (sortBy === "price-asc") filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sortBy === "price-desc") filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sortBy === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        <input className="input-field" style={{ maxWidth: 400, borderRadius: 50 }} placeholder="🔍 Search items, brands…" value={search} onChange={e => setSearch(e.target.value)} />
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
            <button className="btn-secondary" style={{ width: "100%", padding: 12 }} onClick={() => setFilters({ minPrice: "", maxPrice: "", condition: "", size: "", location: "" })}>Clear Filters</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1.5s infinite" }}>⏳</div>
          <div>Loading items...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No items found</div>
          <div>Try adjusting your filters or search terms</div>
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

  // ✅ FIXED: Get seller info from owner object - with better fallbacks
  const sellerObj = item?.owner || { fullName: item?.seller || "Seller" };
  const seller = { 
    name: sellerObj?.fullName || sellerObj?.name || sellerObj?.seller || "Seller", 
    id: sellerObj?.id,
    avatar: sellerObj?.imageUrl || "https://i.pravatar.cc/150?img=1", 
    rating: 4.5, 
    sales: 10, 
    location: sellerObj?.city || sellerObj?.location || "Tunisia" 
  };
  
  // Debug log to see what we're receiving
  useEffect(() => {
    console.log("Item data:", { item, sellerObj, seller });
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

          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: 14 }} onClick={handleCart}>
              {addedToCart ? "✅ Added to Cart!" : "🛒 Add to Cart"}
            </button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: 14, background: "linear-gradient(135deg, #ff6b6b, #ee5a24)" }} onClick={() => setPage("checkout")}>
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
            setMessageSending(true);
            try {
              const conversation = await api.createConversation(item.id, seller.id);
              if (conversation?.id) {
                alert("✅ Conversation started! Redirecting to Messages...");
                setPage("messages");
              }
            } catch (err) {
              console.error("Conversation error:", err);
              alert("⚠️ " + (err.message || "Failed to start conversation"));
            } finally {
              setMessageSending(false);
            }
          }} disabled={messageSending}>
            {messageSending ? "⏳ Starting chat..." : "💬 Message Seller"}
          </button>

          {/* Seller */}
          <div style={{ background: "var(--light-gray)", borderRadius: "var(--radius)", padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
            <img src={seller.avatar} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} alt="" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{seller.name}</div>
              <div style={{ color: "var(--gray)", fontSize: 13 }}>⭐ {seller.rating} · {seller.sales} sales · {seller.location}</div>
            </div>
            <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => { setSelectedSeller(item.seller); setPage("seller"); }}>View Profile</button>
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[language];

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
                </div>
              ))}
              {[["Category", "category", CATEGORIES.slice(1)], ["Condition", "condition", CONDITIONS], ["Size", "size", SIZES]].map(([label, key, opts]) => (
                <div key={key}>
                  <label htmlFor={`sell-${key}`} style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                  <select id={`sell-${key}`} className="input-field" value={form[key]} onChange={e => update(key, e.target.value)}>
                    <option value="">Select {label.toLowerCase()}</option>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label htmlFor="sell-description" style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
                <textarea id="sell-description" className="input-field" rows={4} placeholder="Describe any details, measurements, or flaws…" value={form.description} onChange={e => update("description", e.target.value)} style={{ resize: "vertical" }} />
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
          {step < 4 && <button className="btn-primary" style={{ flex: 1, padding: 14, justifyContent: "center" }} onClick={() => setStep(s => s + 1)} disabled={loading}>Continue →</button>}
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

function SellerPage({ setPage, sellerUsername, language }) {
  const t = TRANSLATIONS[language];
  const seller = { name: sellerUsername || "Seller", avatar: "https://i.pravatar.cc/150?img=1", bio: "Seller profile", rating: 4.5, sales: 0, followers: 0, location: "Tunisia" };
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
            <button className="btn-secondary">👤 Follow</button>
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
  const notifs = [
    { icon: "❤️", text: "mehdi_y liked your Nike Air Force 1 listing", time: "5 min ago", unread: true },
    { icon: "💬", text: "New message from Yassine_ch about Mango Blazer", time: "12 min ago", unread: true },
    { icon: "💸", text: "Your item Zara Floral Dress was sold for 18 TND!", time: "2 hours ago", unread: true },
    { icon: "⭐", text: "mouldi_h left you a 5-star review", time: "1 day ago", unread: false },
    { icon: "📦", text: "Your order has been shipped! Track it now.", time: "2 days ago", unread: false },
    { icon: "🔔", text: "New items from sellers you follow", time: "3 days ago", unread: false },
  ];

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

function Footer({ setPage, language }) {
  const t = TRANSLATIONS[language];
  return (
    <footer style={{ background: "var(--dark)", color: "white", padding: "60px 24px 32px", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, color: "var(--teal)", marginBottom: 12 }}>SwapTn</div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7 }}>Tunisia's #1 marketplace for pre-loved fashion. Shop sustainably, sell effortlessly.</p>
          </div>
          {[
            { title: "Discover", links: ["New Arrivals", "Popular Brands", "Categories", "Sales & Deals"] },
            { title: "Sell", links: ["List an Item", "Seller Guide", "Pricing Tips", "Shipping"] },
            { title: "Support", links: ["Help Center", "Contact Us", "Safe Buying", "Report an Issue"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontWeight: 700, marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map(l => <span key={l} onClick={() => setPage("home")} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "var(--teal)"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}>{l}</span>)}
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
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("en");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Load user from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    try {
      if (api.isLoggedIn()) {
        const savedUser = localStorage.getItem('swaptn_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
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
        const data = await api.fetchListings();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
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
    loading
  };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
      case "browse": return <BrowsePage setPage={setPage} setSelectedItem={setSelectedItem} selectedCategory={selectedCategory} language={language} listings={listings} loading={loading} />;
      case "item": return <ItemPage item={selectedItem} setPage={setPage} setSelectedSeller={setSelectedSeller} language={language} />;
      case "sell": return <SellPage setPage={setPage} language={language} />;
      case "cart": return <CartPage setPage={setPage} language={language} />;
      case "checkout": return <CheckoutPage setPage={setPage} language={language} />;
      case "wishlist": return <WishlistPage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
      case "messages": return <MessagesPageComponent language={language} setPage={setPage} user={user} TRANSLATIONS={TRANSLATIONS} />;
      case "profile": return <ProfilePage setPage={setPage} setSelectedItem={setSelectedItem} setUser={setUser} language={language} listings={listings} />;
      case "seller": return <SellerPage setPage={setPage} sellerUsername={selectedSeller} language={language} />;
      case "login": return <LoginPage setPage={setPage} language={language} />;
      case "notifications": return <NotificationsPage language={language} setPage={setPage} />;
      default: return <HomePage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
    }
  };

  return (
    <AppContext.Provider value={ctx}>
      <style>{globalStyle}</style>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar page={page} setPage={setPage} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} language={language} setLanguage={setLanguage} />
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
