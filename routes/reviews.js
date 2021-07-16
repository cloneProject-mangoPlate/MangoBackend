import express from "express";
import Review from '../models/review.js'
import Shop from '../models/shop.js'
const router = express.Router();

//리뷰 작성하기
router.post('/:shop_name', async(req, res) => {
    const { shop_name } = req.params;
    const { userId, text, rate } = req.body;
       
    if (text === '') {
        res.status(400).send({
          errorMessage: '내용을 작성해주세요.',
        });
        return;
      }

    try{
    const review = await Review.Create( shop_name, userId, text, rate ).exec()
    const shop = await Shop.findById(shop_name) // 음식점이름이 겹치면?
	shop.reviews.push(review);
    shop.save()
    
    res.sendStatus(200)
    }catch (err) {
		console.error(err)
		res.status(400).json({
			errorMessage: '리뷰 작성 실패'
        })
    }
});

// 리뷰 수정하기
router.put('/:shop_name', async(req, res) => {
	const { shop_name } = req.params
	const { text, rate } = req.body
	try{
    await Review.findByIdAndUpdate(shop_name, {
        $set: { 
            text : text, 
            rate : rate,
        }}).exec()
		res.sendStatus(200)
	} catch(err) {
		console.error(err)
		res.status(400).json({
			errorMessage: '댓글 수정 실패'
		})
	}
});

//리뷰 수정하기
router.delete('/:shop_name/:reviewId', async (req, res) => {
	const { shop_name } = req.params
	const { reviewId } = req.body
	try {
	const shop = await Shop.findById(shop_name).exec()
	await shop.reviews.id(reviewId).remove()
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
router.get('/:shop_name', async(req, res) => {
    const { shop_name } = req.params;
    const { rate } = req.body;

    try{
    const shop = await Shop.findOne({ shop_name : shop_name }).exec()
    const rateReviews = shop.filter(shop => shop.review.rate === rate);
    res.json({ rateReviews })
    }catch(err) {
        console.log(err)
        res.status(400).json({
            errorMessage: " 리뷰 불러오기 실패"
        })
    }
});

export default router;