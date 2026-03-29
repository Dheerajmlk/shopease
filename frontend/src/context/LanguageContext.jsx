import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Navbar
    deliverTo: "Deliver to",
    india: "India",
    searchPlaceholder: "Search ShopEase",
    hello: "Hello",
    signIn: "sign in",
    account: "Account",
    returns: "Returns",
    orders: "& Orders",
    cart: "Cart",
    myOrders: "My Orders",
    wishlist: "Wishlist",
    adminPanel: "Admin Panel",
    signOut: "Sign Out",
    // Categories
    bestSellers: "Best Sellers",
    mobiles: "Mobiles",
    fashion: "Fashion",
    electronics: "Electronics",
    homeKitchen: "Home & Kitchen",
    sports: "Sports",
    footwear: "Footwear",
    accessories: "Accessories",
    books: "Books",
    todaysDeals: "Today's Deals",
    // Home page
    bestSellersTitle: "Best Sellers",
    featuredProducts: "Featured Products",
    seeAll: "See all",
    seeAllDeals: "See all deals",
    seeMore: "See more",
    topDeals60: "Up to 60% off | Top deals",
    smartDevices35: "Up to 35% off | Smart devices",
    trending30: "Up to 30% off | Trending now",
    personalizedRec: "See personalized recommendations",
    signInBtn: "Sign in",
    newCustomer: "New customer?",
    startHere: "Start here.",
    backToTop: "Back to top",
    // Footer
    getToKnow: "Get to Know Us",
    aboutShopEase: "About ShopEase",
    careers: "Careers",
    pressReleases: "Press Releases",
    makeMoney: "Make Money with Us",
    sellOnShopEase: "Sell on ShopEase",
    becomeAffiliate: "Become an Affiliate",
    advertise: "Advertise",
    letUsHelp: "Let Us Help You",
    yourAccount: "Your Account",
    returnsCentre: "Returns Centre",
    help: "Help",
    connectWithUs: "Connect with Us",
    allRightsReserved: "All rights reserved.",
    // Product
    addToCart: "Add to Cart",
    off: "off",
    save: "Save",
    // Cart
    shoppingCart: "Shopping Cart",
    subtotal: "Subtotal",
    proceedToCheckout: "Proceed to Checkout",
    // Common
    loading: "Loading...",
  },
  hi: {
    // Navbar
    deliverTo: "यहाँ भेजें",
    india: "भारत",
    searchPlaceholder: "ShopEase पर खोजें",
    hello: "नमस्ते",
    signIn: "साइन इन करें",
    account: "खाता",
    returns: "रिटर्न",
    orders: "और ऑर्डर",
    cart: "कार्ट",
    myOrders: "मेरे ऑर्डर",
    wishlist: "विशलिस्ट",
    adminPanel: "एडमिन पैनल",
    signOut: "साइन आउट",
    // Categories
    bestSellers: "बेस्ट सेलर्स",
    mobiles: "मोबाइल",
    fashion: "फैशन",
    electronics: "इलेक्ट्रॉनिक्स",
    homeKitchen: "होम और किचन",
    sports: "खेल",
    footwear: "जूते",
    accessories: "एक्सेसरीज़",
    books: "किताबें",
    todaysDeals: "आज के सौदे",
    // Home page
    bestSellersTitle: "बेस्ट सेलर्स",
    featuredProducts: "फीचर्ड प्रोडक्ट्स",
    seeAll: "सभी देखें",
    seeAllDeals: "सभी सौदे देखें",
    seeMore: "और देखें",
    topDeals60: "60% तक की छूट | टॉप डील्स",
    smartDevices35: "35% तक की छूट | स्मार्ट डिवाइस",
    trending30: "30% तक की छूट | ट्रेंडिंग",
    personalizedRec: "अनुकूलित सिफारिशें देखें",
    signInBtn: "साइन इन करें",
    newCustomer: "नए ग्राहक?",
    startHere: "यहाँ शुरू करें।",
    backToTop: "ऊपर जाएं",
    // Footer
    getToKnow: "हमारे बारे में जानें",
    aboutShopEase: "ShopEase के बारे में",
    careers: "करियर",
    pressReleases: "प्रेस रिलीज़",
    makeMoney: "हमारे साथ कमाएं",
    sellOnShopEase: "ShopEase पर बेचें",
    becomeAffiliate: "एफिलिएट बनें",
    advertise: "विज्ञापन दें",
    letUsHelp: "हम आपकी मदद करें",
    yourAccount: "आपका खाता",
    returnsCentre: "रिटर्न सेंटर",
    help: "सहायता",
    connectWithUs: "हमसे जुड़ें",
    allRightsReserved: "सर्वाधिकार सुरक्षित।",
    // Product
    addToCart: "कार्ट में डालें",
    off: "छूट",
    save: "बचत",
    // Cart
    shoppingCart: "शॉपिंग कार्ट",
    subtotal: "उप-योग",
    proceedToCheckout: "चेकआउट करें",
    // Common
    loading: "लोड हो रहा है...",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("shopease_lang") || "en");

  useEffect(() => {
    localStorage.setItem("shopease_lang", lang);
    if (lang === "hi") {
      document.body.classList.add("lang-hi");
    } else {
      document.body.classList.remove("lang-hi");
    }
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  const toggleLang = () => setLang((prev) => (prev === "en" ? "hi" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
