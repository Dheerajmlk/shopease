import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function DealSection({ title, products }) {
  const { t } = useLang();

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 8,
      padding: "20px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      border: "1px solid #e8e8e8"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8 }}>
        <h2 style={{ fontSize: "clamp(16px, 4vw, 21px)", fontWeight: 700, color: "#0f1111", margin: 0, letterSpacing: "-0.3px" }}>{title}</h2>
        <Link to="/products?sort=discount" style={{ fontSize: 14, color: "#007185", textDecoration: "none", fontWeight: 500 }}>
          {t("seeAllDeals")}
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {products.slice(0, 4).map((p) => (
          <Link key={p._id} to={`/products/${p._id}`} className="group" style={{ textDecoration: "none" }}>
            <div style={{
              position: "relative",
              background: "#f7f7f7",
              borderRadius: 8,
              overflow: "hidden",
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              border: "1px solid #f0f0f0",
              transition: "border-color 0.2s, transform 0.2s"
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#007185"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                onError={(e) => { e.target.onerror = null; e.target.style.opacity = "0.3"; }}
                style={{ width: "auto", height: "auto", maxHeight: "85%", maxWidth: "85%", objectFit: "contain", display: "block" }}
              />
              <span style={{
                position: "absolute", top: 8, left: 8,
                background: "linear-gradient(135deg, #cc0c39 0%, #e25822 100%)",
                color: "#fff", fontSize: 12, fontWeight: 700,
                padding: "3px 10px", borderRadius: 4,
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
              }}>
                {p.discount}% {t("off")}
              </span>
            </div>
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 13, color: "#0f1111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0, fontWeight: 500 }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#0f1111" }}>₹{p.price?.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: "#565959", textDecoration: "line-through" }}>₹{p.originalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
