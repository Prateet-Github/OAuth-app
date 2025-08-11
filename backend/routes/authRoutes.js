import express from "express";
import jwt from "jsonwebtoken";
import { verifyIdToken } from "../auth/googleAuth.js";
import { signAccessToken, signRefreshToken } from "../middleware/auth.js";

const router = express.Router();

// Google OAuth Login
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    const payload = await verifyIdToken(idToken);

    const userPayload = { id: payload.sub, email: payload.email };

    // Sign tokens
    const accessToken = signAccessToken(userPayload);
    const refreshToken = signRefreshToken(userPayload);

    // Send refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "strict",
      path: "/"
    });

    res.json({ accessToken, user: userPayload });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid Google ID Token" });
  }
});

// Refresh Token Route
router.post("/refresh_token", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/"
  });
  res.json({ message: "Logged out successfully" });
});

export default router;