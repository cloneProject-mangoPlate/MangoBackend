import express from "express";
import Review from '../models/review.js'
import Shop from '../models/shop.js'
const router = express.Router();

//리뷰 작성하기
router.post('/:shopId', async(req, res) => {
    const { shopId } = req.params;
    const { nickname, profilePic, text, rate } = req.body;
    const { userId } = res.locals
       
    if (text === '') {
        res.status(400).send({
          errorMessage: '내용을 작성해주세요.',
        });
        return;
      }

    try{
    const review = new Review({ shopId, userId, nickname, profilePic, text, rate })
    const shop = await Shop.findById(shopId) 
    review.save(function (){
        shop.reviews.push(review.reviewId);
        review.users.push(userId)
    })
    
    res.sendStatus(200)
    }catch (err) {
		console.error(err)
		res.status(400).json({
			errorMessage: '리뷰 작성 실패'
        })
    }
});

// 리뷰 수정하기
router.put('/:shopId/:reviewId', async(req, res) => {
	const { shopId, reviewId } = req.params
	const { text, rate } = req.body

    if (text === '') {
        res.status(400).send({
          errorMessage: '내용을 작성해주세요.',
        });
        return;
      }

	try{
    await Review.findByIdAndUpdate( 
        {
            $and: [{ shopId }, { reviewId }],
        },
        {
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

//리뷰 삭제하기
router.delete('/:shopId/:reviewId', async (req, res) => {
	const { shopId, reviewId } = req.params

	try {
	const shop = await Shop.findById(shopId).exec()
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
router.get('/:shopId', async(req, res) => {
    const { shopId } = req.params;
    const { rate } = req.body;

    try{
    const reviews = await Review.find(
        { 
            $and: [{ shopId }, { rate }]
        }).exec()
    
    res.json({ reviews })
    
    }catch(err) {
        console.log(err)
        res.status(400).json({
            errorMessage: " 리뷰 불러오기 실패"
        })
    }
});

//가고싶다(즐겨찾기)
router.post('/:shopId/mark', async(req,res) => {
    const { shopId } = req.body
    const { userId } = res.locals
    
    try{
        const shop = await Shop.findById(shopId).exec()
        const user = await User.findById(userId).exec()
        
        if (shop.markedUser.indexOf(userId) === -1) {
        shop.markedUser.push(userId);
        shop.save();
        };
        
        if (user.markedShop.indexOf(shopId) === -1) {
            user.markedShop.push(shopId);
            user.save();
        };

        res.status(200).json({ mark: true })

    }catch(err){
        console.log(err)
        res.status(400).json({
            mark: false,
            errorMessage: "가고싶다 등록 실패"
        })
    }
});

router.post('/:shopId/unmark', async (req, res) => {
    const { shopId } = req.body
    const { userId } = res.locals
    
    try{
    
        const shop = await Shop.findById(shopId).exec()
        const user = await User.findById(userId).exec()

        if (!shop.markedUser.indexOf(userId) === -1) {
            shop.markedUser.remove(userId);
            shop.save();
        };

        if (!user.markedShop.indexOf(shopId) === -1) {
            user.markedShop.remove(shopId);
            user.save();
        };

        res.status(200).json({ unmark: true })

    }catch(err){
        console.log(err)
        res.status(400).json({
            unmark: false,
            errorMessage: "가고싶다 등록 실패"
        })
    }
});

export default router;