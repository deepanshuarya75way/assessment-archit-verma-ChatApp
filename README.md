# 💬 ChatAPP — Real-Time Chat Application

A full-stack real-time chat application built with the **MERN stack** and **Socket.IO**.

---

## 🚀 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React (Vite) | UI Framework |
| Zustand | State Management |
| Socket.IO Client | Real-time communication |
| Axios | HTTP requests |
| TailwindCSS + DaisyUI | Styling |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | Server & REST API |
| MongoDB + Mongoose | Database |
| Socket.IO | Real-time events |
| JWT | Authentication (via cookies) |
| Cloudinary | Image uploads |
| bcrypt | Password hashing |

---

## 📁 Project Structure

```
ChatAPP/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers (auth, messages)
│   │   ├── lib/               # DB, Socket.IO, Cloudinary setup
│   │   ├── middleware/        # Auth middleware (protectRoute)
│   │   ├── models/            # Mongoose models (User, Message)
│   │   ├── routes/            # Express route definitions
│   │   ├── utils/             # Helper functions
│   │   └── index.js           # Entry point
│   └── .env                   # Environment variables
│
└── frontend/
    └── src/
        ├── components/        # UI components (ChatHeader, MessageInput, etc.)
        ├── pages/             # Page-level components
        ├── store/             # Zustand stores (auth, chat, theme)
        ├── lib/               # Axios instance, utilities
        └── App.jsx            # Root component & routing
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd ChatAPP
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## ✨ Features

- ✅ User Signup / Login / Logout
- ✅ JWT Authentication via HTTP-only cookies
- ✅ Real-time messaging with Socket.IO
- ✅ Online/Offline user status
- ✅ Image sharing in chat (via Cloudinary)
- ✅ Profile picture update
- ✅ Theme switching (DaisyUI themes)
- ✅ Protected routes

---

## 🔌 How Socket.IO Works in This App

```
User logs in
    ↓
Frontend connects socket with userId as query param
    ↓
Backend maps userId → socketId in userSocketMap
    ↓
When a message is sent → backend emits "newMessage" to receiver's socketId
    ↓
Receiver gets the message in real-time without refreshing
```

---

## 📄 License

MIT — free to use and modify.
