import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt
    if(!token){
         res.status(500).json({message:"UnAuthorized - No token Found"})
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET)
    if(!decoded){
         res.status(500).json({message:"UnAuthorized - No token Found"})
    }

    const user = await User.findById(decoded.userId).select("-password")

    if(!user){
        res.status(500).json({message:"UnAuthorized - User Not Found"})
    }

    req.user = user
    next()

    } catch (error) {
        if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
    }
    next(error);
    }
}