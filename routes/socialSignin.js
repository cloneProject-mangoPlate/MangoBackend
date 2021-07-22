import express from "express";
import passport from "../config/passport.js";
import request from "request";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

const router = express.Router();

dotenv.config();

function authSuccess(req, res) {
  const { profile, email, token } = req.user;
  const user = profile.nickname;
  console.log("social login test", user, email, token);
  request.post(
    {
      headers: { Authorization: `Bearer ${token}` },
      url: "https://kapi.kakao.com/v1/api/talk/profile",
      json: true,
    },
    async function (error, response, body) {
      try {
        const { profileImageURL } = body;
        req.user.profileImg = profileImageURL;
        const myuser = await User.findOne({
          userName: user,
          email,
        });

        // 이미 가입된 유저가 없으면 User 생성
        if (!myuser) {
          await User.create({
            userName: user,
            email,
          });
          const newuser = await User.findOne({
            userName: user,
            email,
          });
          req.user.userId = newuser.userId;
          res.redirect("http://localhost:3000/signin=kakao");
        } else {
          req.user.userId = myuser.userId;
          res.redirect("http://localhost:3000/signin=kakao");
        }
      } catch (error) {
        console.error(error);
        res.status(401).redirect("http://localhost:3000/signin=kakao");
      }
    }
  );
}

// 클라이언트에서 세션 쿠키있으면 get 요청 후에
// jwt 토큰 생성
router.get("/user", (req, res) => {
  console.log("리퀘스트테스트1", req.session);
  console.log("리퀘스트테스트1", req.user);
  const { userId, profile, profileImg } = req.session.passport.user;
  const userInfo = { userId: userId, userName: profile.nickname };
  const options = {
    expiresIn: "24h",
  };
  const token = jwt.sign(userInfo, process.env.SECRET_KEY, options);
  res.send({ token, profileImg });
});

router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback", passport.authenticate("kakao"), authSuccess);

// router.get("/kakao/callback", (req, res, next) => {
//   passport.authenticate(
//     "kakao",
//     { failureRedirect: "/" },
//     (err, profile, token) => {
//       if (err) return next(err);
//       authSuccess;
//       // res.redirect(`http://hanghaeeats.shop/token=${token}`);
//     }
//   )(req, res, next);
// });

// 로그아웃
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    req.logout();
    res.redirect("/");
  });
});

export default router;
