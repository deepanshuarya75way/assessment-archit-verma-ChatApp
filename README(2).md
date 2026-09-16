# ChatApp

A full-stack, real-time messaging web application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO. The platform provides secure user authentication, instant one-on-one messaging, live online/offline user status tracking, real-time typing indicators, theme customization, and image sharing powered by Cloudinary.

---

## Features

### User Registration & Login
Users can register for a new account by providing a full name, email address, and password (minimum 6 characters). Existing users log in using their credentials. Client-side input validation ensures proper formatting before request dispatch, and server-side checks guard against duplicate email registrations and invalid credentials.

### JWT Cookie Authentication
Authentication relies on JSON Web Tokens (JWT) signed on the server and returned to the browser inside an `httpOnly`, `sameSite: strict` cookie. Tokens expire after 7 days, providing session persistence while protecting against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) vectors.

### Protected Client & Server Routes
On the frontend, React Router protects pages (`/` and `/profile`) by checking the authenticated user state (`authUser`). Unauthenticated users are redirected to `/login`. On the backend, an `auth.middleware.js` middleware (`protectRoute`) extracts and verifies the JWT cookie on protected endpoints before passing execution to the controllers.

### User Profiles & Profile Picture Uploads
Users can view their account details (Full Name, Email, Registration Date, Account Status) on the Profile page. Profile images are updated by selecting an image file, which is converted to Base64 format via the browser `FileReader` API and dispatched to the backend.

### Cloudinary Media Integration
Profile pictures and chat image attachments are uploaded to Cloudinary via the official `cloudinary` Node.js SDK. Upon successful upload, Cloudinary returns a `secure_url` which is persisted in MongoDB (`User.profilePic` or `Message.image`) and rendered in the frontend UI.

### Real-Time One-on-One Messaging
Users can send text messages and image attachments to connected contacts. Messages are dispatched via an HTTP POST request, saved to MongoDB for persistence, and instantly delivered to the receiver's active Socket.IO connection if they are online.

### Socket.IO Real-Time Engine
Real-time capabilities are powered by Socket.IO. Upon authentication, the client establishes a persistent WebSocket connection passing the `userId` in handshake query parameters. The server tracks online users in an in-memory `userSocketMap` dictionary and broadcasts status updates to all connected clients.

### Online / Offline User Status Tracking
When a user connects or disconnects, the Socket.IO server emits the updated online users array (`getOnlineUsers`) to all connected sockets. The frontend `Sidebar` and `ChatHeader` render live visual indicators (green status badges) for active users.

### Real-Time Typing Indicators
When a user focuses on the message input field, a `typing` event is emitted over Socket.IO to the receiver's socket ID. When the input loses focus, a `stopTyping` event is triggered. The active recipient's chat header updates dynamically to display a "Typing..." indicator.

### Image Messages
Users can attach image files (`image/*`) to chat messages. A local preview is displayed in `MessageInput.jsx` before sending. Images are uploaded to Cloudinary and rendered inline within chat message bubbles with click-to-view support.

### Message Persistence
All exchanged messages are stored in MongoDB under the `messages` collection with reference IDs for `senderId` and `receiverId`, ensuring chat history is retrieved seamlessly when selecting a contact.

### User Search & Filtering
The frontend `Sidebar` component provides a search input to filter contacts by name in real time, alongside an "Online only" checkbox toggle to display only currently active users.

### Theme Customization
Users can select from 30 built-in DaisyUI color palettes (e.g., dark, light, synthwave, dracula, coffee) on the Settings page. Selected themes persist across sessions in `localStorage` via Zustand (`useThemeStore.js`) and are dynamically applied to the document root element.

---

## Tech Stack

### Frontend
- **Framework & Library:** React 18 (Vite)
- **State Management:** Zustand (v5)
- **Routing:** React Router DOM (v6)
- **HTTP Client:** Axios (configured with `withCredentials: true`)
- **Real-Time Client:** Socket.IO Client (v4)
- **Styling:** TailwindCSS (v4), DaisyUI (v5)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Real-Time Server:** Socket.IO (v4)
- **Authentication:** JSON Web Token (`jsonwebtoken`), BcryptJS (`bcryptjs`)
- **Utilities:** Cookie Parser (`cookie-parser`), CORS (`cors`), Dotenv (`dotenv`)

### Database
- **Database:** MongoDB
- **ORM / ODM:** Mongoose (v9)

### Other Services & Tools
- **Cloud Storage:** Cloudinary API (v2 SDK)
- **Development Tooling:** Nodemon

---

## Architecture

### Component Interaction Flow

```
+-------------------------------------------------------------------+
|                           FRONTEND (React)                         |
|  [Pages / Components] <---> [Zustand Stores] <---> [Axios Client] |
+----------------------------------+--------------------------------+
                                   |
            +----------------------+----------------------+
            | HTTP / REST (Cookies)                       | WebSocket (Socket.IO)
            v                                             v
+----------------------------------+--------------------------------+
|                        BACKEND (Express.js)                        |
|  [Auth Middleware] -> [Controllers] <---> [Socket.IO Server Map]  |
+-----------------+--------------------------------+----------------+
                  |                                |
                  v                                v
    +---------------------------+    +----------------------------+
    |   MongoDB (Mongoose ODM)  |    | Cloudinary API (Media CDN) |
    |   - Users Collection      |    | - Profile Pictures         |
    |   - Messages Collection   |    | - Message Attachments      |
    +---------------------------+    +----------------------------+
```

### 1. Request Flow (Frontend → API → Backend → Database)
1. User actions trigger actions in Zustand stores (`useAuthStore`, `useChatStore`).
2. Axios issues HTTP requests with `withCredentials: true` to backend endpoints.
3. Express routes process incoming requests through security middleware.
4. Controllers invoke Mongoose queries against MongoDB and return JSON responses to update Zustand state.

### 2. Authentication Flow
1. User submits credentials via `/api/auth/login` or `/api/auth/signup`.
2. Backend validates data, hashes passwords via `bcryptjs`, and generates a JWT.
3. Backend attaches the token in an `httpOnly` HTTP cookie named `jwt`.
4. Subsequent requests pass through `protectRoute` middleware, which decodes the cookie using `JWT_SECRET` and attaches the user document to `req.user`.

### 3. Real-Time Communication Flow
1. On authentication, `useAuthStore.connectSocket()` initiates a Socket.IO connection to the backend passing `userId` in the handshake query.
2. The server records `{ [userId]: socketId }` in `userSocketMap` and emits `getOnlineUsers` to all connected sockets.
3. When sending a message, the `sendMessage` controller saves the message to MongoDB, checks `userSocketMap[receiverId]`, and if online, emits `newMessage` directly to the receiver's socket ID.

### 4. Image Upload Flow
1. User selects an image in `ProfilePage` or `MessageInput`.
2. The file is read via JavaScript `FileReader.readAsDataURL()` into a Base64 encoded string.
3. Base64 payload is POSTed/PUTed to the backend.
4. Backend controller passes the payload to `cloudinary.uploader.upload()`.
5. Cloudinary returns `secure_url`, which is stored in MongoDB and returned to the client.

---

## API Endpoints

### Authentication Routes (`/api/auth`)

| HTTP Method | Route | Purpose | Authentication Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Registers a new user account and sets JWT cookie | No |
| `POST` | `/api/auth/login` | Authenticates user credentials and sets JWT cookie | No |
| `POST` | `/api/auth/logout` | Clears the `jwt` cookie and ends the session | No |
| `PUT` | `/api/auth/update-profile` | Uploads profile picture to Cloudinary and updates user document | Yes (`protectRoute`) |
| `GET` | `/api/auth/check` | Returns authenticated user details for initial session restoration | Yes (`protectRoute`) |

### Message Routes (`/api/messages`)

| HTTP Method | Route | Purpose | Authentication Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/users` | Fetches all registered users except the logged-in user for sidebar contact list | Yes (`protectRoute`) |
| `GET` | `/api/messages/:id` | Fetches conversation history between logged-in user and specified user ID | Yes (`protectRoute`) |
| `POST` | `/api/messages/send/:id` | Sends a message (text/image) to recipient and triggers Socket.IO event | Yes (`protectRoute`) |

---

## Database Models

### `User` Model (`backend/src/models/user.model.js`)

**Purpose:** Manages user account information, credentials, and profile image reference.

| Field Name | Type | Options | Purpose |
| :--- | :--- | :--- | :--- |
| `email` | `String` | `required: true`, `unique: true` | User login email address |
| `fullName` | `String` | `required: true` | User display name |
| `password` | `String` | `required: true`, `minLength: 6` | Bcrypt hashed password |
| `profilePic` | `String` | `default: ""` | Cloudinary image URL |
| `createdAt` | `Date` | Auto (Timestamps) | Account creation timestamp |
| `updatedAt` | `Date` | Auto (Timestamps) | Account last update timestamp |

---

### `Message` Model (`backend/src/models/message.model.js`)

**Purpose:** Persists one-on-one chat messages exchanged between users.

| Field Name | Type | Options | Purpose |
| :--- | :--- | :--- | :--- |
| `senderId` | `ObjectId` | `ref: "User"`, `required: true` | Reference to the message sender |
| `receiverId` | `ObjectId` | `ref: "User"`, `required: true` | Reference to the message recipient |
| `text` | `String` | Optional | Message text payload |
| `image` | `String` | Optional | Cloudinary attachment image URL |
| `createdAt` | `Date` | Auto (Timestamps) | Message sent timestamp |
| `updatedAt` | `Date` | Auto (Timestamps) | Message update timestamp |

---

## Real-Time Communication

Socket.IO implementation is configured in `backend/src/lib/socket.js` and managed on the frontend within `useAuthStore.js` and `useChatStore.js`.

### Socket Connection & Lifecycle
- Connection URL: Backend server URL (`http://localhost:5001` in dev).
- Handshake Query: Pass authenticated user ID (`query: { userId: authUser._id }`).
- Reconnection & Transports: Configured with `["websocket", "polling"]` and `withCredentials: true`.

### Socket Events Reference

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `getOnlineUser` | Server → Client | `Array<string>` (userIDs) | Broadcasts array of active user IDs on connect/disconnect |
| `getOnlineUsers` | Server → Client | `Array<string>` (userIDs) | Secondary broadcast event for online user list compatibility |
| `newMessage` | Server → Client | `Object` (Message Document) | Emitted to `userSocketMap[receiverId]` when a new message is posted |
| `typing` | Client → Server → Target Client | `string` (receiverId / senderId) | Relayed to recipient to show typing status indicator |
| `stopTyping` | Client → Server → Target Client | `string` (receiverId / senderId) | Relayed to recipient to clear typing status indicator |

---

## Authentication & Security

### JSON Web Token (JWT) Security
- Tokens are signed on backend via `jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })`.
- Sent to client via HTTP-only cookie (`res.cookie("jwt", token, ...)`).
- Cookie settings: `httpOnly: true` (prevents XSS access), `sameSite: "strict"` (prevents CSRF attacks), `secure` (enabled in non-development environments).

### Password Protection
- Passwords are hashed using `bcryptjs` with salt generation (`bcrypt.genSalt(10)`).
- Raw passwords are never stored in the database or returned in API responses (`select("-password")`).

### Route Protection Middleware
- `protectRoute` inspects `req.cookies.jwt`.
- Decodes token and queries `User.findById(decoded.userId).select("-password")`.
- If invalid or expired, handles `JsonWebTokenError` and `TokenExpiredError` returning HTTP 401/500 statuses.

---

## Image / Media Handling

```
+------------------+         +------------------+         +------------------+         +------------------+
| Client Image     | Base64  | Backend Express  | Upload  | Cloudinary CDN   | Image   | MongoDB Document |
| Selection        | ------> | Controller       | ------> | API              | URL     | Saved            |
| (FileReader API) |         | (auth / message) |         | (uploader.upload)| ------> | (Mongoose)       |
+------------------+         +------------------+         +------------------+         +------------------+
```

1. **Client Conversion:** `FileReader.readAsDataURL(file)` transforms local image files into Base64 data strings.
2. **Server Upload:** Backend passes Base64 payloads directly to `cloudinary.uploader.upload(image)`.
3. **Cloudinary Storage:** Cloudinary optimizes and stores the image asset on CDN.
4. **URL Persistence:** The returned `secure_url` string is stored in the database and sent back to update frontend state.

---

## Project Structure

```
ChatApp/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controllers.js
│   │   │   └── message.controller.js
│   │   ├── lib/
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   └── socket.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── message.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── message.routes.js
│   │   ├── utils/
│   │   │   └── utils.js
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   │   └── Avatar_Logo.jpg
    │   ├── components/
    │   │   ├── skeletons/
    │   │   │   ├── MessageSkeleton.jsx
    │   │   │   └── SidebarSkeleton.jsx
    │   │   ├── AuthImagePattern.jsx
    │   │   ├── ChatContainer.jsx
    │   │   ├── ChatHeader.jsx
    │   │   ├── MessageInput.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── NoChatSelected.jsx
    │   │   └── Sidebar.jsx
    │   ├── constants/
    │   │   └── index.js
    │   ├── lib/
    │   │   ├── axios.js
    │   │   └── utils.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── SettingsPage.jsx
    │   │   └── SignUpPage.jsx
    │   ├── store/
    │   │   ├── useAuthStore.js
    │   │   ├── useChatStore.js
    │   │   └── useThemeStore.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or MongoDB Atlas)
- Cloudinary Account (Cloud Name, API Key, API Secret)

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ChatApp
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/chatApp
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   *The server runs on port 5001 by default.*

6. **Start Frontend Client:**
   ```bash
   cd frontend
   npm run dev
   ```
   *The Vite development server runs on http://localhost:5173 by default.*

---

## Environment Variables

### Backend Required Variables (`backend/.env`)

| Variable Name | Description | Required |
| :--- | :--- | :--- |
| `PORT` | Server listening port (defaults to 5000/5001) | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens | Yes |
| `NODE_ENV` | Environment identifier (`development` or `production`) | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name for media storage | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API access key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API access secret | Yes |

---

## API / Feature Summary

| Feature | Implementation | Technology |
| :--- | :--- | :--- |
| User Signup & Login | Password hashing with bcrypt, input validation | Express.js, BcryptJS |
| Authentication Session | HTTP-only cookie storing 7-day signed JWT | JSONWebToken, Cookie-Parser |
| Protected Endpoints | Express authorization middleware (`protectRoute`) | Express.js, JWT |
| Real-Time Messaging | Direct socket messaging to active recipient ID | Socket.IO, Express.js |
| Online User Tracking | Server-side connection map `userSocketMap` broadcasting connected socket array | Socket.IO, Zustand |
| Typing Indicators | Socket event relay (`typing`, `stopTyping`) | Socket.IO, React |
| Profile & Chat Image Upload | Base64 image payload uploaded to Cloudinary CDN | Cloudinary SDK, JavaScript FileReader |
| Chat History Persistence | Message document queries filtering `senderId` and `receiverId` | MongoDB, Mongoose |
| Contact Listing & Search | Excludes logged-in user, local string matching search and online filter | React, Mongoose |
| Theme Switcher | 30 DaisyUI color themes persisted in browser `localStorage` | DaisyUI, TailwindCSS, Zustand |

---



- **8 REST API Endpoints:** Verified across backend route definitions (`auth.routes.js` - 5 endpoints, `message.routes.js` - 3 endpoints).
- **2 Backend Route Modules:** Verified in `backend/src/routes/` (`auth.routes.js`, `message.routes.js`).
- **8 Backend Controller Functions:** Verified in `backend/src/controllers/` (`signup`, `login`, `logout`, `updateProfile`, `checkAuth`, `getUserForSideBar`, `getMessages`, `sendMessage`).
- **2 Mongoose Database Models:** Verified in `backend/src/models/` (`User`, `Message`).
- **1 Custom Auth Middleware:** Verified in `backend/src/middleware/auth.middleware.js` (`protectRoute`).
- **5 Socket.IO Event Channels:** Verified in `backend/src/lib/socket.js` and frontend stores (`getOnlineUser`/`getOnlineUsers`, `newMessage`, `typing`, `stopTyping`).
- **5 React Application Pages:** Verified in `frontend/src/pages/` (`HomePage`, `LoginPage`, `SignUpPage`, `ProfilePage`, `SettingsPage`).
- **9 Modular Frontend Components:** Verified in `frontend/src/components/` (`Navbar`, `Sidebar`, `ChatContainer`, `ChatHeader`, `MessageInput`, `NoChatSelected`, `AuthImagePattern`, `SidebarSkeleton`, `MessageSkeleton`).
- **3 Zustand State Stores:** Verified in `frontend/src/store/` (`useAuthStore`, `useChatStore`, `useThemeStore`).
- **30 DaisyUI Color Themes:** Verified in `frontend/src/constants/index.js` theme list.

---


\resumeItem {Architected a full-stack real-time chat application using \textbf{React 18}, \textbf{Node.js}, \textbf{Express.js}, and \textbf{MongoDB}, engineering \textbf{8 REST API endpoints} and integrating \textbf{Socket.IO} for instant message delivery.}

\resumeItem {Engineered secure authentication workflows utilizing \textbf{JSON Web Tokens (JWT)} stored in \textbf{HTTP-only cookies} with \textbf{BcryptJS} password hashing and custom Express authorization middleware.}

\resumeItem {Implemented real-time bidirectional communication featuring \textbf{5 Socket.IO event channels} for online/offline user status synchronization, real-time typing indicators, and instant messaging.}

\resumeItem {Integrated \textbf{Cloudinary CDN} for media storage by handling client-side \textbf{Base64 encoding} and server-side image uploads for profile avatars and chat attachments.}

\resumeItem {Built a responsive single-page user interface using \textbf{TailwindCSS}, \textbf{DaisyUI}, and \textbf{Zustand} state management across \textbf{14 React pages and components}, supporting live search filtering and 30 customizable themes.}
