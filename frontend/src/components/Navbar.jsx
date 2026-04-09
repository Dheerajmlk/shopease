import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LanguageContext";
import { FiShoppingCart, FiSearch, FiMapPin, FiChevronDown, FiMenu, FiX, FiGlobe } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const categories = [
    { label: t("bestSellers"), link: "/products?sort=rating" },
    { label: t("mobiles"), link: "/products?category=Mobiles" },
    { label: t("fashion"), link: "/products?category=Fashion" },
    { label: t("electronics"), link: "/products?category=Electronics" },
    { label: t("homeKitchen"), link: "/products?category=Home%20%26%20Kitchen" },
    { label: t("sports"), link: "/products?category=Sports" },
    { label: t("footwear"), link: "/products?category=Footwear" },
    { label: t("accessories"), link: "/products?category=Accessories" },
    { label: t("books"), link: "/products?category=Books" },
    { label: t("todaysDeals"), link: "/products?sort=discount" },
  ];

  return (
    <>
      {/* Main Header */}
      <nav style={{ background: "linear-gradient(180deg, #131921 0%, #1a2332 100%)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: "0 8px" }}>
          <div className="flex items-center h-14 sm:h-16 gap-1 sm:gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-baseline px-1 sm:px-2 py-1 border border-transparent rounded no-underline shrink-0"
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}>
              <span className="text-white text-lg sm:text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Shop</span>
              <span className="text-[#f08804] text-lg sm:text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Ease</span>
              <span className="text-[#f08804] text-[8px] sm:text-[10px] -mt-2 ml-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>.in</span>
            </Link>

            {/* Delivery Location → /address */}
            <Link to="/address" style={{ display: "none", alignItems: "center", color: "#fff", padding: "4px 8px", border: "1px solid transparent", borderRadius: 4, cursor: "pointer", flexShrink: 0, textDecoration: "none" }}
              className="lg:!flex"
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}>
              <FiMapPin style={{ color: "#f08804", marginRight: 4 }} size={18} />
              <div style={{ lineHeight: 1.3 }}>
                <p style={{ color: "#ccc", fontSize: 11, margin: 0 }}>{t("deliverTo")}</p>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{t("india")}</p>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 flex h-9 sm:h-[42px] min-w-0 rounded-lg overflow-hidden shadow-sm" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 px-2 sm:px-[14px] text-sm sm:text-[15px] border-none outline-none bg-white font-sans"
              />
              <button type="submit" className="px-2 sm:px-[14px] border-none cursor-pointer flex items-center justify-center transition-opacity hover:opacity-90" style={{ background: "linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%)" }}>
                <FiSearch className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#131921]" />
              </button>
            </form>

            {/* Right Section */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: 2 }}>
              {/* Language Selector */}
              <div ref={langRef} style={{ position: "relative" }}>
                <div
                  onClick={() => setLangOpen(!langOpen)}
                  style={{ display: "flex", alignItems: "center", color: "#fff", padding: "6px 10px", border: "1px solid transparent", borderRadius: 4, cursor: "pointer", gap: 4 }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"}
                  onMouseLeave={(e) => { if (!langOpen) e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <FiGlobe size={16} />
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{lang === "en" ? "EN" : "हि"}</span>
                  <FiChevronDown size={12} />
                </div>
                {langOpen && (
                  <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 4, background: "#fff", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", width: 200, zIndex: 60, overflow: "hidden", border: "1px solid #d5d9d9" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee", background: "#fafafa" }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0f1111", margin: 0 }}>Change Language</p>
                    </div>
                    <button
                      onClick={() => { if (lang !== "en") toggleLang(); setLangOpen(false); }}
                      style={{ width: "100%", padding: "12px 16px", border: "none", background: lang === "en" ? "#fef9ee" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#0f1111", textAlign: "left" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = lang === "en" ? "#fef9ee" : "#f5f5f5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = lang === "en" ? "#fef9ee" : "#fff"}
                    >
                      <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${lang === "en" ? "#f08804" : "#bbb"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {lang === "en" && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f08804" }} />}
                      </span>
                      English - EN
                    </button>
                    <button
                      onClick={() => { if (lang !== "hi") toggleLang(); setLangOpen(false); }}
                      style={{ width: "100%", padding: "12px 16px", border: "none", background: lang === "hi" ? "#fef9ee" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#0f1111", textAlign: "left" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = lang === "hi" ? "#fef9ee" : "#f5f5f5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = lang === "hi" ? "#fef9ee" : "#fff"}
                    >
                      <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${lang === "hi" ? "#f08804" : "#bbb"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {lang === "hi" && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f08804" }} />}
                      </span>
                      हिंदी - HI
                    </button>
                  </div>
                )}
              </div>

              {/* Sign In / Account */}
              {user ? (
                <div className="group" style={{ position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", color: "#fff", padding: "4px 8px", border: "1px solid transparent", borderRadius: 4, cursor: "pointer", lineHeight: 1.3 }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}>
                    <span style={{ fontSize: 11, color: "#ccc" }}>{t("hello")}, {user.name?.split(" ")[0]}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center" }}>{t("account")} <FiChevronDown size={12} style={{ marginLeft: 4 }} /></span>
                  </div>
                  <div style={{ position: "absolute", right: 0, top: "100%", width: 200, background: "#fff", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", opacity: 0, visibility: "hidden", transition: "all 0.2s", zIndex: 50, overflow: "hidden", border: "1px solid #d5d9d9" }}
                    className="group-hover:!opacity-100 group-hover:!visible">
                    <div style={{ padding: 8 }}>
                      <Link to="/orders" style={{ display: "block", padding: "10px 12px", fontSize: 14, color: "#0f1111", textDecoration: "none", borderRadius: 4 }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        {t("myOrders")}
                      </Link>
                      <Link to="/wishlist" style={{ display: "block", padding: "10px 12px", fontSize: 14, color: "#0f1111", textDecoration: "none", borderRadius: 4 }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        {t("wishlist")}
                      </Link>
                      <Link to="/address" style={{ display: "block", padding: "10px 12px", fontSize: 14, color: "#0f1111", textDecoration: "none", borderRadius: 4 }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        My Addresses
                      </Link>
                      <Link to="/returns" style={{ display: "block", padding: "10px 12px", fontSize: 14, color: "#0f1111", textDecoration: "none", borderRadius: 4 }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        Returns
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin" style={{ display: "block", padding: "10px 12px", fontSize: 14, color: "#0f1111", textDecoration: "none", borderRadius: 4 }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                          {t("adminPanel")}
                        </Link>
                      )}
                      <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid #eee" }} />
                      <button onClick={handleLogout} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", fontSize: 14, color: "#cc0c39", border: "none", background: "transparent", cursor: "pointer", borderRadius: 4 }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        {t("signOut")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" style={{ display: "flex", flexDirection: "column", color: "#fff", padding: "4px 8px", border: "1px solid transparent", borderRadius: 4, lineHeight: 1.3, textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}>
                  <span style={{ fontSize: 11, color: "#ccc" }}>{t("hello")}, {t("signIn")}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center" }}>{t("account")} <FiChevronDown size={12} style={{ marginLeft: 4 }} /></span>
                </Link>
              )}

              {/* Returns & Orders */}
              <Link to="/orders" style={{ display: "flex", flexDirection: "column", color: "#fff", padding: "4px 8px", border: "1px solid transparent", borderRadius: 4, lineHeight: 1.3, textDecoration: "none" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}>
                <span style={{ fontSize: 11, color: "#ccc" }}>{t("returns")}</span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{t("orders")}</span>
              </Link>
            </div>

            {/* Cart */}
            <Link to="/cart" style={{ display: "flex", alignItems: "center", color: "#fff", padding: "4px 8px", border: "1px solid transparent", borderRadius: 4, position: "relative", flexShrink: 0, textDecoration: "none" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}>
              <div style={{ position: "relative" }}>
                <FiShoppingCart size={28} />
                <span style={{ position: "absolute", top: -6, right: -4, background: "#f08804", color: "#fff", fontSize: 12, fontWeight: 800, borderRadius: 10, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  {cartCount}
                </span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 4 }} className="hidden sm:inline">{t("cart")}</span>
            </Link>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: "#fff", padding: 4, background: "transparent", border: "none", cursor: "pointer" }} className="md:hidden">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: "#232f3e", borderTop: "1px solid #3a4553", paddingBottom: 12, padding: "8px 16px" }} className="md:hidden">
            <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 8 }}>
              {/* Language toggle - mobile */}
              <button onClick={() => { toggleLang(); }} style={{ textAlign: "left", color: "#f08804", fontWeight: 600, padding: "8px 8px", background: "transparent", border: "none", cursor: "pointer", borderRadius: 4, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <FiGlobe size={16} />
                {lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
              </button>
              {user ? (
                <>
                  <p style={{ color: "#ccc", fontSize: 14, padding: "4px 8px", margin: 0 }}>{t("hello")}, {user.name}</p>
                  <Link to="/orders" style={{ color: "#fff", padding: "8px 8px", textDecoration: "none", borderRadius: 4, fontSize: 14 }} onClick={() => setMenuOpen(false)}>{t("myOrders")}</Link>
                  <Link to="/wishlist" style={{ color: "#fff", padding: "8px 8px", textDecoration: "none", borderRadius: 4, fontSize: 14 }} onClick={() => setMenuOpen(false)}>{t("wishlist")}</Link>
                  <Link to="/address" style={{ color: "#fff", padding: "8px 8px", textDecoration: "none", borderRadius: 4, fontSize: 14 }} onClick={() => setMenuOpen(false)}>My Addresses</Link>
                  <Link to="/returns" style={{ color: "#fff", padding: "8px 8px", textDecoration: "none", borderRadius: 4, fontSize: 14 }} onClick={() => setMenuOpen(false)}>Returns</Link>
                  {user.role === "admin" && <Link to="/admin" style={{ color: "#fff", padding: "8px 8px", textDecoration: "none", borderRadius: 4, fontSize: 14 }} onClick={() => setMenuOpen(false)}>{t("adminPanel")}</Link>}
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ textAlign: "left", color: "#ff9900", padding: "8px 8px", background: "transparent", border: "none", cursor: "pointer", borderRadius: 4, fontSize: 14 }}>{t("signOut")}</button>
                </>
              ) : (
                <Link to="/login" style={{ color: "#ff9900", fontWeight: 700, padding: "8px 8px", textDecoration: "none", borderRadius: 4, fontSize: 14 }} onClick={() => setMenuOpen(false)}>{t("signIn")}</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Category Navigation Bar */}
      <div style={{ background: "#232f3e", borderTop: "1px solid #3a4553" }}>
        <div style={{ maxWidth: 1500, margin: "0 auto" }}>
          <div className="hide-scrollbar" style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
            {categories.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                style={{ color: "#fff", fontSize: 13, padding: "8px 12px", whiteSpace: "nowrap", textDecoration: "none", border: "1px solid transparent", borderRadius: 2, transition: "all 0.15s", fontWeight: 500 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
