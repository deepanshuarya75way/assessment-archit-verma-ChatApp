import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, getMyGroups, joinGroup } from "../controllers/group.controller.js";

const router = express.Router()

router.post("/create",protectRoute,createGroup)
router.get("/my-groups",protectRoute,getMyGroups)
router.post("/join",protectRoute,joinGroup)

export default router