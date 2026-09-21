import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { createGroup, getMyGroups, joinGroup } from "../controllers/group.controller";

const router = express.Router()

router.post("/create",protectRoute,createGroup)
router.get("/my-gropus",protectRoute,getMyGroups)
router.post("/join",protectRoute,joinGroup)

export default router