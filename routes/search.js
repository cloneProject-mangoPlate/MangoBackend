import express from 'express'
import Shop from '../models/shop.js'
import Fuse from 'fuse.js'

const router = express.Router();

router.get('/:word', async(req, res) => {
    const searchWord = decodeURIComponent(req.params.word)

    if (searchWord === "") {
        res.status(400).send({
            errorMessage: ' 검색어를 입력해주세요. '
        })
    }

    try{
    const shops = await Shop.find()
    const options = {
        includeScore: true,
        keys: ["tags", "menuList","shopName"]
    }
    
    const fuse = new Fuse(shops,options)
    const result = fuse.search(searchWord)

    res.status(200).json( result )

    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage:"검색 실패" 
        })
    }
});


export default router;