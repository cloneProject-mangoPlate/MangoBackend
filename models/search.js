import mongoose from "mongoose";

export const searchSchema = new mongoose.Schema({
    searchWord : {
        type: String,
        require: true,
    },
});

export default mongoose.model("Search", searchSchema);