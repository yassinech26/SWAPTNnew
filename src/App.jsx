import { useState, useEffect, createContext, useContext, useRef } from "react";

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const ITEMS = [
  { id: 1, title: "Levi's 501 Jeans", price: 28, size: "M", brand: "Levi's", condition: "Used", category: "Bottoms", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", seller: "yassine_ch", likes: 14, location: "Bardo" },
  { id: 2, title: "Nike Air Force 1 White", price: 55, size: "42", brand: "Nike", condition: "New", category: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", seller: "mehdi_y", likes: 32, location: "Korba" },
  { id: 3, title: "Zara Floral Dress", price: 18, size: "S", brand: "Zara", condition: "New", category: "Dresses", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80", seller: "mouldi_h", likes: 21, location: "Korba" },
  { id: 4, title: "H&M Oversized Hoodie", price: 12, size: "L", brand: "H&M", condition: "Used", category: "Tops", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80", seller: "ahmed_k", likes: 8, location: "Tunis" },
  { id: 5, title: "Adidas Track Jacket", price: 35, size: "M", brand: "Adidas", condition: "New", category: "Jackets", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", seller: "ines_t", likes: 19, location: "Bizerte" },
  { id: 6, title: "Mango Blazer Beige", price: 42, size: "S", brand: "Mango", condition: "New", category: "Jackets", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=400&q=80", seller: "yassine_ch", likes: 27, location: "Bardo" },
  { id: 7, title: "Converse Chuck Taylor", price: 30, size: "38", brand: "Converse", condition: "Used", category: "Shoes", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80", seller: "youssef_r", likes: 15, location: "Nabeul" },
  { id: 8, title: "Pull&Bear Mom Jeans", price: 16, size: "XS", brand: "Pull&Bear", condition: "Used", category: "Bottoms", image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400&q=80", seller: "mouldi_h", likes: 11, location: "Korba" },
  { id: 9, title: "Tommy Hilfiger Polo", price: 22, size: "L", brand: "Tommy Hilfiger", condition: "New", category: "Tops", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80", seller: "mehdi_y", likes: 9, location: "Korba" },
  { id: 10, title: "Vintage Leather Bag", price: 65, size: "One size", brand: "Vintage", condition: "Used", category: "Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", seller: "mariem_s", likes: 44, location: "Tunis" },
  { id: 11, title: "Bershka Mini Skirt", price: 9, size: "XS", brand: "Bershka", condition: "Used", category: "Bottoms", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80", seller: "ines_t", likes: 17, location: "Tunis" },
  { id: 12, title: "New Balance 574", price: 48, size: "40", brand: "New Balance", condition: "New", category: "Shoes", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80", seller: "ahmed_k", likes: 36, location: "Monastir" },
];

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Jackets", "Shoes", "Bags", "Accessories"];
const CONDITIONS = ["New", "Used"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "38", "40", "42", "44", "One size"];
const LOCATIONS = ["Ariana", "Bardo", "Ben Arous", "Bizerte", "Gabes", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kebili", "Kelibia", "Kerkennah", "Korba", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];

const USERS = {
  rayen: { name: "Rayen", avatar: "https://scontent.ftun15-1.fna.fbcdn.net/v/t39.30808-6/565809477_2330855203999506_8553157376258815417_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=reaYhHMc4bQQ7kNvwE3vlIG&_nc_oc=AdnUz9KY9lTV5VTNBUPC1jWuTfSS4CuN6K7w8cZ3PpacYTJh5Pw2G_rgQuC02cUYcfs&_nc_zt=23&_nc_ht=scontent.ftun15-1.fna&_nc_gid=-DVT1clr4fuenoxOik7ExA&oh=00_AftFxnTkBH5x9Da4pr7tnU8H9wvm4oFMkx4Ey3QwIioZjg&oe=69A2C5B3", rating: 4.9, sales: 12, location: "Kelibia", bio: "Fashion seller", joined: "2024", followers: 45, following: 32, email: "rayen@example.com", password: "rayen123" },
  yassine_ch: { name: "Yassine Cherif.", avatar: "https://scontent.ftun1-2.fna.fbcdn.net/v/t39.30808-1/514470781_2161843794240699_2700375031450333626_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=nI2chN1pzJYQ7kNvwEyhri5&_nc_oc=AdlYjCrQedy4aE33mbwiXfCuNoKsKzt9mFKpazaLE0louUeaV4DSOUpLQl9kvHPlgmA&_nc_zt=24&_nc_ht=scontent.ftun1-2.fna&_nc_gid=Sv9X9eRzBb9wkfZ3pa4pmQ&_nc_ss=8&oh=00_AfyZk409Ni8aB3gP0W-z1mSHJiAI779pByAJ0wXPXk94LA&oe=69ACB87B", rating: 4.9, sales: 47, location: "Bardo", bio: "Fashion lover. Selling to make space in my wardrobe", joined: "2022", followers: 120, following: 88, email: "yassine@example.com", password: "yassine123" },
  mehdi_y: { name: "Mehdi yedees.", avatar: "https://scontent.ftun1-2.fna.fbcdn.net/v/t39.30808-6/490654903_1379431153244589_1328918101645009794_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=-sZ4mK3mrksQ7kNvwFcqutR&_nc_oc=AdnlJMAbCNCH52EvrLxeBr16RM_VwPa8BmfrJ7VRGT0PNTw1E1wVuOtzxTo92FbcbK0&_nc_zt=23&_nc_ht=scontent.ftun1-2.fna&_nc_gid=BmAkOx5SCgyBy3PVWWMVcw&_nc_ss=8&oh=00_AfyRZMVv657cQYYMdtmqVhIVLVtYR3C89KLNylsO-ZjdnQ&oe=69ACC322", rating: 4.7, sales: 23, location: "Korba", bio: "Sneakerhead & streetwear enthusiast", joined: "2023", followers: 65, following: 42, email: "mehdi@example.com", password: "mehdi123" },
  mouldi_h: { name: "Mouldi hemdene.", avatar: "https://i.pravatar.cc/150?img=13", rating: 5.0, sales: 88, location: "Korba", bio: "Sustainable fashion advocate ♻️", joined: "2021", followers: 230, following: 145, email: "mouldi@example.com", password: "mouldi123" },
};

const MESSAGES = [
  { id: 1, user: "yassine_ch", recipient: "rayen", avatar: "https://scontent.ftun1-2.fna.fbcdn.net/v/t39.30808-1/514470781_2161843794240699_2700375031450333626_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=nI2chN1pzJYQ7kNvwEyhri5&_nc_oc=AdlYjCrQedy4aE33mbwiXfCuNoKsKzt9mFKpazaLE0louUeaV4DSOUpLQl9kvHPlgmA&_nc_zt=24&_nc_ht=scontent.ftun1-2.fna&_nc_gid=Sv9X9eRzBb9wkfZ3pa4pmQ&_nc_ss=8&oh=00_AfyZk409Ni8aB3gP0W-z1mSHJiAI779pByAJ0wXPXk94LA&oe=69ACB87B", lastMessage: "Is this still available?", time: "2m", unread: true, item: "Mango Blazer Beige" },
  { id: 2, user: "mehdi_y", recipient: "rayen", avatar: "https://scontent.ftun1-2.fna.fbcdn.net/v/t39.30808-6/490654903_1379431153244589_1328918101645009794_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=-sZ4mK3mrksQ7kNvwFcqutR&_nc_oc=AdnlJMAbCNCH52EvrLxeBr16RM_VwPa8BmfrJ7VRGT0PNTw1E1wVuOtzxTo92FbcbK0&_nc_zt=23&_nc_ht=scontent.ftun1-2.fna&_nc_gid=BmAkOx5SCgyBy3PVWWMVcw&_nc_ss=8&oh=00_AfyRZMVv657cQYYMdtmqVhIVLVtYR3C89KLNylsO-ZjdnQ&oe=69ACC322", lastMessage: "Can you do 45 TND?", time: "1h", unread: true, item: "Nike Air Force 1" },
  { id: 3, user: "mouldi_h", recipient: "yassine_ch", avatar: "https://i.pravatar.cc/150?img=13", lastMessage: "Thank you! 🌸", time: "3h", unread: false, item: "Zara Floral Dress" },
  { id: 4, user: "rayen", recipient: "mehdi_y", avatar: "https://scontent.ftun15-1.fna.fbcdn.net/v/t39.30808-6/565809477_2330855203999506_8553157376258815417_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=reaYhHMc4bQQ7kNvwE3vlIG&_nc_oc=AdnUz9KY9lTV5VTNBUPC1jWuTfSS4CuN6K7w8cZ3PpacYTJh5Pw2G_rgQuC02cUYcfs&_nc_zt=23&_nc_ht=scontent.ftun15-1.fna&_nc_gid=-DVT1clr4fuenoxOik7ExA&oh=00_AftFxnTkBH5x9Da4pr7tnU8H9wvm4oFMkx4Ey3QwIioZjg&oe=69A2C5B3", lastMessage: "What's the best price?", time: "30m", unread: false, item: "Nike Air Force 1" },
];

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
    details: "Details", seller: "Seller", location: "Location", condition: "Condition", 
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
    details: "Détails", seller: "Vendeur", location: "Lieu", condition: "État",
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
  const userMessageCount = user ? MESSAGES.filter(msg => 
    msg.user === (user?.username || user?.email) || msg.recipient === (user?.username || user?.email)
  ).length : 0;

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
        <div style={{ maxWidth: 500, position: "relative", width: "100%", maxWidth: 500 }}>
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
              <button className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.5)", color: "white", padding: "14px 32px", fontSize: 16 }} onClick={() => setPage("sell")}>
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
          {/* Hero Cards */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 440 }}>
            {ITEMS.slice(0, 4).map((item, i) => (
              <div key={item.id} onClick={() => { setSelectedItem(item); setPage("item"); }}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 16, overflow: "hidden",
                  cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)",
                  transform: `translateY(${i % 2 === 0 ? 0 : 16}px)`,
                  transition: "transform 0.25s"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = `translateY(${i % 2 === 0 ? -4 : 12}px)`}
                onMouseLeave={e => e.currentTarget.style.transform = `translateY(${i % 2 === 0 ? 0 : 16}px)`}
              >
                <img src={item.image} style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} alt="" />
                <div style={{ padding: 10, color: "white" }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{item.price} TND</div>
                </div>
              </div>
            ))}
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

      {/* Featured Items */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900 }}>{t.newArrivals}</h2>
          <button className="btn-secondary" onClick={() => setPage("browse")}>{t.seeAll}</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {ITEMS.map(item => (
            <ItemCard key={item.id} item={item} onClick={() => { setSelectedItem(item); setPage("item"); }} />
          ))}
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

function BrowsePage({ setPage, setSelectedItem, selectedCategory, language }) {
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "All");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({ minPrice: "", maxPrice: "", condition: "", size: "", location: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setActiveCategory(selectedCategory || "All");
  }, [selectedCategory]);

  const filtered = ITEMS.filter(item => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchMin = !filters.minPrice || item.price >= Number(filters.minPrice);
    const matchMax = !filters.maxPrice || item.price <= Number(filters.maxPrice);
    const matchCond = !filters.condition || item.condition === filters.condition;
    const matchSize = !filters.size || item.size === filters.size;
    const matchLoc = !filters.location || item.location === filters.location;
    return matchSearch && matchCat && matchMin && matchMax && matchCond && matchSize && matchLoc;
  });

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
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
              <input className="input-field" type="number" placeholder="0" value={filters[key]} onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Condition</label>
            <select className="input-field" value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))}>
              <option value="">Any condition</option>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Size</label>
            <select className="input-field" value={filters.size} onChange={e => setFilters(f => ({ ...f, size: e.target.value }))}>
              <option value="">Any size</option>
              {SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>Location</label>
            <select className="input-field" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
              <option value="">All locations</option>
              {LOCATIONS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn-secondary" style={{ width: "100%", padding: 12 }} onClick={() => setFilters({ minPrice: "", maxPrice: "", condition: "", size: "", location: "" })}>Clear Filters</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        {filtered.sort((a, b) => {
          if (sortBy === "price-asc") return a.price - b.price;
          if (sortBy === "price-desc") return b.price - a.price;
          if (sortBy === "popular") return b.likes - a.likes;
          return 0; // newest (default order)
        }).map(item => (
          <ItemCard key={item.id} item={item} onClick={() => { setSelectedItem(item); setPage("item"); }} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0", color: "var(--gray)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No items found</div>
            <div>Try adjusting your filters</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ItemPage({ item, setPage, setSelectedSeller, language }) {
  const t = TRANSLATIONS[language];
  const { cart, setCart, wishlist, setWishlist } = useApp();
  const [liked, setLiked] = useState(wishlist.some(i => i.id === item.id));
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const seller = USERS[item.seller] || { name: item.seller, avatar: "https://i.pravatar.cc/150?img=1", rating: 4.5, sales: 10 };
  const imgs = [item.image, ...ITEMS.filter(i => i.id !== item.id).slice(0, 2).map(i => i.image)];

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
          <button className="btn-secondary" style={{ width: "100%", padding: 12, marginBottom: 32, justifyContent: "center", display: "flex", gap: 8 }} onClick={() => setPage("messages")}>
            💬 Message Seller
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

      {/* Similar Items */}
      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, marginBottom: 24 }}>You May Also Like</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {ITEMS.filter(i => i.id !== item.id).slice(0, 4).map(i => <ItemCard key={i.id} item={i} onClick={() => {}} />)}
        </div>
      </div>
    </div>
  );
}

function SellPage({ setPage, language }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", category: "", brand: "", size: "", condition: "", price: "", description: "", images: [] });
  const fileInputRef = useRef(null);
  const t = TRANSLATIONS[language];

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhotoSelect = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      update("images", newImages);
    }
  };

  const steps = ["📸 " + t.addPhotos, "📝 " + t.itemDetails, "💰 " + t.setPrice, "✅ " + t.reviewPublish];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <h1 className="page-header">{t.listItem}</h1>
      <p style={{ color: "var(--gray)", marginBottom: 32 }}>{t.turnUnused}</p>

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
            <div style={{
              border: "2px dashed var(--border)", borderRadius: "var(--radius)",
              padding: "60px 24px", textAlign: "center", cursor: "pointer",
              transition: "border-color 0.2s", marginBottom: 16,
              background: "var(--light-gray)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.dragDropPhotos}</div>
              <div style={{ color: "var(--gray)", fontSize: 14, marginBottom: 16 }}>{t.clickBrowse}</div>
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handlePhotoSelect} 
                style={{ display: "none" }} 
              />
              <button 
                className="btn-secondary" 
                style={{ padding: "10px 24px" }}
                onClick={() => fileInputRef.current?.click()}
              >
                {t.choosePhotos}
              </button>
            </div>
            {form.images.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Selected Photos ({form.images.length})</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12 }}>
                  {form.images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                      <img src={img} style={{ width: "100%", height: 100, objectFit: "cover" }} alt={`Selected ${idx + 1}`} />
                      <button 
                        onClick={() => update("images", form.images.filter((_, i) => i !== idx))}
                        style={{
                          position: "absolute", top: 4, right: 4,
                          background: "rgba(0,0,0,0.6)", color: "white",
                          border: "none", borderRadius: "50%", width: 24, height: 24,
                          cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p style={{ color: "var(--gray)", fontSize: 13, marginTop: 16 }}>💡 Tip: Good lighting and multiple angles get 3x more views!</p>
          </div>
        )}
        {step === 2 && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Item Details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[["Title", "title", "e.g. Zara Blue Linen Blouse"], ["Brand", "brand", "e.g. Zara, H&M, Nike..."]].map(([label, key, ph]) => (
                <div key={key}>
                  <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                  <input className="input-field" placeholder={ph} value={form[key]} onChange={e => update(key, e.target.value)} />
                </div>
              ))}
              {[["Category", "category", CATEGORIES.slice(1)], ["Condition", "condition", CONDITIONS], ["Size", "size", SIZES]].map(([label, key, opts]) => (
                <div key={key}>
                  <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
                  <select className="input-field" value={form[key]} onChange={e => update(key, e.target.value)}>
                    <option value="">Select {label.toLowerCase()}</option>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
                <textarea className="input-field" rows={4} placeholder="Describe any details, measurements, or flaws…" value={form.description} onChange={e => update("description", e.target.value)} style={{ resize: "vertical" }} />
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
            <button className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16, justifyContent: "center" }} onClick={() => setPage("profile")}>
              🚀 Publish Listing
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          {step > 1 && <button className="btn-secondary" style={{ flex: 1, padding: 14 }} onClick={() => setStep(s => s - 1)}>← Back</button>}
          {step < 4 && <button className="btn-primary" style={{ flex: 1, padding: 14, justifyContent: "center" }} onClick={() => setStep(s => s + 1)}>Continue →</button>}
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
                    <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>{l}</label>
                    <input className="input-field" type={t} placeholder={l} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
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
                    <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Card Number</label>
                    <input className="input-field" placeholder="1234 5678 9012 3456" value={form.cardNum} onChange={e => setForm(f => ({ ...f, cardNum: e.target.value }))} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Expiry</label>
                      <input className="input-field" placeholder="MM/YY" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>CVV</label>
                      <input className="input-field" placeholder="123" type="password" value={form.cvv} onChange={e => setForm(f => ({ ...f, cvv: e.target.value }))} />
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

function MessagesPage({ language }) {
  const t = TRANSLATIONS[language];
  const { user } = useApp();
  const [activeChat, setActiveChat] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [chats, setChats] = useState({
    1: [{ from: "them", text: "Is this still available?", time: "2m ago" }, { from: "me", text: "Yes it is! Feel free to make an offer 😊", time: "1m ago" }],
    2: [{ from: "them", text: "Can you do 45 TND?", time: "1h ago" }],
    3: [{ from: "them", text: "Thank you! 🌸", time: "3h ago" }, { from: "me", text: "Thank you for your purchase! Hope you enjoy it ❤️", time: "3h ago" }],
    4: [{ from: "me", text: "What's the best price?", time: "30m ago" }, { from: "them", text: "I can do 50 TND", time: "25m ago" }],
  });

  const userMessages = MESSAGES.filter(msg => 
    msg.user === (user?.username || user?.email) || msg.recipient === (user?.username || user?.email)
  ).map(msg => {
    // Determine who the "other person" is in this conversation
    const currentUser = user?.username || user?.email;
    const otherUser = msg.user === currentUser ? msg.recipient : msg.user;
    const otherUserAvatar = USERS[otherUser]?.avatar || msg.avatar;
    return { ...msg, otherUser, avatar: otherUserAvatar };
  }).filter((msg, index, self) => {
    // Deduplicate conversations (only keep first message for each conversation pair)
    const pair = [msg.user, msg.recipient].sort().join("-");
    const firstIndex = self.findIndex(m => [m.user, m.recipient].sort().join("-") === pair);
    return firstIndex === index;
  });

  useEffect(() => {
    if (userMessages.length > 0 && !activeChat) {
      setActiveChat(userMessages[0]);
    }
  }, [userMessages, activeChat]);

  const sendMsg = () => {
    if (!msgInput.trim()) return;
    setChats(c => ({ ...c, [activeChat.id]: [...(c[activeChat.id] || []), { from: "me", text: msgInput, time: "just now" }] }));
    setMsgInput("");
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <h1 className="page-header">Messages</h1>
      {!user ? (
        <div style={{ background: "white", borderRadius: "var(--radius)", padding: 40, textAlign: "center", boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sign in to view messages</div>
          <div style={{ color: "var(--gray)", marginBottom: 24 }}>You need to be logged in to access your conversations</div>
        </div>
      ) : userMessages.length === 0 ? (
        <div style={{ background: "white", borderRadius: "var(--radius)", padding: 40, textAlign: "center", boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No conversations yet</div>
          <div style={{ color: "var(--gray)" }}>Start a conversation by messaging a seller</div>
        </div>
      ) : (
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 0, background: "white", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden", height: 560 }}>
        {/* Conversation List */}
        <div style={{ borderRight: "1px solid var(--border)", overflowY: "auto" }}>
          {userMessages.map(msg => (
            <div key={msg.id} onClick={() => setActiveChat(msg)} style={{
              display: "flex", gap: 12, padding: 16, cursor: "pointer", borderBottom: "1px solid var(--border)",
              background: activeChat?.id === msg.id ? "var(--teal-light)" : "white", transition: "background 0.2s"
            }}>
              <div style={{ position: "relative" }}>
                <img src={msg.avatar} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} alt="" />
                {msg.unread && <div style={{ position: "absolute", top: 0, right: 0, width: 12, height: 12, background: "var(--teal)", borderRadius: "50%", border: "2px solid white" }} />}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{msg.otherUser}</span>
                  <span style={{ fontSize: 12, color: "var(--gray)" }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--gray)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{msg.lastMessage}</div>
                <div style={{ fontSize: 11, color: "var(--teal)", marginTop: 2 }}>Re: {msg.item}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {activeChat && (
            <>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <img src={activeChat.avatar} style={{ width: 40, height: 40, borderRadius: "50%" }} alt="" />
                <div>
                  <div style={{ fontWeight: 700 }}>{activeChat.otherUser}</div>
                  <div style={{ fontSize: 12, color: "var(--gray)" }}>Re: {activeChat.item}</div>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {(chats[activeChat.id] || []).map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "70%", padding: "10px 16px", borderRadius: 18,
                      background: msg.from === "me" ? "var(--teal)" : "var(--light-gray)",
                      color: msg.from === "me" ? "white" : "var(--dark)",
                      fontSize: 14
                    }}>
                      <div>{msg.text}</div>
                      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, textAlign: "right" }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
                <input className="input-field" style={{ flex: 1, borderRadius: 50 }} placeholder="Type a message…" value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} />
                <button className="btn-primary" style={{ padding: "10px 20px" }} onClick={sendMsg}>Send ➤</button>
              </div>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

function ProfilePage({ setPage, setUser, language }) {
  const t = TRANSLATIONS[language];
  const { user } = useApp();
  const [tab, setTab] = useState("listings");
  const userItems = ITEMS.slice(0, 4);
  const u = user || { name: "Rayen", avatar: "https://scontent.ftun15-1.fna.fbcdn.net/v/t39.30808-6/565809477_2330855203999506_8553157376258815417_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=reaYhHMc4bQQ7kNvwE3vlIG&_nc_oc=AdnUz9KY9lTV5VTNBUPC1jWuTfSS4CuN6K7w8cZ3PpacYTJh5Pw2G_rgQuC02cUYcfs&_nc_zt=23&_nc_ht=scontent.ftun15-1.fna&_nc_gid=-DVT1clr4fuenoxOik7ExA&oh=00_AftFxnTkBH5x9Da4pr7tnU8H9wvm4oFMkx4Ey3QwIioZjg&oe=69A2C5B3", rating: 4.9, sales: 12, location: "Kelibia", bio: "fashion seller", followers: 45, following: 32 };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
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
            <button className="btn-secondary" style={{ padding: "10px 24px" }}>Edit Profile</button>
            <button className="btn-secondary" style={{ padding: "10px 24px", color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => { setUser(null); setPage("home"); }}>Déconnexion</button>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, animation: "fadeIn 0.3s ease" }}>
          {userItems.map(item => <ItemCard key={item.id} item={item} onClick={() => {}} />)}
        </div>
      )}
      {tab === "sold" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.3s ease" }}>
          {ITEMS.slice(4, 7).map(item => (
            <div key={item.id} className="card" style={{ display: "flex", gap: 16, padding: 16, alignItems: "center" }}>
              <img src={item.image} style={{ width: 64, height: 64, borderRadius: "var(--radius-sm)", objectFit: "cover" }} alt="" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ color: "var(--gray)", fontSize: 14 }}>Sold on Jan {10 + item.id}, 2025</div>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "var(--teal-dark)" }}>{item.price} TND</span>
              <span className="badge">✅ Sold</span>
            </div>
          ))}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.3s ease" }}>
          {ITEMS.slice(1, 4).map((item, i) => (
            <div key={item.id} className="card" style={{ display: "flex", gap: 16, padding: 16, alignItems: "center" }}>
              <img src={item.image} style={{ width: 64, height: 64, borderRadius: "var(--radius-sm)", objectFit: "cover" }} alt="" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ color: "var(--gray)", fontSize: 14 }}>From: {item.seller}</div>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "var(--teal-dark)" }}>{item.price} TND</span>
              <span className={`badge ${i === 0 ? "" : i === 1 ? "" : "badge-coral"}`}>{["🚚 Shipped", "⏳ Processing", "✅ Delivered"][i]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SellerPage({ setPage, sellerUsername, language }) {
  const t = TRANSLATIONS[language];
  const seller = USERS[sellerUsername] || USERS["mouldi_h"];
  const items = ITEMS.filter(i => i.seller === sellerUsername);

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
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, marginBottom: 20 }}>{seller.name.split(" ")[0]}'s Listings ({items.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
        {items.map(item => <ItemCard key={item.id} item={item} onClick={() => setPage("item")} />)}
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

  const handle = () => {
    setError("");
    
    if (isLogin) {
      // Find user by email and validate password
      const foundUser = Object.entries(USERS).find(([key, user]) => user.email === form.email);
      
      if (!foundUser) {
        setError("Email not found");
        return;
      }
      
      const [username, userData] = foundUser;
      if (userData.password !== form.password) {
        setError("Invalid password");
        return;
      }
      
      setUser({ ...userData, username });
      setPage("home");
    } else {
      // For signup, check if email already exists
      const emailExists = Object.values(USERS).some(user => user.email === form.email);
      
      if (emailExists) {
        setError("Email already registered");
        return;
      }
      
      if (!form.name || !form.email || !form.password) {
        setError("Please fill all fields");
        return;
      }
      
      // Create new user (in real app, would save to database)
      setUser({ name: form.name, email: form.email, avatar: "https://i.pravatar.cc/150?img=50", rating: 0, sales: 0, location: "Tunisia", bio: "New seller", joined: new Date().getFullYear().toString(), followers: 0, following: 0 });
      setPage("home");
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.4s ease" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, var(--teal), var(--teal-dark))", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "white", fontWeight: 900, margin: "0 auto 16px" }}>V</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 900 }}>{isLogin ? "Welcome back!" : "Join SwapTn"}</h1>
          <p style={{ color: "var(--gray)", marginTop: 8 }}>{isLogin ? "Sign in to your account" : "Create your free account"}</p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          {/* Social Logins */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <button onClick={handle} style={{
              padding: 12, border: "2px solid var(--border)", borderRadius: "var(--radius-sm)",
              background: "white", cursor: "pointer", fontWeight: 600, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "border-color 0.2s", width: 160
            }}>🌐 Google</button>
          </div>
          <div style={{ textAlign: "center", color: "var(--gray)", fontSize: 13, marginBottom: 20 }}>— or with email —</div>

          {error && <div style={{ background: "#fff0f0", border: "1px solid var(--coral)", color: "var(--coral)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: 14, fontWeight: 500, textAlign: "center" }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Full Name</label>
                <input className="input-field" placeholder="Yassine cherif" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
          </div>

          {isLogin && <div style={{ textAlign: "right", marginTop: 8 }}><a href="#" style={{ color: "var(--teal)", fontSize: 13, fontWeight: 500 }}>Forgot password?</a></div>}

          <button className="btn-primary" style={{ width: "100%", marginTop: 24, padding: 14, fontSize: 16, justifyContent: "center" }} onClick={handle}>
            {isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "var(--gray)", fontSize: 14 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(""); setForm({ email: "", password: "", name: "" }); }} style={{ color: "var(--teal)", fontWeight: 600, cursor: "pointer" }}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

function NotificationsPage({ language }) {
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
  const [page, setPage] = useState("home");
  const [selectedItem, setSelectedItem] = useState(ITEMS[0]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("en");

  const ctx = { cart, setCart, wishlist, setWishlist, user, setUser, language, setLanguage };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
      case "browse": return <BrowsePage setPage={setPage} setSelectedItem={setSelectedItem} selectedCategory={selectedCategory} language={language} />;
      case "item": return <ItemPage item={selectedItem} setPage={setPage} setSelectedSeller={setSelectedSeller} language={language} />;
      case "sell": return <SellPage setPage={setPage} language={language} />;
      case "cart": return <CartPage setPage={setPage} language={language} />;
      case "checkout": return <CheckoutPage setPage={setPage} language={language} />;
      case "wishlist": return <WishlistPage setPage={setPage} setSelectedItem={setSelectedItem} language={language} />;
      case "messages": return <MessagesPage language={language} />;
      case "profile": return <ProfilePage setPage={setPage} setUser={setUser} language={language} />;
      case "seller": return <SellerPage setPage={setPage} sellerUsername={selectedSeller} language={language} />;
      case "login": return <LoginPage setPage={setPage} language={language} />;
      case "notifications": return <NotificationsPage language={language} />;
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
