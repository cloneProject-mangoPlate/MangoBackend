import express from "express";
import passport from "passport";
import request from "request";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
// strategy import
import Kakao from "passport-kakao";
import User from "../models/user.js";

dotenv.config()
const router = express.Router();
router.use(passport.initialize());
const KakaoStrategy = Kakao.Strategy;

// 카카오로그인
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  "kakao",
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_KEY,
      callbackURL: "/api/social/kakao/callback", // 위에서 설정한 Redirect URI
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = profile._json.kakao_account;
      user.token = accessToken;
      console.log("토큰!", accessToken);
      console.log("프로필이거", profile);
      done(null, user);
    }
  )
);

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
        const myuser = await User.findOne({
          userName: user,
          email,
        });
        // 이미 가입된 유저가 없으면 User 생성 후 토큰 생성하여 전달
        if (!myuser) {
          await User.create({
            userName: user,
            email,
          });
          const newuser = await User.findOne({
            userName: user,
            email,
          });
          // 토큰 정보: 유저아이디, 이름, 만료시간 24h
          const userInfo = {
            userId: newuser.userId,
            nickname: newuser.userName,
          };
          const options = {
            expiresIn: "24h",
          };
          const mytoken = jwt.sign(userInfo, process.env.SECRET_KEY, options);
          res.send({ profileImageURL, mytoken });
        }
        // 이미 가입된 유저가 있다면 jwt토큰 생성하여 전달
        else {
          const userInfo = { userId: myuser.userId, userName: myuser.userName };
          const options = {
            expiresIn: "24h",
          };
          const mytoken = jwt.sign(userInfo, process.env.SECRET_KEY, options);
          res.send({ profileImageURL, mytoken });
        }
      } catch (error) {
        console.error(error);
        res.status(401).redirect("/");
      }
    }
  );
}

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao"),
  authSuccess,
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
