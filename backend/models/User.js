import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String,
     required: true,
      unique: true },
  email: { type: String,
     required: true,
      unique: true },
  name: String,
  picture: String,
  refreshToken: String // latest refresh token issued to user
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);