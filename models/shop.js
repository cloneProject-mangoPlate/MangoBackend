import mongoose from "mongoose";

export const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  star: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Array,
    default: [],
  },
  likes: {
    type: Array,
    default: [],
  },
  data: {
    type: Array,
    required: true,
  },
  menuList: {
    type: Array,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  img_url: {
    type: Array,
    required: true,
  },
});

shopSchema.virtual("shopId").get(function () {
  return this._id.toHexString();
});
shopSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("Shop", shopSchema);
