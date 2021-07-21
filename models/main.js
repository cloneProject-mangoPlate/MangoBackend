import mongoose from "mongoose";

export const mainSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Main", mainSchema);
