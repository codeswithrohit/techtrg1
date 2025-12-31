import mongoose from "mongoose";

const PasswordSchema = new mongoose.Schema({
  password: { type: String, required: true },
});

export default mongoose.models.Password || mongoose.model("Password", PasswordSchema);
