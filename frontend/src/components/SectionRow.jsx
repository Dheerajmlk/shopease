import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "./ProductCard";

export default function SectionRow({ title, products, link, linkText = "See all deals" }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = dir === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      border: "1px solid #e8e8e8"
    }}>
      <div style={{ padding: "14px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <h2 style={{ fontSize: "clamp(16px, 4vw, 21px)", fontWeight: 700, color: "#0f1111", margin: 0, letterSpacing: "-0.3px" }}>{title}</h2>
        {link && (
          <Link to={link} style={{ fontSize: 14, color: "#007185", textDecoration: "none", fontWeight: 500 }}>
            {linkText}
          </Link>
        )}
      </div>
      <div style={{ position: "relative" }} className="group">
        <button
          onClick={() => scroll("left")}
          style={{
            position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
            zIndex: 10, background: "rgba(255,255,255,0.97)", boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            borderRadius: "0 8px 8px 0", padding: "12px 6px", border: "1px solid #ddd",
            borderLeft: "none", cursor: "pointer", opacity: 0, transition: "opacity 0.2s"
          }}
          className="group-hover:!opacity-100"
        >
          <FiChevronLeft size={24} />
        </button>

        <div
          ref={scrollRef}
          className="scroll-container"
          style={{ display: "flex", gap: 10, overflowX: "auto", padding: "6px 16px 16px", scrollSnapType: "x mandatory" }}
        >
          {products.map((p) => (
            <div key={p._id} style={{ flexShrink: 0, width: "clamp(150px, 40vw, 200px)", scrollSnapAlign: "start" }}>
              <ProductCard product={p} compact />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          style={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
            zIndex: 10, background: "rgba(255,255,255,0.97)", boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            borderRadius: "8px 0 0 8px", padding: "12px 6px", border: "1px solid #ddd",
            borderRight: "none", cursor: "pointer", opacity: 0, transition: "opacity 0.2s"
          }}
          className="group-hover:!opacity-100"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
