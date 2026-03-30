# ShopEase — Full-Stack E-Commerce Platform

A feature-rich, production-ready e-commerce web application built with the **MERN stack** (MongoDB, Express, React, Node.js). Includes Razorpay payment integration, Cloudinary image hosting, an AI-powered chatbot, a full admin panel, and is deployed on **Vercel** (frontend) + **Render** (backend).

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | [https://shopease-vert-theta.vercel.app](https://shopease-vert-theta.vercel.app) |
| Backend API | [https://shopease-1-opkc.onrender.com](https://shopease-1-opkc.onrender.com) |

---

## Features

### User Side
- **Authentication** — Register, login, JWT-based sessions, forgot/reset password via email
- **Product Browsing** — Full product catalog with search, filters (category, price, discount), multi-sort, and pagination
- **Product Detail** — Image carousel, ratings, stock status, add to cart/wishlist
- **Shopping Cart** — Add, update quantity, remove items, real-time totals
- **Wishlist** — Save products for later, toggle add/remove
- **Checkout** — Saved address selection, Razorpay payment gateway (test + live mode)
- **Order History** — View all orders with status tracking (pending → shipped → delivered)
- **Order Cancellation** — Cancel pending/confirmed orders
- **Product Returns** — Request returns for delivered orders with reason (7-day window)
- **Address Book** — Add, edit, delete multiple addresses; set a default address
- **AI Chatbot** — Shopping assistant with 20+ triggers (product search, order status, returns, shipping, payment help, budget-aware recommendations)
- **Featured & Best Sellers** — Curated homepage sections with carousels and category blocks

### Admin Panel
- **Dashboard** — Overview of total products, orders, users, and revenue (cancelled/returned excluded)
- **Product Management** — Add, edit, delete products with Cloudinary image upload; mark as Featured or Best Seller
- **Order Management** — View all orders, update status (confirmed → shipped → delivered → returned)
- **User Management** — View all users, delete accounts (admin-protected)

### Technical Highlights
- Razorpay HMAC-SHA256 signature verification on the backend
- Dynamic Razorpay SDK loading (no race conditions)
- Cloudinary image hosting with automatic deletion on product removal
- Secure password reset with crypto tokens (SHA-256 hashed, 15-min expiry)
- CORS whitelist for multi-origin deployments
- Vercel SPA rewrites + API proxy to Render backend
- Context API for global state (auth, cart, wishlist)
- Responsive UI with Tailwind CSS v4

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (7-day expiry), bcryptjs |
| Payments | Razorpay |
| Images | Cloudinary + Multer |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
e-commerce/
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   └── favicon.svg
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Returns.jsx
│   │   │   ├── Address.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Carousel.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   ├── CategoryBlock.jsx
│   │   │   ├── DealSection.jsx
│   │   │   ├── SectionRow.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── WishlistContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
└── backend/
    ├── config/
    │   ├── db.js
    │   ├── cloudinary.js
    │   ├── razorpay.js
    │   └── mailer.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Cart.js
    │   ├── Wishlist.js
    │   └── Order.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── cart.js
    │   ├── wishlist.js
    │   ├── orders.js
    │   ├── payment.js
    │   ├── user.js
    │   └── admin.js
    ├── server.js
    └── package.json
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account (test keys)
- Gmail account (for password reset emails)

### 1. Clone the repository

```bash
git clone https://github.com/Dheerajmlk/shopease.git
cd shopease
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FRONTEND_URL=http://localhost:5173

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

> **Note:** For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your main password.

Start the backend:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

Backend runs on `http://localhost:5001`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> All API calls use a relative `/api` base URL — routing is handled by the Vite dev proxy (local) and `vercel.json` rewrites (production). Do **not** set `VITE_API_URL` to a localhost address in Vercel; it will be baked into the production bundle and cause Mixed Content errors.

Start the frontend:

```bash
npm run dev      # development
npm run build    # production build
npm run preview  # preview production build
```

Frontend runs on `http://localhost:5173`.

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login and receive JWT |
| GET | `/me` | ✅ | Get current user |
| PUT | `/profile` | ✅ | Update name, phone, address |
| POST | `/forgot-password` | ❌ | Send password reset email |
| POST | `/reset-password/:token` | ❌ | Reset password with token |
| GET | `/verify-reset-token/:token` | ❌ | Validate reset token |

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ❌ | List products (search, filter, sort, paginate) |
| GET | `/featured` | ❌ | Featured products (up to 10) |
| GET | `/bestsellers` | ❌ | Best-seller products (up to 10) |
| GET | `/deals` | ❌ | Discounted products |
| GET | `/categories` | ❌ | All unique categories |
| GET | `/category-blocks` | ❌ | Category showcase (4 products each) |
| GET | `/:id` | ❌ | Single product detail |

### Cart — `/api/cart`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get cart |
| POST | `/add` | ✅ | Add item to cart |
| PUT | `/update` | ✅ | Update item quantity |
| DELETE | `/remove/:productId` | ✅ | Remove item |
| DELETE | `/clear` | ✅ | Clear entire cart |

### Wishlist — `/api/wishlist`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get wishlist |
| POST | `/toggle` | ✅ | Add/remove product |

### Orders — `/api/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | All user orders |
| POST | `/` | ✅ | Create order from cart |
| GET | `/:id` | ✅ | Single order |
| PUT | `/:id/cancel` | ✅ | Cancel order |
| PUT | `/:id/return` | ✅ | Request return |

### Payment — `/api/payment`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/razorpay-key` | ❌ | Get publishable key |
| POST | `/create-order` | ✅ | Create Razorpay order |
| POST | `/verify` | ✅ | Verify payment signature |

### User — `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | ✅ | Get profile |
| PUT | `/profile` | ✅ | Update name/phone |
| GET | `/addresses` | ✅ | List saved addresses |
| POST | `/addresses` | ✅ | Add address |
| PUT | `/addresses/:id` | ✅ | Update address |
| PUT | `/addresses/:id/default` | ✅ | Set default address |
| DELETE | `/addresses/:id` | ✅ | Delete address |

### Admin — `/api/admin` (Admin JWT required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Stats overview |
| GET | `/products` | All products |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/orders` | All orders |
| PUT | `/orders/:id/status` | Update order status |
| GET | `/users` | All users |
| DELETE | `/users/:id` | Delete user |

---

## Payment Flow (Razorpay)

```
User clicks "Place Order"
       ↓
Frontend → POST /api/payment/create-order  (amount in ₹)
       ↓
Backend creates Razorpay order → returns order_id
       ↓
Frontend opens Razorpay checkout modal with order_id
       ↓
User enters card/UPI details and pays
       ↓
Razorpay calls handler with { payment_id, order_id, signature }
       ↓
Frontend → POST /api/payment/verify  (HMAC-SHA256 check)
       ↓
Frontend → POST /api/orders  (save order to DB, clear cart)
       ↓
Redirect to /orders  🎉
```

### Test Card Details (Razorpay Test Mode)

| Field | Value |
|---|---|
| Card Number | `4111 1111 1111 1111` |
| Expiry | `12/26` |
| CVV | `123` |
| OTP | `1234` |

---

## Deployment

### Frontend — Vercel

1. Connect the `frontend/` directory to a Vercel project
2. Set build command: `npm run build`, output: `dist`
3. Add environment variable: `VITE_RAZORPAY_KEY_ID=your_razorpay_key_id`
4. The `vercel.json` handles API proxying to Render and SPA routing

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://your-render-url.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend — Render

1. Connect the `backend/` directory to a Render Web Service
2. Set start command: `node server.js`
3. Add all environment variables from the `.env` section above in the Render dashboard
4. Add your Vercel frontend URL to the `FRONTEND_URL` environment variable

---

## Environment Variables Summary

### Backend (Render / `.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5001) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID (test or live) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `FRONTEND_URL` | Allowed frontend origin for CORS |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password |

### Frontend (Vercel / `.env`)

| Variable | Description |
|---|---|
| `VITE_RAZORPAY_KEY_ID` | Razorpay publishable key (displayed to user) |

---

## Order Status Workflow

```
pending → confirmed → shipped → delivered
                                    ↓
                            return_requested → returned
         ↓
      cancelled  (from pending or confirmed only)
```

---

## Screenshots

> _Add screenshots of the homepage, product listing, checkout, and admin dashboard here._

---

## License

This project is for educational/portfolio purposes. Feel free to fork and build upon it.

---

## Author

**Dheeraj** — [github.com/Dheerajmlk](https://github.com/Dheerajmlk)

> Built with ❤️ using the MERN stack
