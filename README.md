# 🛒 ZenCart – Full Stack E-Commerce Platform

ZenCart is a modern, production-ready full-stack e-commerce web application built using the MERN stack. It provides a seamless shopping experience with real-world features like authentication, cart management, wishlist, checkout, and admin dashboard.

---

## 🚀 Live Demo

🌐 URl: https://zen-cart-e-commerce-r21r.vercel.app/

---

## ✨ Features

### 👤 User Features

* Browse products without login
* Smart search with debouncing 🔍
* Filter & sort products (price, category, rating)
* Add to cart (guest & logged-in users)
* Wishlist system ❤️
* Secure authentication (JWT)
* Email verification & password reset
* Address management
* Checkout system (Razorpay / Demo Payment)
* Order history & tracking 📦

---

### 🛒 Cart System

* Guest cart (localStorage)
* User cart (MongoDB)
* Automatic cart merge after login
* Update quantity / remove items

---

### ❤️ Wishlist

* Add/remove products
* Optimistic UI updates
* Persistent storage

---

### 💳 Payments

* Razorpay integration (Test Mode)
* Cash on Delivery (optional)
* Demo payment support

---

### 📦 Order System

* Order creation
* Order tracking (status-based)
* SMS notification after order 📱

---

### 👑 Admin Panel

* Admin login (seed-based)
* Product management (CRUD)
* Order management
* Review moderation
* Dashboard analytics 📊

---

## ⚡ Performance Optimizations

* Lazy loading (React)
* TanStack Query caching
* Skeleton loaders
* MongoDB indexing
* Optimized API responses
* Image CDN (Cloudinary)

---

## 🧠 Tech Stack

### Frontend

* React + TypeScript
* Tailwind CSS
* TanStack Query
* Zustand

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Atlas)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure

### Backend

```
api/
  controllers/
  routes/
  models/
  middlewares/
  services/
  utils/
```

### Frontend

```
src/
  features/
  components/
  store/
  routes/
  utils/
```

---

## 👨‍💻 Author

**Dhruvil Patel**

---

⭐ If you like this project, don’t forget to star the repo!
