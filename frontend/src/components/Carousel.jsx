import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' fill='%23232f3e'%3E%3Crect width='1200' height='400'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='32' fill='%23fff' text-anchor='middle' dy='.3em'%3EShopEase%3C/text%3E%3C/svg%3E";

const slides = [
  {
    title: "Great Indian Sale",
    subtitle: "Up to 70% off on Electronics, Fashion & more",
    cta: "Shop Now",
    image: "https://res.cloudinary.com/dnclehvkq/image/upload/q_auto/f_auto/v1775719398/Screenshot_2026-04-09_at_12.51.47_PM_fjwya4.png",
    gradient: "linear-gradient(135deg, rgba(26,54,93,0.92) 0%, rgba(42,74,127,0.80) 100%)",
  },
  {
    title: "Fashion Bonanza",
    subtitle: "Trendy styles starting at just ₹299",
    cta: "Explore Fashion",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&q=75",
    gradient: "linear-gradient(135deg, rgba(116,42,42,0.92) 0%, rgba(155,44,44,0.80) 100%)",
  },
  {
    title: "Electronics Mega Sale",
    subtitle: "Best deals on smartphones, laptops & accessories",
    cta: "See Deals",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=400&fit=crop&q=75",
    gradient: "linear-gradient(135deg, rgba(34,84,61,0.92) 0%, rgba(39,103,73,0.80) 100%)",
  },
  {
    title: "Home & Kitchen Fest",
    subtitle: "Refresh your home with amazing offers",
    cta: "Shop Home",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop&q=75",
    gradient: "linear-gradient(135deg, rgba(85,60,154,0.92) 0%, rgba(107,70,193,0.80) 100%)",
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
    <div className="carousel-root" style={{ position: "relative", width: "100%", overflow: "hidden", height: "clamp(180px, 40vw, 380px)" }}>
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
          {/* Background image + gradient overlay */}
          <div style={{ position: "absolute", inset: 0 }}>
            <img
              src={slide.image}
              alt={slide.title}
              loading={i === 0 ? "eager" : "lazy"}
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",              // ✅ FIXED
                objectPosition: "center"         // ✅ FIXED
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: slide.gradient }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }} />
          </div>

          {/* Text content */}
          <div className="carousel-content" style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "center" }}>
            <div style={{ maxWidth: 520 }} className="animate-fadeInUp">
              <h2 className="carousel-title" style={{
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 6px",
                textShadow: "0 2px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)",
                lineHeight: 1.1,
                letterSpacing: "-0.5px"
              }}>
                {slide.title}
              </h2>
              <p className="carousel-subtitle" style={{
                color: "#fff",
                margin: "0 0 14px",
                lineHeight: 1.4,
                textShadow: "0 1px 6px rgba(0,0,0,0.4)"
              }}>
                {slide.subtitle}
              </p>
              <button className="carousel-cta" style={{
                background: "linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%)",
                color: "#0f1111",
                borderRadius: 8,
                fontWeight: 700,
                border: "1px solid #a88734",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
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
      <button onClick={prev} className="carousel-arrow carousel-arrow-left" style={{ position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}>
        <FiChevronLeft style={{ color: "#fff" }} />
      </button>
      <button onClick={next} className="carousel-arrow carousel-arrow-right" style={{ position: "absolute", right: 0, top: 0, bottom: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}>
        <FiChevronRight style={{ color: "#fff" }} />
      </button>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 6 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? "#f0c14b" : "rgba(255,255,255,0.5)",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Bottom gradient */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, zIndex: 15, background: "linear-gradient(transparent, #eaeded)" }} />
    </div>
  );
}

// import { useState, useEffect, useCallback } from "react";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' fill='%23232f3e'%3E%3Crect width='1200' height='400'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='32' fill='%23fff' text-anchor='middle' dy='.3em'%3EShopEase%3C/text%3E%3C/svg%3E";

// const slides = [
//   {
//     title: "Great Indian Sale",
//     subtitle: "Up to 70% off on Electronics, Fashion & more",
//     cta: "Shop Now",
//     image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop&q=75",
//     gradient: "linear-gradient(135deg, rgba(26,54,93,0.92) 0%, rgba(42,74,127,0.80) 100%)",
//   },
//   {
//     title: "Fashion Bonanza",
//     subtitle: "Trendy styles starting at just ₹299",
//     cta: "Explore Fashion",
//     image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop&q=75",
//     gradient: "linear-gradient(135deg, rgba(116,42,42,0.92) 0%, rgba(155,44,44,0.80) 100%)",
//   },
//   {
//     title: "Electronics Mega Sale",
//     subtitle: "Best deals on smartphones, laptops & accessories",
//     cta: "See Deals",
//     image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=400&fit=crop&q=75",
//     gradient: "linear-gradient(135deg, rgba(34,84,61,0.92) 0%, rgba(39,103,73,0.80) 100%)",
//   },
//   {
//     title: "Home & Kitchen Fest",
//     subtitle: "Refresh your home with amazing offers",
//     cta: "Shop Home",
//     image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop&q=75",
//     gradient: "linear-gradient(135deg, rgba(85,60,154,0.92) 0%, rgba(107,70,193,0.80) 100%)",
//   },
// ];

// export default function Carousel() {
//   const [current, setCurrent] = useState(0);

//   const next = useCallback(() => {
//     setCurrent((prev) => (prev + 1) % slides.length);
//   }, []);

//   const prev = useCallback(() => {
//     setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(next, 5000);
//     return () => clearInterval(timer);
//   }, [next]);

//   return (
//     <div className="carousel-root" style={{ position: "relative", width: "100%", overflow: "hidden", height: "clamp(180px, 40vw, 380px)" }}>
//       {slides.map((slide, i) => (
//         <div
//           key={i}
//           style={{
//             position: "absolute",
//             inset: 0,
//             transition: "opacity 0.7s ease-in-out",
//             opacity: i === current ? 1 : 0,
//             zIndex: i === current ? 10 : 0,
//           }}
//         >
//           {/* Background image + gradient overlay */}
//           <div style={{ position: "absolute", inset: 0 }}>
//             <img
//               src={slide.image}
//               alt={slide.title}
//               loading={i === 0 ? "eager" : "lazy"}
//               onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
//               style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
//             />
//             {/* Primary gradient overlay */}
//             <div style={{ position: "absolute", inset: 0, background: slide.gradient }} />
//             {/* Extra left-side darkening so text area is always readable */}
//             <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }} />
//           </div>

//           {/* Text content */}
//           <div className="carousel-content" style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "center" }}>
//             <div style={{ maxWidth: 520 }} className="animate-fadeInUp">
//               <h2 className="carousel-title" style={{
//                 fontWeight: 800,
//                 color: "#fff",
//                 margin: "0 0 6px",
//                 textShadow: "0 2px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)",
//                 lineHeight: 1.1,
//                 letterSpacing: "-0.5px"
//               }}>
//                 {slide.title}
//               </h2>
//               <p className="carousel-subtitle" style={{
//                 color: "#fff",
//                 margin: "0 0 14px",
//                 lineHeight: 1.4,
//                 textShadow: "0 1px 6px rgba(0,0,0,0.4)"
//               }}>
//                 {slide.subtitle}
//               </p>
//               <button className="carousel-cta" style={{
//                 background: "linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%)",
//                 color: "#0f1111",
//                 borderRadius: 8,
//                 fontWeight: 700,
//                 border: "1px solid #a88734",
//                 cursor: "pointer",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
//                 transition: "all 0.2s"
//               }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = "#f0c14b"; e.currentTarget.style.transform = "scale(1.03)"; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%)"; e.currentTarget.style.transform = "scale(1)"; }}
//               >
//                 {slide.cta}
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* Navigation Arrows */}
//       <button
//         onClick={prev}
//         aria-label="Previous slide"
//         className="carousel-arrow carousel-arrow-left"
//         style={{
//           position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 20,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           background: "transparent", border: "none", cursor: "pointer",
//           transition: "background 0.2s"
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.15)"}
//         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//       >
//         <FiChevronLeft className="carousel-arrow-icon" style={{ color: "#fff", filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.5))" }} />
//       </button>
//       <button
//         onClick={next}
//         aria-label="Next slide"
//         className="carousel-arrow carousel-arrow-right"
//         style={{
//           position: "absolute", right: 0, top: 0, bottom: 0, zIndex: 20,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           background: "transparent", border: "none", cursor: "pointer",
//           transition: "background 0.2s"
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.15)"}
//         onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//       >
//         <FiChevronRight className="carousel-arrow-icon" style={{ color: "#fff", filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.5))" }} />
//       </button>

//       {/* Dots */}
//       <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 6 }}>
//         {slides.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setCurrent(i)}
//             aria-label={`Go to slide ${i + 1}`}
//             style={{
//               width: i === current ? 20 : 8,
//               height: 8,
//               borderRadius: 4,
//               background: i === current ? "#f0c14b" : "rgba(255,255,255,0.5)",
//               border: "none",
//               cursor: "pointer",
//               transition: "all 0.3s",
//               padding: 0,
//             }}
//           />
//         ))}
//       </div>

//       {/* Bottom gradient fade into page bg */}
//       <div style={{
//         position: "absolute", bottom: 0, left: 0, right: 0, height: 40, zIndex: 15,
//         background: "linear-gradient(transparent, #eaeded)",
//         pointerEvents: "none"
//       }} />
//     </div>
//   );
// }
