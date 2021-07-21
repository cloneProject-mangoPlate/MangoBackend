import express from 'express'
import Shop from '../models/shop.js'
import User from '../models/user.js'
import Search from '../models/search.js'
import Fuse from 'fuse.js'

const router = express.Router();

router.get('/:word', async(req, res) => {
    const searchWord = decodeURIComponent(req.params.word)
    // const { userId }= res.locals

    if (searchWord === "") {
        res.status(400).send({
            errorMessage: ' 검색어를 입력해주세요. '
        })
    }

    try{
    const user = await User.findById(userId)
    const words = user.recentSearch
    
    if(words.indexOf(searchWord) === -1){
        words.push(searchWord);
        await user.save()
    
    }else{
        const wordIndex = words.indexOf(searchWord)
        const slicedWord = words.slice(wordIndex, wordIndex)
        words.push(slicedWord);
        await user.save()
    }

    const newSearch = new Search({ searchWord })
    await newSearch.save()
    
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

router.get('/', async(req,res) => {
    // const { userId }= res.locals

    // const recentSearch = await User.findById(userId).recentSearch
    
    const recomSearch = ["치킨", "찜닭", "파스타", "떡볶이", "청담 맛집", "백종원", "맥주"]
    
    const findPopularSearch = await Search.aggregate([
        { $sortByCount : '$searchWord' },
        { $limit : 7 }
    ])
    const popularSearch = []
    for (let i in findPopularSearch){
        popularSearch.push(findPopularSearch[i]._id)
    }
    const search = { recentSearch, recomSearch, popularSearch}

    res.json( search )
})

//todo 해당 검색어 삭제후 다시 최근검색어 보낸다 = res.json(recentSearch)
//아니면 프론트에서 다시 최근검색어 렌더링해준다 = res.status(200)
router.get('/recent', async(req,res) => {
    const { deleteWord } = req.body
    // const { userId }= res.locals

    const recentSearch = await User.findByIdAndDelete()

    res.json(popularSearch)
})
export default router;