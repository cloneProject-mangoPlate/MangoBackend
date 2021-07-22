import passport from "passport";
import Kakao from "passport-kakao";
import dotenv from "dotenv";

dotenv.config();
const KakaoStrategy = Kakao.Strategy;

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

export default passport;
