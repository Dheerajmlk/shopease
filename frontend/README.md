# ShopEase — Frontend

> React 19 + Vite 8 + Tailwind CSS v4 — Amazon-style eCommerce UI.

---

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev          # starts on http://localhost:5173
```

> Make sure the backend is running on port **5001** before starting the frontend.

---

## 🔑 Test Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@shopease.com     | admin123   |
| User  | user@test.com          | user123    |

> Register a new account at `/register` to test the full signup flow.

---

## ⚙️ Environment Variables (`.env`)

```env
VITE_RAZORPAY_KEY_ID=rzp_test_SGgUxNXJPhFnL7
```

---

## 🗂️ Project Structure

```
frontend/
├── public/
├── src/
│   ├── api.js                    # Axios instance (base URL + auth header)
│   ├── App.jsx                   # Routes + providers
│   ├── index.css                 # Tailwind v4 + custom CSS variables
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # User auth state (login/register/logout)
│   │   ├── CartContext.jsx       # Cart CRUD + real-time count
│   │   ├── WishlistContext.jsx   # Wishlist toggle + state
│   │   └── LanguageContext.jsx   # EN / Hindi language toggle
│   │
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky header + category bar + language switcher
│   │   ├── Carousel.jsx          # Auto-sliding hero banner (4 slides)
│   │   ├── CategoryBlock.jsx     # 2×2 product image grid per category
│   │   ├── DealSection.jsx       # Discount deal grid (60%, 35%, 30% off)
│   │   ├── SectionRow.jsx        # Horizontal scrollable product row
│   │   ├── ProductCard.jsx       # Product card (wishlist, badge, add to cart)
│   │   └── ProtectedRoute.jsx    # Auth guard for private routes
│   │
│   └── pages/
│       ├── Home.jsx              # Homepage (carousel + category blocks + deals)
│       ├── Products.jsx          # Listing with sidebar filters + sort + pagination
│       ├── ProductDetail.jsx     # Product detail with buy box
│       ├── Cart.jsx              # Cart with quantity controls
│       ├── Checkout.jsx          # Razorpay payment + address form
│       ├── Orders.jsx            # Order history + return requests
│       ├── Wishlist.jsx          # Saved items
│       ├── Login.jsx             # Sign-in form (with Forgot Password link)
│       ├── Register.jsx          # New account form
│       ├── ForgotPassword.jsx    # Email input → sends reset link
│       ├── ResetPassword.jsx     # Token verify → new password + strength meter
│       └── admin/
│           ├── AdminLayout.jsx   # Sidebar nav wrapper
│           ├── Dashboard.jsx     # Stats cards + recent orders table
│           ├── AdminProducts.jsx # Product CRUD table + add/edit modal
│           ├── AdminOrders.jsx   # All orders + status dropdown
│           └── AdminUsers.jsx    # User list + delete
├── index.html                    # Google Fonts (Inter + Noto Sans Devanagari)
├── vite.config.js                # Vite + Tailwind v4 plugin + API proxy
└── .env                          # Razorpay key
```

---

## 📱 Pages & Routes

| Route                      | Access       | Description                                      |
|---------------------------|--------------|--------------------------------------------------|
| `/`                       | Public       | Home — carousel, category blocks, deal sections  |
| `/products`               | Public       | All products with search, filter, sort, paginate |
| `/products/:id`           | Public       | Product detail with buy box                      |
| `/login`                  | Public       | Sign in                                          |
| `/register`               | Public       | Create account                                   |
| `/forgot-password`        | Public       | Request password reset link via email            |
| `/reset-password/:token`  | Public       | Set new password (token valid 15 min)            |
| `/cart`                   | 🔒 User      | Shopping cart                                    |
| `/wishlist`               | 🔒 User      | Saved wishlist items                             |
| `/checkout`               | 🔒 User      | Razorpay payment + delivery address              |
| `/orders`                 | 🔒 User      | Order history + return requests                  |
| `/admin`                  | 🔒 Admin     | Dashboard with stats                             |
| `/admin/products`         | 🔒 Admin     | Product management (CRUD + Cloudinary upload)    |
| `/admin/orders`           | 🔒 Admin     | All orders + status updates                      |
| `/admin/users`            | 🔒 Admin     | User management                                  |

---

## ✨ Features

### 🏠 Home Page
- Full-width auto-sliding carousel (4 slides, 5s interval)
- Category blocks (2×2 grid, 8 categories, images fixed no-overflow)
- Best Sellers horizontal scroll row with arrow navigation
- Deal sections: Up to 60% Off, Up to 35% Off, Up to 30% Off
- **Logged-in users** see: Welcome banner with name, "Recommended for You" grid, quick-access cards (Orders, Wishlist, Cart, Browse)
- **Guests** see: Personalized recommendations sign-in banner
- Footer with Back to Top button

### 🛍️ Shopping
- Search from navbar (redirects to `/products?search=...`)
- Filter by category (sidebar on desktop, drawer on mobile)
- Sort by: Newest, Price Low→High, Price High→Low, Rating, Discount
- Pagination with smart page numbers
- Product detail with breadcrumb, star ratings, discount %, MRP strikethrough
- Add to Cart + Buy Now + Add to Wishlist

### 🛒 Cart & Checkout
- Cart with quantity controls (+/−) and delete
- Cart count in navbar updates in real time
- Checkout: delivery address form + order review + Razorpay payment modal
- Cart automatically cleared (DB + UI) after successful order

### 📦 Orders
- Full order history with status badges
- Return request modal for delivered orders
- Order status: Pending → Confirmed → Shipped → Delivered → Return Requested → Returned

### 🔐 Auth & Password
- JWT-based authentication (token stored in localStorage)
- **Forgot Password** flow:
  - User enters registered email
  - Backend generates a 15-min expiry reset token (hashed SHA-256 in DB)
  - Email sent via Gmail (nodemailer) with branded HTML email
  - Dev mode: reset link shown directly on screen if email not configured
- **Reset Password** page:
  - Token verified before form is shown
  - Password strength meter (5 levels)
  - Confirm password match check
  - Expired/invalid token shows clear error with re-request option

### 🌐 Language
- EN / हिंदी toggle in navbar (desktop + mobile)
- Persisted in localStorage
- Key UI strings translated to Hindi

### 🛠️ Admin Panel
- Dashboard with 4 stat cards (total users, products, orders, revenue)
- Products: full table with add/edit modal (Cloudinary image upload, featured/bestseller toggles, discount fields)
- Orders: all customer orders with status dropdown (7 statuses)
- Users: user list with delete

---

## 🛠️ Tech Stack

| Technology              | Version  | Purpose                          |
|-------------------------|----------|----------------------------------|
| React                   | 19       | UI framework                     |
| Vite                    | 8        | Build tool + dev server          |
| Tailwind CSS            | v4       | Utility-first CSS                |
| React Router DOM        | 6        | Client-side routing              |
| Axios                   | 1.6      | API calls                        |
| react-hot-toast         | 2.4      | Toast notifications              |
| react-icons (feather)   | 5.0      | Icon library (FiXxx)             |
| Context API             | built-in | Auth, Cart, Wishlist, Language   |

---

## 🔧 Vite Config

```js
// vite.config.js
proxy: {
  "/api": "http://localhost:5001"  // Proxies API calls to backend
}
```

---

## 🏗️ Build for Production

```bash
npm run build     # outputs to dist/
npm run preview   # preview production build locally
```

**Build output:** ~397 KB JS (gzipped: ~115 KB), ~32 KB CSS

---

## 💡 Forgot Password — Dev Mode

If `EMAIL_USER` and `EMAIL_PASS` are not set in the backend `.env`, the forgot-password API returns the reset link directly in the JSON response. The frontend **displays this link** on the success screen with a copy button — perfect for testing without email setup.

To enable real email:
1. Add your Gmail credentials to `backend/.env`
2. Use a **Gmail App Password** (not your account password)
3. Restart the backend

---

*© 2024 ShopEase*
