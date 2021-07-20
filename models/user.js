import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  reviews: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("User", userSchema);
