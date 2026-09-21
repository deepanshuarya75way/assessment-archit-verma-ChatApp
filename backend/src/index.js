import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import cookieparser from "cookie-parser"



import {app, io, server} from "./lib/socket.js"
import { connectDB } from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import messagesRoutes from "./routes/message.routes.js"
import groupRoutes from "./routes/group.route.js"

dotenv.config()

const PORT = process.env.PORT || 5001

app.set("trust proxy", 1)
app.use(express.json())
app.use(cookieparser())
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "https://chat-app-one-gilt-eu2ajpozja.vercel.app",
    process.env.CLIENT_URL,
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/,
    /\.vercel\.app$/
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use("/api/auth" , authRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/api/groups",groupRoutes)

server.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
    connectDB()
})