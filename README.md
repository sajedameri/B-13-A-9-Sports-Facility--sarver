# 🏟️ SportNest - Sports Facility Booking Management System

## 📌 Project Name
SportNest

---

## 🎯 Purpose
SportNest is a full-stack sports facility booking platform built with the MERN stack.  
It allows users to explore sports facilities such as football turfs, badminton courts, swimming pools, and tennis courts, and book them for specific time slots.

Facility owners can add, update, and manage their facilities, while users can book and manage their reservations easily.

This project simulates a real-world sports reservation system like Playo or BookMyTurf.

---

## 🌐 Live URL
https://your-live-site-link.vercel.app

---

## 🚀 Features

### 👤 Authentication
- User registration & login
- Google login support
- JWT authentication with HTTPOnly cookies
- Protected routes for private pages

---

### 🏟️ Facility Management
- Add new sports facilities (private)
- Update facility (owner only)
- Delete facility (owner only)
- View all facilities (public)

---

### 📅 Booking System
- Book facilities for specific date & time
- Automatic total price calculation
- View user bookings
- Cancel booking

---

### 🔍 Search & Filter
- Search facilities by name using MongoDB `$regex`
- Filter by sport type using `$in`

---

### 🧑‍💼 Owner Features
- Manage own facilities
- Edit or delete only own data
- View facility booking count

---

### 🎨 UI/UX
- Fully responsive design (mobile, tablet, desktop)
- Clean and recruiter-friendly UI
- Consistent button and card design
- Loading spinner for data fetching
- Custom 404 Not Found page

---

### ⚡ Security
- JWT stored in HTTPOnly cookies
- Protected API routes using middleware
- Environment variables for MongoDB credentials

---

## 📦 NPM Packages Used

### 🖥️ Client Side
- next
- react
- react-dom
- axios
- react-hot-toast
- react-icons
- tailwindcss

---

### 🛠️ Server Side
- express
- mongodb
- cors
- dotenv
- jsonwebtoken
- cookie-parser
- bcryptjs

---

## 🗂️ Database Collections

### 🏟️ Facilities Collection
- name
- facility_type
- location
- price_per_hour
- capacity
- available_slots
- description
- owner_email
- booking_count

---

### 📅 Bookings Collection
- facility_id
- user_email
- booking_date
- time_slot
- hours
- total_price
- status (pending / canceled / confirmed)

---

## ⚙️ Installation & Setup

### Clone repo
```bash
git clone https://github.com/your-username/sportnest-client.git
git clone https://github.com/your-username/sportnest-server.git
