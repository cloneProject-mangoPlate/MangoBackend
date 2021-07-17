import mongoose from 'mongoose'

export const reviewSchema = new mongoose.Schema({
    shop_name: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    rate: {
        type: String,
        required: true,
    },
    
}, {timestamps: true});

reviewSchema.virtual('reviewId').get(function () {
    return this._id.toHexString();
});

reviewSchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('Review', reviewSchema)