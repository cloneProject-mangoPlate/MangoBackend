import express from 'express'
import Shop from '../models/shop.js'
import User from '../models/user.js'
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
    const user = await User.findById(userId)
    user.recentSearch.push(searchWord);
    await user.save()
    
    const shops = await Shop.find()
    const options = {
        includeScore: true,
        keys: ["tags", "menuList","shopName"]
    }
    
    const fuse = new Fuse(shops,options)
    const result = fuse.search(searchWord)

    if (result.length === 0 ){
        res.status(400).send({
            ErrorMessage: `${searchWord}에 대한 검색결과가 없습니다.`
        })
    }else{
        res.status(200).json( result )
    }
    }catch(err){
        console.log(err)
        res.status(400).send({
            errorMessage:"검색 실패" 
        })
    }
});


export default router;