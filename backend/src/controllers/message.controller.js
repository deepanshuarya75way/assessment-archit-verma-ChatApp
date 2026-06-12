import User from "../models/user.model.js";
import Message from "../models/message.model.js"

import cloudinary from "../lib/cloudinary.js";
import {io, getReceiverSocketId} from "../lib/socket.js"

export const getUserForSideBar = async(req,res)=>{
    try {
        const LoggedInUserID = req.user._id
        const filteredUser = await User.find( {_id: {$ne: LoggedInUserID}}).select("-password")

        res.status(200).json(filteredUser)
    } catch (error) {
         console.error("Error in getUserForSideBar", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}
export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
          console.error("Error in getMessages", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}
export const sendMessage = async(req,res)=>{
    try {
        const {text, image} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id

        let imageUrl
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
            const newMessages = new Message({
                senderId,
                receiverId,
                text,
                image: imageUrl
            })

            await newMessages.save()

            const receiverSocketId = getReceiverSocketId(receiverId)
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newMessage", newMessages)
            }
            res.status(200).json(newMessages)

        
    } catch (error) {
  console.log("========== ERROR ==========");
  console.log(error);
  console.log("MESSAGE:", error.message);
  console.log("STACK:", error.stack);
  console.log("===========================");

  res.status(500).json({
    error: "Internal Server Error",
    message: error.message,
  });
}
}
