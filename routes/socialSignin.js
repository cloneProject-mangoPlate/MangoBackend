import express from "express";
import passport from "passport";
import request from "request";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
// strategy import
import session from "express-session"
import Kakao from "passport-kakao";
import User from "../models/user.js";

dotenv.config()
const router = express.Router();
router.use(
  session({
    secret: "SECRET_CODE",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 2400 * 60 * 60 },
  })
);

const KakaoStrategy = Kakao.Strategy;
router.use(passport.initialize());
router.use(passport.session());
// 카카오로그인;
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
          req.session.user = req.user;
          console.log("session정보", req.session);
          res.redirect("/");
        } else {
          req.user.userId = myuser.userId;
          req.session.user = req.user;
          console.log("session222", req.session);
          res.redirect("/");
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

// 로그아웃
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    req.logout();
    res.redirect("/");
  });
});

export default router;
