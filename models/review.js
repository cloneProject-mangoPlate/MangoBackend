import mongoose from 'mongoose'

export const reviewSchema = new mongoose.Schema({
    userId: {
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
});

reviewSchema.virtual('reviewId').get(function () {
    return this._id.toHexString();
});

reviewSchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('Review', reviewSchema)