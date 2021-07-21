import express from "express";
import passport from "passport";
import request from "request";
import jwt from "jsonwebtoken";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

// strategy import
import Kakao from "passport-kakao";
import User from "../models/user.js";

const router = express.Router();
router.use(
  session({
    secret: "SECRET_CODE",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 2400 * 60 * 60 },
  })
);
router.use(passport.initialize());
const KakaoStrategy = Kakao.Strategy;
router.use(passport.session());
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
        req.user.profileImg = profileImageURL;
        const myuser = await User.findOne({
          userName: user,
          email,
        });
        const myemail = await User.findOne({
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
          res.redirect("/api/social/user");
        }
        // 카카오 닉네임 갱신시 디비 유저 정보 업뎃
        else if (!myuser && myemail) {
          await User.updateOne({ email }, { $set: { userName: user } });
          req.user.userId = myemail.userId;
          res.redirect("/api/social/user");
        }
        // 이미 가입된 유저가 있다면
        else {
          req.user.userId = myuser.userId;
          res.redirect("/api/social/user");
        }
      } catch (error) {
        console.error(error);
        res.status(401).redirect("/");
      }
    }
  );
}

// 클라이언트에서 세션 쿠키있으면 get 요청 후에
// jwt 토큰 생성
router.get("/user", (req, res) => {
  const { userId, profile, profileImg } = req.user;
  const userInfo = { userId: userId, userName: profile.nickname };
  const options = {
    expiresIn: "24h",
  };
  console.log(req.user);
  const token = jwt.sign(userInfo, process.env.SECRET_KEY, options);
  res.send({ token, profileImg });
});

router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback", passport.authenticate("kakao"), authSuccess);

export default router;
