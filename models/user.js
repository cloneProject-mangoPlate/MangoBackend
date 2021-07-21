import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Array,
    default: [],
  },
  recentSearch: {
    type: Array,
    default: [],
  },
});

userSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("User", userSchema);
