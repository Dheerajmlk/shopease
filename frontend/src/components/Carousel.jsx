import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    title: "Great Indian Sale",
    subtitle: "Up to 70% off on Electronics, Fashion & more",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop",
    gradient: "linear-gradient(135deg, rgba(26,54,93,0.85) 0%, rgba(42,74,127,0.7) 100%)",
  },
  {
    title: "Fashion Bonanza",
    subtitle: "Trendy styles starting at just ₹299",
    cta: "Explore Fashion",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    gradient: "linear-gradient(135deg, rgba(116,42,42,0.85) 0%, rgba(155,44,44,0.7) 100%)",
  },
  {
    title: "Electronics Mega Sale",
    subtitle: "Best deals on smartphones, laptops & accessories",
    cta: "See Deals",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=400&fit=crop",
    gradient: "linear-gradient(135deg, rgba(34,84,61,0.85) 0%, rgba(39,103,73,0.7) 100%)",
  },
  {
    title: "Home & Kitchen Fest",
    subtitle: "Refresh your home with amazing offers",
    cta: "Shop Home",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop",
    gradient: "linear-gradient(135deg, rgba(85,60,154,0.85) 0%, rgba(107,70,193,0.7) 100%)",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", height: "clamp(200px, 35vw, 380px)" }}>
      {slides.map((slide, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            transition: "opacity 0.7s ease-in-out",
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 10 : 0,
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <img
              src={slide.image}
              alt={slide.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: slide.gradient }} />
          </div>
          <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "center", padding: "0 48px" }}>
            <div style={{ maxWidth: 520 }} className="animate-fadeInUp">
              <h2 style={{
                fontSize: "clamp(22px, 4vw, 44px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 8px",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                lineHeight: 1.1,
                letterSpacing: "-0.5px"
              }}>
                {slide.title}
              </h2>
              <p style={{
                fontSize: "clamp(13px, 1.8vw, 18px)",
                color: "rgba(255,255,255,0.9)",
                margin: "0 0 20px",
                lineHeight: 1.4
              }}>
                {slide.subtitle}
              </p>
              <button style={{
                background: "linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%)",
                color: "#0f1111",
                padding: "10px 28px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "clamp(13px, 1.5vw, 15px)",
                border: "1px solid #a88734",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                transition: "all 0.2s"
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0c14b"; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 20,
          width: 56, display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: "pointer",
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.15)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <FiChevronLeft size={40} style={{ color: "rgba(255,255,255,0.8)", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))" }} />
      </button>
      <button
        onClick={next}
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0, zIndex: 20,
          width: 56, display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: "pointer",
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.15)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <FiChevronRight size={40} style={{ color: "rgba(255,255,255,0.8)", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))" }} />
      </button>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 8 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 24 : 10,
              height: 10,
              borderRadius: 5,
              background: i === current ? "#f0c14b" : "rgba(255,255,255,0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Bottom gradient fade into page bg */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 60, zIndex: 15,
        background: "linear-gradient(transparent, #eaeded)",
        pointerEvents: "none"
      }} />
    </div>
  );
}
