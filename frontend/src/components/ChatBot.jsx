import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { FiMessageCircle, FiX, FiSend, FiShoppingCart, FiPackage, FiHeart, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const BOT_NAME = "ShopEase Assistant";
const AVATAR = "🛍️";

const QUICK_REPLIES = [
  { label: "🔥 Best Deals", text: "Show me best deals" },
  { label: "📦 My Orders", text: "How do I check my orders?" },
  { label: "↩️ Returns", text: "How to return an item?" },
  { label: "💳 Payment", text: "What payment methods are accepted?" },
  { label: "🚚 Shipping", text: "How does shipping work?" },
  { label: "📞 Support", text: "How can I contact support?" },
];

function getBotReply(text, products, user) {
  const q = text.toLowerCase().trim();

  // ── Greetings ──
  if (/^(hi|hello|hey|namaste|hii|helo)\b/.test(q)) {
    return {
      text: user
        ? `Hello ${user.name?.split(" ")[0]}! 👋 Great to see you back. How can I help you today? I can help you find products, check orders, or answer any questions about ShopEase.`
        : `Hello there! 👋 Welcome to **ShopEase**! I'm your shopping assistant. I can help you find products, answer questions about shipping, payments, returns, and more. What can I help you with?`,
    };
  }

  // ── Orders ──
  if (/order|track|where is my|delivery status/.test(q)) {
    return {
      text: user
        ? `You can view all your orders from the **Returns & Orders** section in the navbar, or click below:`
        : `Please sign in first to view your orders. Once logged in, go to **Returns & Orders** in the top navbar.`,
      link: user ? { to: "/orders", label: "📦 View My Orders" } : { to: "/login", label: "🔑 Sign In" },
    };
  }

  // ── Returns ──
  if (/return|refund|send back|replace/.test(q)) {
    return {
      text: `**ShopEase Return Policy** ↩️\n\n• **7-day return window** from delivery date\n• Go to **My Orders** → select the order → click **Return Items**\n• Add a reason for return and submit\n• Refund is processed within **5–7 business days**\n\nOnly delivered orders are eligible for returns.`,
      link: user ? { to: "/orders", label: "↩️ Initiate a Return" } : null,
    };
  }

  // ── Shipping / Delivery ──
  if (/ship|deliver|dispatch|how long|when will|arrive/.test(q)) {
    return {
      text: `**Shipping Info** 🚚\n\n• **FREE delivery** on all orders\n• Standard delivery: **3–7 business days**\n• Express delivery: **1–2 business days** (available at checkout)\n• Orders above ₹499 get priority dispatch\n• Tracking updates available in **My Orders**`,
    };
  }

  // ── Payment ──
  if (/pay|payment|upi|card|wallet|razorpay|cod|cash/.test(q)) {
    return {
      text: `**Payment Methods** 💳\n\nShopEase uses **Razorpay** — India's most trusted payment gateway:\n\n• 💳 Debit & Credit Cards (Visa, Mastercard, RuPay)\n• 📱 UPI (GPay, PhonePe, Paytm, BHIM)\n• 🏦 Net Banking (50+ banks)\n• 👛 Wallets (Paytm, Amazon Pay, PhonePe)\n• 🔒 100% secure with SSL encryption`,
    };
  }

  // ── Deals / Discounts ──
  if (/deal|discount|offer|sale|off|cheap|best price/.test(q)) {
    const deals = products.filter((p) => p.discount >= 50).slice(0, 3);
    return {
      text: `🔥 **Today's Hot Deals** — Up to 73% OFF!\n\nHere are some top picks:`,
      products: deals,
      link: { to: "/products?sort=discount", label: "🔥 See All Deals" },
    };
  }

  // ── Best sellers ──
  if (/best seller|popular|trending|top rated|highest rated/.test(q)) {
    const bs = products.filter((p) => p.isBestSeller).slice(0, 3);
    return {
      text: `⭐ **Best Sellers on ShopEase**\n\nHere are our most loved products:`,
      products: bs,
      link: { to: "/products?sort=rating", label: "⭐ See All Best Sellers" },
    };
  }

  // ── Category searches ──
  const categories = { electronics: "Electronics", mobiles: "Mobiles", phone: "Mobiles", fashion: "Fashion", clothes: "Fashion", shirt: "Fashion", shoes: "Footwear", footwear: "Footwear", kitchen: "Home & Kitchen", home: "Home & Kitchen", books: "Books", book: "Books", sports: "Sports", accessories: "Accessories", bags: "Accessories", watch: "Accessories" };
  for (const [keyword, cat] of Object.entries(categories)) {
    if (q.includes(keyword)) {
      const catProducts = products.filter((p) => p.category === cat).slice(0, 3);
      return {
        text: `Here are some **${cat}** products for you:`,
        products: catProducts,
        link: { to: `/products?category=${encodeURIComponent(cat)}`, label: `Browse All ${cat}` },
      };
    }
  }

  // ── Product search ──
  if (/find|search|looking for|need|want|show me/.test(q)) {
    const keyword = q.replace(/find|search|looking for|need|want|show me|a |an |the /g, "").trim();
    const found = keyword.length > 2 ? products.filter((p) => p.name.toLowerCase().includes(keyword) || p.description?.toLowerCase().includes(keyword) || p.category?.toLowerCase().includes(keyword)).slice(0, 3) : [];
    if (found.length > 0) {
      return { text: `I found these products for **"${keyword}"**:`, products: found, link: { to: `/products?search=${encodeURIComponent(keyword)}`, label: "🔍 See All Results" } };
    }
    return { text: `I couldn't find exact matches for **"${keyword}"**. Try browsing our categories:`, link: { to: "/products", label: "🛍️ Browse All Products" } };
  }

  // ── Account ──
  if (/account|profile|password|login|sign in|register|sign up/.test(q)) {
    return {
      text: user
        ? `You're already signed in as **${user.name}** (${user.email}). You can manage your account from the navbar → Account section.`
        : `You can **Sign In** or **Create a new account** to access orders, wishlist, and personalized recommendations.`,
      link: user ? { to: "/orders", label: "👤 My Account" } : { to: "/login", label: "🔑 Sign In" },
    };
  }

  // ── Wishlist ──
  if (/wishlist|saved|favourite|favorite|heart/.test(q)) {
    return {
      text: user
        ? `Your wishlist saves items you want to buy later! Click the ❤️ heart icon on any product to add it to your wishlist.`
        : `Sign in to use the Wishlist feature! Click ❤️ on any product to save it for later.`,
      link: user ? { to: "/wishlist", label: "❤️ My Wishlist" } : { to: "/login", label: "🔑 Sign In" },
    };
  }

  // ── Cart ──
  if (/cart|basket|bag|checkout/.test(q)) {
    return {
      text: `Your cart holds items ready for purchase! Click **Add to Cart** on any product, then go to the cart to checkout using Razorpay.`,
      link: { to: "/cart", label: "🛒 View Cart" },
    };
  }

  // ── About / Contact / Support ──
  if (/contact|support|help|about|customer care/.test(q)) {
    return {
      text: `**ShopEase Support** 📞\n\n• 📧 Email: support@shopease.com\n• ⏰ Hours: Mon–Sat, 9 AM – 6 PM IST\n• 💬 Live chat available here!\n\n**Common Help Topics:**\n• Track your order → My Orders\n• Return an item → My Orders → Return Items\n• Change password → Forgot Password on Login page`,
    };
  }

  // ── Price range ──
  if (/under|below|less than|budget|cheap|₹|rs\.|rupee/.test(q)) {
    const match = q.match(/\d+/);
    const budget = match ? Number(match[0]) : 1000;
    const found = products.filter((p) => p.price <= budget).sort((a, b) => b.discount - a.discount).slice(0, 3);
    return {
      text: found.length > 0
        ? `Here are great products **under ₹${budget.toLocaleString()}**:`
        : `I couldn't find products under ₹${budget}. Try a higher budget or browse deals!`,
      products: found,
      link: found.length > 0 ? { to: "/products?sort=price_asc", label: "💰 See More Budget Picks" } : { to: "/products?sort=discount", label: "🔥 See Deals" },
    };
  }

  // ── Thanks ──
  if (/thank|thanks|great|awesome|perfect|nice|good/.test(q)) {
    return { text: `You're welcome! 😊 Happy shopping at ShopEase! Is there anything else I can help you with?` };
  }

  // ── Bye ──
  if (/bye|goodbye|see you|later|take care/.test(q)) {
    return { text: `Goodbye! 👋 Have a great time shopping at ShopEase. Come back anytime! 🛍️` };
  }

  // ── Default ──
  return {
    text: `I'm not sure I understood that. I can help you with:\n\n• 🔍 **Finding products** — just tell me what you're looking for\n• 📦 **Orders & Tracking**\n• ↩️ **Returns & Refunds**\n• 💳 **Payments & Security**\n• 🚚 **Shipping & Delivery**\n• 📞 **Customer Support**\n\nWhat would you like to know?`,
  };
}

function MessageText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part.split("\n").map((line, j) => (
          <span key={j}>{line}{j < part.split("\n").length - 1 && <br />}</span>
        ))
      )}
    </span>
  );
}

export default function ChatBot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot", id: Date.now(),
      text: `Hi there! 👋 I'm your **ShopEase Assistant**. I can help you find products, check order status, learn about shipping, returns, and more!\n\nTry asking me anything or use the quick replies below.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [products, setProducts] = useState([]);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    api.get("/products?limit=100").then((r) => setProducts(r.data.products || [])).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  const sendMessage = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput("");

    const userMsg = { from: "user", id: Date.now(), text: q };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(q, products, user);
      setMessages((m) => [...m, { from: "bot", id: Date.now() + 1, ...reply }]);
      setTyping(false);
      if (!open) setUnread((n) => n + 1);
    }, 700 + Math.random() * 400);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: "50%",
          background: open ? "#cc0c39" : "linear-gradient(135deg, #131921 0%, #37475a 100%)",
          color: "#fff", border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s",
          transform: open ? "rotate(0deg)" : "rotate(0deg)",
        }}
        title={open ? "Close Chat" : "Chat with us"}
      >
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
        {!open && unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#cc0c39", color: "#fff", fontSize: 11, fontWeight: 700,
            borderRadius: "50%", width: 20, height: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff",
          }}>{unread}</span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 998,
          width: 360, height: 520,
          background: "#fff", borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          animation: "slideInUp 0.25s ease-out",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #131921 0%, #232f3e 100%)",
            padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, #f08804, #ffd814)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>{AVATAR}</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{BOT_NAME}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                <span style={{ color: "#aaa", fontSize: 11 }}>Online · Replies instantly</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ color: "#aaa", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 4px", display: "flex", flexDirection: "column", gap: 10, background: "#f8f9fa" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", flexDirection: msg.from === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
                {msg.from === "bot" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #131921, #37475a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🛍️</div>
                )}
                <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{
                    background: msg.from === "user" ? "linear-gradient(135deg, #131921, #232f3e)" : "#fff",
                    color: msg.from === "user" ? "#fff" : "#0f1111",
                    padding: "10px 13px", borderRadius: msg.from === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    fontSize: 13, lineHeight: 1.55,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    border: msg.from === "bot" ? "1px solid #e8e8e8" : "none",
                  }}>
                    <MessageText text={msg.text} />
                  </div>

                  {/* Product cards */}
                  {msg.products?.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {msg.products.map((p) => (
                        <Link key={p._id} to={`/products/${p._id}`} onClick={() => setOpen(false)} style={{
                          background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10,
                          padding: "8px 10px", textDecoration: "none",
                          display: "flex", alignItems: "center", gap: 10,
                          transition: "box-shadow 0.2s",
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                        >
                          <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: "contain", background: "#f7f7f7", borderRadius: 6, padding: 3, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#0f1111", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1111" }}>₹{p.price?.toLocaleString()}</span>
                              {p.discount > 0 && <span style={{ fontSize: 10, background: "#cc0c39", color: "#fff", padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>{p.discount}% off</span>}
                            </div>
                          </div>
                          <FiShoppingCart size={14} color="#007185" style={{ flexShrink: 0 }} />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Link button */}
                  {msg.link && (
                    <Link to={msg.link.to} onClick={() => setOpen(false)} style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      background: "linear-gradient(180deg, #f7dfa5 0%, #f0c14b 100%)",
                      color: "#0f1111", fontSize: 12, fontWeight: 600,
                      padding: "8px 14px", borderRadius: 8, textDecoration: "none",
                      border: "1px solid #a88734",
                      alignSelf: "flex-start",
                    }}>
                      {msg.link.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #131921, #37475a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🛍️</div>
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#aaa", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div style={{ padding: "6px 10px", background: "#f8f9fa", borderTop: "1px solid #eee", display: "flex", gap: 6, overflowX: "auto", flexWrap: "nowrap" }} className="hide-scrollbar">
            {QUICK_REPLIES.map((qr) => (
              <button key={qr.label} onClick={() => sendMessage(qr.text)} style={{
                flexShrink: 0, padding: "5px 11px", borderRadius: 20,
                border: "1px solid #d5d9d9", background: "#fff",
                fontSize: 11, fontWeight: 500, color: "#0f1111",
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f0f0"; e.currentTarget.style.borderColor = "#007185"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#d5d9d9"; }}
              >{qr.label}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", background: "#fff", borderTop: "1px solid #eee", display: "flex", gap: 8, alignItems: "center" }}>
            <input
              ref={inputRef}
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask me anything..."
              style={{ flex: 1, border: "1px solid #d5d9d9", borderRadius: 20, padding: "9px 14px", fontSize: 13, outline: "none", background: "#f7f7f7" }}
              onFocus={(e) => e.target.style.borderColor = "#007185"}
              onBlur={(e) => e.target.style.borderColor = "#d5d9d9"}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim()} style={{
              width: 36, height: 36, borderRadius: "50%",
              background: input.trim() ? "linear-gradient(135deg, #131921, #37475a)" : "#e0e0e0",
              color: "#fff", border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s", flexShrink: 0,
            }}>
              <FiSend size={14} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
