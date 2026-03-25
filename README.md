# StudyNotion 📚

A full-stack Ed-Tech platform where **instructors** can create and publish courses and **students** can browse, purchase, and learn at their own pace. Built with the MERN stack, integrated with Cloudinary for media, Razorpay for payments, and deployed on Vercel (frontend) + Render (backend).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Overview](#api-overview)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### Students
- Browse and search for courses
- Enroll in free or paid courses via Razorpay
- Track learning progress with a progress bar
- Download course completion certificates
- Write reviews for completed courses
- Manage profile, password, and display picture

### Instructors
- Create, edit, and delete courses with rich content (videos, descriptions, sections)
- Visual analytics dashboard (enrollment count, revenue charts)
- Manage course sections and sub-sections

### General
- JWT-based authentication with OTP email verification
- Password reset via email
- Responsive UI built with Tailwind CSS
- Dark-themed, modern design

---

## Tech Stack

| Layer      | Technology                                                                 |
|------------|---------------------------------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router v7          |
| Backend    | Node.js, Express 5, MongoDB (Mongoose)                                    |
| Auth       | JSON Web Tokens (JWT), bcrypt, OTP via Nodemailer                         |
| Media      | Cloudinary (image & video upload)                                         |
| Payments   | Razorpay                                                                  |
| Deployment | Vercel (frontend), Render (backend)                                       |

---

## Project Structure

```
StudyNotion/
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── Asset/          # Static images, logos, timeline icons
│   │   ├── component/      # Reusable and page-specific components
│   │   │   ├── common/     # Navbar, Footer, Modals, etc.
│   │   │   └── core/       # Feature components (Auth, Dashboard, Course, HomePage…)
│   │   ├── data/           # Static data files (nav links, sidebar links, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route-level page components
│   │   ├── reducer/        # Redux root reducer
│   │   ├── services/       # API connector, service functions, operations
│   │   ├── slices/         # Redux slices (auth, cart, course, profile, viewCourse)
│   │   └── utils/          # Utility functions (avgRating, constants, formatter)
│   ├── .env
│   └── vite.config.js
│
├── server/                 # Express REST API
│   ├── config/             # Database and Cloudinary config
│   ├── controllers/        # Route handler logic
│   ├── middlewares/        # Auth middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── utils/              # Mail sender, image uploader helpers
│   ├── .env
│   └── index.js            # App entry point
│
└── package.json            # Root monorepo scripts (runs both client & server)
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A **MongoDB** database (MongoDB Atlas recommended)
- A **Cloudinary** account
- A **Razorpay** account (for payment integration)
- An email account (Gmail) for OTP/nodemailer

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/StudyNotion.git
cd StudyNotion

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd server && npm install && cd ..
```

### Environment Variables

**`server/.env`**
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password

RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret
```

**`frontend/.env`**
```env
VITE_BASE_URL=http://localhost:4000/api/v1
```

### Running Locally

Run both the frontend and backend concurrently from the root directory:

```bash
npm run dev
```

Or run them individually:

```bash
# Backend (http://localhost:4000)
npm run server

# Frontend (http://localhost:5173)
npm run client
```

---

## API Overview

| Resource     | Base Route             | Key Operations                              |
|--------------|------------------------|---------------------------------------------|
| Auth         | `/api/v1/auth`         | signup, login, sendOtp, resetPassword       |
| Profile      | `/api/v1/profile`      | getProfile, updateProfile, updatePicture    |
| Courses      | `/api/v1/course`       | CRUD courses, sections, sub-sections        |
| Payments     | `/api/v1/payment`      | capturePayment, verifyPayment               |
| Contact      | `/api/v1/contact`      | contactUs                                   |

---

## Deployment

| Service  | Platform | Notes                                               |
|----------|----------|-----------------------------------------------------|
| Frontend | Vercel   | Set `VITE_BASE_URL` environment variable            |
| Backend  | Render   | Set all `server/.env` variables in Render dashboard |

> **Note:** Vercel builds run in a case-sensitive Linux environment. All import paths in the source code have been verified to match the exact filesystem casing.

---

## License

This project is for educational purposes.
