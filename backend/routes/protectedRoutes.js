import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  res.json({ message: "This is a protected route!", user: req.user });
});

export default router;
