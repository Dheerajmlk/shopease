import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import Carousel from "../components/Carousel";
import SectionRow from "../components/SectionRow";
import DealSection from "../components/DealSection";
import CategoryBlock from "../components/CategoryBlock";
import { FiPackage, FiHeart, FiShoppingCart, FiGrid, FiUser, FiStar, FiTrendingUp } from "react-icons/fi";

export default function Home() {
  const { t } = useLang();
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [deals60, setDeals60] = useState([]);
  const [deals35, setDeals35] = useState([]);
  const [deals30, setDeals30] = useState([]);
  const [categoryBlocks, setCategoryBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products/featured"),
      api.get("/products/bestsellers"),
      api.get("/products/deals?minDiscount=60&limit=8"),
      api.get("/products/deals?minDiscount=35&maxDiscount=59&limit=8"),
      api.get("/products/deals?minDiscount=25&maxDiscount=34&limit=8"),
      api.get("/products/category-blocks"),
    ])
      .then(([f, b, d60, d35, d30, cb]) => {
        setFeatured(Array.isArray(f.data) ? f.data : []);
        setBestSellers(Array.isArray(b.data) ? b.data : []);
        setDeals60(Array.isArray(d60.data) ? d60.data : []);
        setDeals35(Array.isArray(d35.data) ? d35.data : []);
        setDeals30(Array.isArray(d30.data) ? d30.data : []);
        setCategoryBlocks(Array.isArray(cb.data) ? cb.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ background: "#eaeded", minHeight: "100vh" }}>
        <div style={{ height: "clamp(180px, 40vw, 380px)", background: "linear-gradient(135deg, #232f3e 0%, #37475a 100%)" }} className="animate-pulse" />
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white h-[280px] sm:h-[350px] rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="bg-white h-[200px] sm:h-[280px] rounded-lg mt-4 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <Carousel />

      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-4 sm:py-5 pb-8 sm:pb-10">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── LOGGED-IN: Welcome + Quick Actions ── */}
          {user && (
            <div style={{
              background: "linear-gradient(135deg, #232f3e 0%, #37475a 100%)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)"
            }} className="p-4 sm:p-5">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "linear-gradient(135deg, #f08804, #ffd814)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, boxShadow: "0 2px 8px rgba(240,136,4,0.4)"
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="hidden sm:block" style={{ color: "#ccc", fontSize: 13, margin: 0 }}>Good day</p>
                  <h2 style={{ color: "#fff", margin: 0, letterSpacing: "-0.3px" }} className="text-base sm:text-xl font-bold">
                    Welcome back, {user.name?.split(" ")[0]}!
                  </h2>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { icon: <FiPackage size={14} />, label: "Orders", to: "/orders" },
                  { icon: <FiHeart size={14} />, label: "Wishlist", to: "/wishlist" },
                  { icon: <FiShoppingCart size={14} />, label: "Cart", to: "/cart" },
                  { icon: <FiGrid size={14} />, label: "Products", to: "/products" },
                ].map(({ icon, label, to }) => (
                  <Link key={label} to={to} className="flex items-center gap-1.5 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full border border-white/15 hover:bg-white/20 transition-colors" style={{ background: "rgba(255,255,255,0.1)", textDecoration: "none" }}>
                    {icon} {label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Category Blocks Row 1 */}
          {categoryBlocks.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categoryBlocks.slice(0, 4).map((block) => (
                <CategoryBlock key={block.category} category={block.category} products={block.products} />
              ))}
            </div>
          )}

          {/* Best Sellers Row */}
          <SectionRow
            title={t("bestSellersTitle")}
            products={bestSellers}
            link="/products?sort=rating"
            linkText={t("seeAll")}
          />

          {/* Up to 60% Off Deals */}
          <DealSection
            title={t("topDeals60")}
            products={deals60}
            discount={60}
          />

          {/* ── LOGGED-IN: Personalized Picks ── */}
          {user && featured.length > 0 && (
            <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-[#e8e8e8]">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FiTrendingUp size={18} color="#c45500" />
                  <h2 className="text-base sm:text-xl font-bold text-[#0f1111]" style={{ margin: 0, letterSpacing: "-0.3px" }}>
                    Recommended for {user.name?.split(" ")[0]}
                  </h2>
                </div>
                <Link to="/products" style={{ fontSize: 13, color: "#007185", textDecoration: "none", fontWeight: 500, flexShrink: 0 }}>
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {featured.slice(0, 6).map((p) => (
                  <Link key={p._id} to={`/products/${p._id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div className="bg-[#f7f7f7] rounded-lg h-28 sm:h-40 flex items-center justify-center p-2 sm:p-3 border border-[#efefef] hover:border-[#007185] transition-colors">
                      <img src={p.image} alt={p.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.style.opacity = "0.3"; }} style={{ maxHeight: "85%", maxWidth: "85%", objectFit: "contain" }} />
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <p className="text-xs text-[#0f1111] font-semibold truncate">{p.name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                        <FiStar size={11} fill="#de7921" color="#de7921" />
                        <span style={{ fontSize: 11, color: "#565959" }}>{p.ratings}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
                        <span className="text-sm font-bold text-[#0f1111]">₹{p.price?.toLocaleString()}</span>
                        {p.discount > 0 && (
                          <span className="text-[10px] text-[#cc0c39] font-semibold">{p.discount}% off</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured Products Row */}
          <SectionRow
            title={t("featuredProducts")}
            products={featured}
            link="/products"
            linkText={t("seeAll")}
          />

          {/* Up to 35% Off Deals */}
          <DealSection
            title={t("smartDevices35")}
            products={deals35}
            discount={35}
          />

          {/* Category Blocks Row 2 */}
          {categoryBlocks.length > 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categoryBlocks.slice(4, 8).map((block) => (
                <CategoryBlock key={block.category} category={block.category} products={block.products} />
              ))}
            </div>
          )}

          {/* Up to 30% Off Deals */}
          {deals30.length > 0 && (
            <DealSection
              title={t("trending30")}
              products={deals30}
              discount={30}
            />
          )}

          {/* ── LOGGED-IN: Account Quick Links ── */}
          {user ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: <FiPackage size={24} />, title: "Your Orders", desc: "Track, return or buy things again", to: "/orders", color: "#007185" },
                { icon: <FiHeart size={24} />, title: "Your Wishlist", desc: "Items you've saved for later", to: "/wishlist", color: "#cc0c39" },
                { icon: <FiUser size={24} />, title: "Your Account", desc: "Manage your ShopEase account", to: "/orders", color: "#232f3e" },
                { icon: <FiGrid size={24} />, title: "Browse Products", desc: "Explore all categories", to: "/products", color: "#f08804" },
              ].map(({ icon, title, desc, to, color }) => (
                <Link key={title} to={to} style={{ textDecoration: "none" }}>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-[#e8e8e8] flex items-start gap-3 hover:shadow-md transition-shadow">
                    <div style={{ color, flexShrink: 0, marginTop: 2 }}>{icon}</div>
                    <div>
                      <p className="text-sm font-bold text-[#0f1111]">{title}</p>
                      <p className="text-xs text-[#565959] mt-1 hidden sm:block">{desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* ── GUEST: Sign-in Banner ── */
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center shadow-sm border border-[#e8e8e8]">
              <p style={{ color: "#0f1111", fontSize: 15, margin: 0, fontWeight: 500 }}>
                {t("personalizedRec")}
              </p>
              <a href="/login" style={{
                display: "inline-block", marginTop: 12,
                background: "linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%)",
                color: "#0f1111", padding: "10px 40px", borderRadius: 8,
                fontWeight: 600, fontSize: 14, textDecoration: "none",
                border: "1px solid #a88734", boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}>
                {t("signInBtn")}
              </a>
              <p style={{ fontSize: 13, color: "#565959", marginTop: 10, marginBottom: 0 }}>
                {t("newCustomer")}{" "}
                <a href="/register" style={{ color: "#007185", textDecoration: "none", fontWeight: 500 }}>{t("startHere")}</a>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#232f3e", color: "#fff" }}>
        <div style={{ background: "#37475a", cursor: "pointer" }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              width: "100%", padding: "14px", fontSize: 14, textAlign: "center",
              color: "#fff", background: "transparent", border: "none", cursor: "pointer",
              fontWeight: 500, letterSpacing: "0.3px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#485769"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {t("backToTop")}
          </button>
        </div>
        <div className="max-w-[1500px] mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-3">{t("getToKnow")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#ddd" }}>
                <span style={{ cursor: "pointer" }}>{t("aboutShopEase")}</span>
                <span style={{ cursor: "pointer" }}>{t("careers")}</span>
                <span style={{ cursor: "pointer" }}>{t("pressReleases")}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-3">{t("makeMoney")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#ddd" }}>
                <span style={{ cursor: "pointer" }}>{t("sellOnShopEase")}</span>
                <span style={{ cursor: "pointer" }}>{t("becomeAffiliate")}</span>
                <span style={{ cursor: "pointer" }}>{t("advertise")}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-3">{t("letUsHelp")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#ddd" }}>
                <span style={{ cursor: "pointer" }}>{t("yourAccount")}</span>
                <span style={{ cursor: "pointer" }}>{t("returnsCentre")}</span>
                <span style={{ cursor: "pointer" }}>{t("help")}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-3">{t("connectWithUs")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#ddd" }}>
                <span style={{ cursor: "pointer" }}>Facebook</span>
                <span style={{ cursor: "pointer" }}>Twitter</span>
                <span style={{ cursor: "pointer" }}>Instagram</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #3a4553", padding: "20px 16px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 6 }}>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Shop</span>
            <span style={{ color: "#f08804", fontSize: 18, fontWeight: 800 }}>Ease</span>
          </div>
          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>&copy; 2024 ShopEase. {t("allRightsReserved")}</p>
        </div>
      </footer>
    </div>
  );
}
