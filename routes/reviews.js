import express from "express";
import Review from '../models/review.js'
import Shop from '../models/shop.js'
import ObjectID from "bson-objectid";
import { upload, S3 } from "../middlewares/imgUpload.js"
const router = express.Router();

//리뷰 작성하기
router.post('/:shopId', upload.array('image'), async(req, res) => {
    const { shopId } = req.params;
    const { profilePic, text, rate } = req.body;
    const { userId } = res.locals
    if (text === '') {
        res.status(400).send({
          errorMessage: '내용을 작성해주세요.',
        });
        return;
      }

    try{
    if (!req.files){                                //유저가 이미지를 안 올렸을때
    const review = new Review({ 
        shopId, 
        userId, 
        profilePic, 
        text, 
        rate 
    })
    const shop = await Shop.findById(shopId) 
    await review.save(async function (){
        try{
        shop.reviews.push(ObjectID(review.reviewId));
        review.userIds.push(ObjectID(userId))
        await shop.save()
        await review.save()
        }catch(err){
            console.log(err)
        }
    })
    res.sendStatus(200)
    }else{
    const reviewImage = req.files.map(file => file.location);		//유저가 이미지를 올렸을때
    const reviewImageKey = req.files.map(file => file.key);
    const review = new Review({ 
        shopId, 
        userId, 
        profilePic, 
        text, 
        rate, 
        reviewImage, 
        reviewImageKey 
    })
    const shop = await Shop.findById(shopId)
    await review.save(async function (){
        try{
        shop.reviews.push(ObjectID(review.reviewId));
        review.userIds.push(ObjectID(userId))
        await shop.save()
        await review.save()
        }catch(err){
            console.log('이미지업로드', err)
        }
     })
     res.sendStatus(200)
    }
    }catch (err) {
		console.error(err)
		res.status(400).json({
			errorMessage: '리뷰 작성 실패'
        })
    }
});

// 리뷰 수정하기
router.put('/:reviewId', upload.array('image'), async(req, res) => {
	const { reviewId } = req.params
	const { text, rate } = req.body

    if (text === '') {
        res.status(400).send({
          errorMessage: '내용을 작성해주세요.',
        });
        return;
      }

	try{
    if(!req.files){
    await Review.findByIdAndUpdate(reviewId,
        {
        $set: { 
            text : text, 
            rate : rate,
        }}).exec()
		res.sendStatus(200)
    }else{
        const review = await Review.findById(reviewId)
        const key = review['reviewImageKey']
        console.log(text, rate, key)
        for(let i in key){
            console.log(key[i])
        S3.deleteObject({		    
            Bucket: 'myh99bucket', 
            Key: key[i]
          }, (err, data) => {
            if (err) { throw err; }
          })
        }

        const newReviewImage = req.files.map(file => file.location);
        const newReviewImageKey = req.files.map(file => file.key);
        await Review.findOneAndUpdate(reviewId,
            {
            $set: { 
                text : text, 
                rate : rate,
                reviewImage: newReviewImage,
                reviewImageKey: newReviewImageKey,
            }}).exec()
            res.sendStatus(200)
        }
	    } catch(err) {
		console.error(err)
		res.status(400).json({
			errorMessage: '댓글 수정 실패'
		})
	}
});

//리뷰 삭제하기
router.delete('/:shopId/:reviewId', async (req, res) => {
	const { shopId, reviewId } = req.params

	try {
	const shop = await Shop.findById(shopId).exec()
	shop.reviews.remove(reviewId)
    
    const review = await Review.findById(reviewId)
    const key = review['reviewImageKey']

    for(let i in key){
        console.log(key[i])
    S3.deleteObject({		    
        Bucket: 'myh99bucket', 
        Key: key[i]
      }, (err, data) => {
        if (err) { throw err; }
      })
    }		
    await Review.findByIdAndDelete(reviewId).exec()

		res.sendStatus(200)	
	}catch(err) {
		
        console.error(err)
		res.status(400).json({
			errorMessage: '리뷰 삭제 실패'
		})
	}
})

//리뷰 평점별로 보여주기
// router.get('/:shopId', async(req, res) => {
//     const { shopId } = req.params;
//     const { rate } = req.body;

//     try{
//     const reviews = await Review.find(
//         { 
//             $and: [{ shopId }, { rate }]
//         }).exec()
    
//     res.json({ reviews })
    
//     }catch(err) {
//         console.log(err)
//         res.status(400).json({
//             errorMessage: " 리뷰 불러오기 실패"
//         })
//     }
// });


export default router;