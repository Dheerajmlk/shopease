import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";

export default function CategoryBlock({ category, products }) {
  const { t } = useLang();

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      border: "1px solid #e8e8e8",
      transition: "box-shadow 0.2s",
      overflow: "hidden",
    }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)"}
    >
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0f1111", marginBottom: 14, marginTop: 0, letterSpacing: "-0.3px" }}>{category}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {products.slice(0, 4).map((p) => (
          <Link key={p._id} to={`/products/${p._id}`} style={{ textDecoration: "none", display: "block", overflow: "hidden" }}>
            <div style={{
              background: "#f7f7f7",
              borderRadius: 6,
              width: "100%",
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              overflow: "hidden",
              border: "1px solid #efefef",
              transition: "border-color 0.2s, transform 0.2s",
              position: "relative",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#007185"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#efefef"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "90%",
                  maxHeight: "90%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <p style={{
              fontSize: 12,
              color: "#0f1111",
              marginTop: 6,
              marginBottom: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: 500,
              lineHeight: 1.3,
            }}>{p.name}</p>
          </Link>
        ))}
      </div>
      <Link
        to={`/products?category=${encodeURIComponent(category)}`}
        style={{ fontSize: 14, color: "#007185", textDecoration: "none", marginTop: 14, display: "inline-block", fontWeight: 500 }}
      >
        {t("seeMore")}
      </Link>
    </div>
  );
}
