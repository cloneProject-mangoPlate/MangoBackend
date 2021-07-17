import express from 'express'
import Shop from '../models/shop.js'

const router = express.Router();

router.post('/:word', async(req, res) => {
    const { searchWord } = req.params;

    if (searchWord === "") {
        res.status(400).send({
            errorMessage: ' 검색어를 입력해주세요. '
        })
    }
    // todo 띄어쓰기가 들어갔을때는? split? 띄어쓰기 들어가는 태그는? 
    try{
    const shops = Shop.find({ category : searchWord }) // 카테고리 어떤형식으로 저장? 리스트로 저장
    const sortedShops = shops.filter( shops => shops.category === searchWord) // 하나만 비효율 if문쓰지말고 해보기

    
    res.json({ sortedShops })

    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage:"검색 실패" 
        })
    }
});

export default router;