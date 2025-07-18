# 🚀 Custom Onboarding Flow App

A customizable user onboarding flow built with **React**, **Express**, and **Prisma**, featuring:

- A multi-step user onboarding wizard
- Admin panel to configure onboarding pages
- Public table for viewing registered users
- RESTful backend with full CRUD API

This project is perfect for SaaS apps or internal tools needing dynamic user onboarding with admin control.

---

## 🖼️ Preview

| Onboarding Wizard | Admin Panel | User Data Table |
|-------------------|--------------|-----------------|
| ![](./screenshots/onboarding.png) | ![](./screenshots/admin.png) | ![](./screenshots/users.png) |

---

## ✨ Features

- ✅ Dynamic onboarding steps (editable from admin panel)
- ✅ Email validation (only `gmail.com`)
- ✅ Modern UI and consistent styling
- ✅ Fully functional REST API using Express + Prisma
- ✅ Vite-powered frontend
- ✅ Easy deployment to Vercel, Render, or Railway

---

## 🛠️ Tech Stack

**Frontend**  
- React + TypeScript  
- React Router  
- Vite  
- Custom CSS (responsive and styled to match Google’s form UI)

**Backend**  
- Node.js + Express  
- Prisma ORM + SQLite/PostgreSQL  
- REST API  

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/custom-onboarding-flow.git
cd custom-onboarding-flow
```

### 2. Install dependencies

> Install both frontend and backend dependencies.

```bash
# Frontend
cd onboarding-frontend
npm install

# Backend
cd ../onboarding-backend
npm install
```

### 3. Setup Prisma DB (Backend)

```bash
npx prisma migrate dev --name init
npx prisma generate
```

If you're using SQLite (default), this creates a local `dev.db`. You can easily switch to PostgreSQL via `.env`.

### 4. Start the project

```bash
# In one terminal: start backend
cd onboarding-backend
npm run dev

# In another terminal: start frontend
cd onboarding-frontend
npm run dev
```

Now visit:  
🌐 `http://localhost:5173` – Onboarding wizard  
🔧 `http://localhost:5173/admin` – Admin panel  
📋 `http://localhost:5173/users` – Registered users

---

## ⚙️ Project Structure

```bash
.
├── onboarding-frontend/
│   ├── components/
│   ├── styles/
│   └── App.tsx
├── onboarding-backend/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│   └── server.js
└── README.md
```

---

## 🌐 Deployment

You can deploy the app using:

- [Vercel (Frontend)](https://vercel.com/docs)
- [Render (Backend)](https://render.com/docs/deploy-node-express-app)
- [Railway (Fullstack)](https://docs.railway.app)

---

## 🧪 API Reference

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| GET    | `/api/users`     | Get all users       |
| POST   | `/api/users`     | Create user         |
| PUT    | `/api/users/:id` | Update user         |
| GET    | `/api/config`    | Get config          |
| PUT    | `/api/config`    | Update config array |

---

## 📋 TODOs / Future Enhancements

- [ ] Add onboarding step reorder functionality
- [ ] Support multiple email domains
- [ ] Add unit & integration tests
- [ ] Add loading indicators and animations

---

## 📄 License

MIT License

Copyright (c) 2025 Naveen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🔗 Useful References

- [React Router Docs](https://reactrouter.com/en/main)
- [Prisma ORM](https://www.prisma.io/docs)
- [Express.js](https://expressjs.com/)
- [Vite](https://vitejs.dev/)
- [Deployment with Render](https://render.com/docs/deploy-node-express-app)