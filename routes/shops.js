import express from "express";
import Shop from "../models/shop.js";
import Main from "../models/main.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const mainlist = await Main.find({});
    console.log(mainlist);
    res.json({ mainlist });
  } catch (error) {
    console.error(error);
    res.status(400).send("음식점 정보가 없습니다.");
  }
});
// 로그인 했으면 파람에 유저아이디 붙이기
router.get("/:keyword", async (req, res) => {
  try {
    // 유저아이디 가져오기
    const userId = req.user ? req.user.userId : null;
    const { keyword } = req.params;
    console.log(keyword);

    const shops = await Shop.find({
      keyword,
    });
    //   가봤어요 true false => 리뷰안에 유저아이디 / 샵아이디 있으면 true : false
    // 리뷰들 rated 카테고리별 개수 전달
    //   키워드로 찾을 수 없음 ID값으로 찾기
    if (shops.length === 0) {
      let visited;
      const shop = await Shop.findById(keyword)
        .populate("reviews")
        .sort("-created_at");
      if (userId) {
        // 유저 방문 여부 판단
        if (shop.reviews) {
          const visits = shop.reviews.map((s) => s.userIds.join());
          visited = visits.includes(userId) ? true : false;
        }
      }

      // 점수 카테고리별 개수
      const rates = { highsRate: 0, middleRate: 0, lowsRate: 0 };
      if (shop.reviews) {
        shop.reviews.forEach((e) => {
          if (e.rate === "맛있다") {
            rates.highsRate += 1;
          } else if (e.rate === "괜찮다") {
            rates.middleRate += 1;
          } else if (e.rate === "별로") {
            rates.lowsRate += 1;
          }
        });
      }

      const shopOne = {
        shop: shop,
        rates: rates,
      };
      shopOne.visited = userId ? visited : false;
      shop.views++;
      await shop.save();
      console.log(shopOne);
      res.json({ shopOne });
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

//가고싶다(즐겨찾기)
router.post("/:shopId/like", async (req, res) => {
  const { shopId } = req.params;
  const { userId } = res.locals;

  try {
    const shop = await Shop.findById(shopId).exec();
    const user = await User.findById(userId).exec();

    if (shop.likes.indexOf(userId) === -1) {
      shop.likes.push(userId);
      shop.save();
    }

    if (user.likes.indexOf(shopId) === -1) {
      user.likes.push(shopId);
      user.save();
    }

    res.status(200).json({ like: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      like: false,
      errorMessage: "가고싶다 등록 실패",
    });
  }
});

router.post("/:shopId/unlike", async (req, res) => {
  const { shopId } = req.params;
  const { userId } = res.locals;

  try {
    const shop = await Shop.findById(shopId).exec();
    const user = await User.findById(userId).exec();

    if (!shop.likes.indexOf(userId) === -1) {
      shop.likes.remove(userId);
      shop.save();
    }

    if (!user.likes.indexOf(shopId) === -1) {
      user.likes.remove(shopId);
      user.save();
    }

    res.status(200).json({ unlike: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      unlike: false,
      errorMessage: "가고싶다 등록 실패",
    });
  }
});

export default router;
