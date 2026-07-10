import {Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:["https://chat-app-one-gilt-eu2ajpozja.vercel.app"],
    }
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

const userSocketMap = {}

io.on("connection", (socket) => {
    
    console.log("A user connected", socket.id)

    const userId = socket.handshake.query.userId

    if(userId) userSocketMap[userId] = socket.id

   
    io.emit("getOnlineUser" , Object.keys(userSocketMap))

    socket.on("typing", (receiverId) => {
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) io.to(receiverSocketId).emit("typing", userId)
    })

    socket.on("stopTyping", (receiverId) => {
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) io.to(receiverSocketId).emit("stopTyping", userId)
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUser" , Object.keys(userSocketMap))
    })
})

export {app, server, io} 