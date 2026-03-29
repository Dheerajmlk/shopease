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
        setFeatured(f.data);
        setBestSellers(b.data);
        setDeals60(d60.data);
        setDeals35(d35.data);
        setDeals30(d30.data);
        setCategoryBlocks(cb.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ background: "#eaeded", minHeight: "100vh" }}>
        <div style={{ height: 350, background: "linear-gradient(135deg, #232f3e 0%, #37475a 100%)" }} className="animate-pulse" />
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: "20px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "#fff", height: 350, borderRadius: 8 }} className="animate-pulse" />
            ))}
          </div>
          <div style={{ background: "#fff", height: 280, borderRadius: 8, marginTop: 16 }} className="animate-pulse" />
          <div style={{ background: "#fff", height: 280, borderRadius: 8, marginTop: 16 }} className="animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#eaeded", minHeight: "100vh" }}>
      <Carousel />

      <div style={{ maxWidth: 1500, margin: "0 auto", padding: "20px 16px", paddingBottom: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── LOGGED-IN: Welcome + Quick Actions ── */}
          {user && (
            <div style={{
              background: "linear-gradient(135deg, #232f3e 0%, #37475a 100%)",
              borderRadius: 10,
              padding: "22px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, #f08804, #ffd814)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, boxShadow: "0 2px 8px rgba(240,136,4,0.4)"
                }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>Good day 👋</p>
                  <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>
                    Welcome back, {user.name?.split(" ")[0]}!
                  </h2>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { icon: <FiPackage size={16} />, label: "My Orders", to: "/orders" },
                  { icon: <FiHeart size={16} />, label: "Wishlist", to: "/wishlist" },
                  { icon: <FiShoppingCart size={16} />, label: "My Cart", to: "/cart" },
                  { icon: <FiGrid size={16} />, label: "All Products", to: "/products" },
                ].map(({ icon, label, to }) => (
                  <Link key={label} to={to} style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff", fontSize: 13, fontWeight: 500,
                    padding: "8px 16px", borderRadius: 20,
                    textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)",
                    transition: "background 0.2s"
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >
                    {icon} {label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Category Blocks Row 1 */}
          {categoryBlocks.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
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
            <div style={{
              background: "#fff",
              borderRadius: 8,
              padding: "20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              border: "1px solid #e8e8e8"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FiTrendingUp size={20} color="#c45500" />
                  <h2 style={{ fontSize: 21, fontWeight: 700, color: "#0f1111", margin: 0, letterSpacing: "-0.3px" }}>
                    Recommended for {user.name?.split(" ")[0]}
                  </h2>
                </div>
                <Link to="/products" style={{ fontSize: 14, color: "#007185", textDecoration: "none", fontWeight: 500 }}>
                  See all →
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                {featured.slice(0, 6).map((p) => (
                  <Link key={p._id} to={`/products/${p._id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{
                      background: "#f7f7f7", borderRadius: 8, height: 160,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: 12, overflow: "hidden", border: "1px solid #efefef",
                      transition: "border-color 0.2s, transform 0.2s"
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#007185"; e.currentTarget.style.transform = "scale(1.02)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#efefef"; e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      <img src={p.image} alt={p.name} style={{ maxHeight: "85%", maxWidth: "85%", objectFit: "contain" }} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <p style={{ fontSize: 12, color: "#0f1111", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                        <FiStar size={12} fill="#de7921" color="#de7921" />
                        <span style={{ fontSize: 12, color: "#565959" }}>{p.ratings}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 3 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#0f1111" }}>₹{p.price?.toLocaleString()}</span>
                        {p.discount > 0 && (
                          <span style={{ fontSize: 11, color: "#cc0c39", fontWeight: 600 }}>{p.discount}% off</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
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
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12
            }}>
              {[
                { icon: <FiPackage size={28} />, title: "Your Orders", desc: "Track, return or buy things again", to: "/orders", color: "#007185" },
                { icon: <FiHeart size={28} />, title: "Your Wishlist", desc: "Items you've saved for later", to: "/wishlist", color: "#cc0c39" },
                { icon: <FiUser size={28} />, title: "Your Account", desc: "Manage your ShopEase account", to: "/orders", color: "#232f3e" },
                { icon: <FiGrid size={28} />, title: "Browse Products", desc: "Explore all categories", to: "/products", color: "#f08804" },
              ].map(({ icon, title, desc, to, color }) => (
                <Link key={title} to={to} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#fff", borderRadius: 8, padding: "20px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    border: "1px solid #e8e8e8",
                    display: "flex", alignItems: "flex-start", gap: 14,
                    transition: "box-shadow 0.2s, transform 0.2s"
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ color, flexShrink: 0, marginTop: 2 }}>{icon}</div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#0f1111", margin: 0 }}>{title}</p>
                      <p style={{ fontSize: 12, color: "#565959", margin: "4px 0 0" }}>{desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* ── GUEST: Sign-in Banner ── */
            <div style={{
              background: "linear-gradient(135deg, #fff 0%, #fefcf3 100%)",
              borderRadius: 8, padding: "32px 24px", textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #e8e8e8"
            }}>
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
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: "48px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, marginTop: 0 }}>{t("getToKnow")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#ddd" }}>
                <span style={{ cursor: "pointer" }}>{t("aboutShopEase")}</span>
                <span style={{ cursor: "pointer" }}>{t("careers")}</span>
                <span style={{ cursor: "pointer" }}>{t("pressReleases")}</span>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, marginTop: 0 }}>{t("makeMoney")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#ddd" }}>
                <span style={{ cursor: "pointer" }}>{t("sellOnShopEase")}</span>
                <span style={{ cursor: "pointer" }}>{t("becomeAffiliate")}</span>
                <span style={{ cursor: "pointer" }}>{t("advertise")}</span>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, marginTop: 0 }}>{t("letUsHelp")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#ddd" }}>
                <span style={{ cursor: "pointer" }}>{t("yourAccount")}</span>
                <span style={{ cursor: "pointer" }}>{t("returnsCentre")}</span>
                <span style={{ cursor: "pointer" }}>{t("help")}</span>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, marginTop: 0 }}>{t("connectWithUs")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "#ddd" }}>
                <span style={{ cursor: "pointer" }}>Facebook</span>
                <span style={{ cursor: "pointer" }}>Twitter</span>
                <span style={{ cursor: "pointer" }}>Instagram</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #3a4553", padding: "24px 16px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 8 }}>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Shop</span>
            <span style={{ color: "#f08804", fontSize: 18, fontWeight: 800 }}>Ease</span>
          </div>
          <p style={{ fontSize: 13, color: "#999", margin: 0 }}>&copy; 2024 ShopEase. {t("allRightsReserved")}</p>
        </div>
      </footer>
    </div>
  );
}
