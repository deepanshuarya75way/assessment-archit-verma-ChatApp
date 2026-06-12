import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import cookieparser from "cookie-parser"



import {app, io, server} from "./lib/socket.js"
import { connectDB } from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import messagesRoutes from "./routes/message.routes.js"

dotenv.config()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin:["http://localhost:5173"],
    credentials: true
}))

app.use("/api/auth" , authRoutes)
app.use("/api/messages", messagesRoutes)

server.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
    connectDB()
})