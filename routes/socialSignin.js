import express from "express";
import User from "../models/user.js";
import passport from "passport";
import request from "request";

// strategy import
import Kakao from "passport-kakao";

const router = express.Router();
router.use(passport.initialize());

const KakaoStrategy = Kakao.Strategy;

// router.get("/login", function (req, res) {
//   res.render("login");
// });

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
      clientID: "88806fd7f63dd24d3065af028f601b16",
      callbackURL: "/api/social/kakao/callback", // 위에서 설정한 Redirect URI
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = profile._json.kakao_account;
      // user.provider = profile.provider;
      // req.session.save(function(err){

      // })
      user.token = accessToken;
      console.log("토큰!", accessToken);
      console.log("프로필이거", profile);
      done(null, user);
    }
  )
);

function authSuccess(req, res) {
  const { profile, email, token } = req.user;
  let user = profile.nickname;
  console.log("social login test", user, email, token);
  request.post(
    {
      headers: { Authorization: `Bearer ${token}` },
      url: "https://kapi.kakao.com/v1/api/talk/profile",
      json: true,
    },
    async function (error, response, body) {
      const { profileImageURL } = body;
      console.log(profileImageURL);

      const myuser = await User.findOne({
        userName: user,
        email: email,
      });
      if (!myuser) {
        await User.create({
          userName: user,
          email: email,
        });
        res.send({ profileImageURL, user, token });
      } else {
        res.send({ profileImageURL, user, token });
      }
    }
  );
}

router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback", passport.authenticate("kakao"), authSuccess);

export default router;
