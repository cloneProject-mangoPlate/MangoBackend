import express from "express";
import Shop from "../models/shop.js";

const router = express.Router();

router.get("/", async (req, res) => {});

router.get("/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log(req.params);

    const shops = await Shop.find({
      keyword,
    });
    //   가봤어요 true false => 리뷰안에 유저아이디 / 샵아이디 있으면 true : false
    // 리뷰들 rated 카테고리별 개수 전달
    //   키워드로 찾을 수 없음 ID값으로 찾기
    if (shops.length === 0) {
      const shop = await Shop.findById(keyword);

      console.log(shop);
      res.json({ shop });
    }
    //   키워드로 찾을 수 있음 탑리스트 찾기
    else if (shops.length > 1) {
      const shopList = shops.map((s) => ({
        shopName: s.shopName,
        shopId: s.shopId,
        keyword: s.keyword,
        star: s.star,
        address: s.data[0][1],
        img_url: s.img_url,
      }));
      console.log(shopList);
      res.json({ shopList });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("음식점 정보가 없습니다.");
  }
});

export default router;
