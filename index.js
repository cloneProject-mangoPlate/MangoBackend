import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import dotenv from "dotenv";
import passport from "passport";
import "./models/index.js";
import session from "express-session";

import path from "path";
const __dirname = path.resolve();

dotenv.config();
const app = express();

const corsOption = {
  origin: process.env.CORS,
  Credential: true,
  optionSuccessStatus: 200,
};
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(
//   session({
//     secret: "SECRET_CODE",
//     resave: true,
//     saveUninitialized: false,
//     cookie: { maxAge: 2400 * 60 * 60 },
//   })
// );

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  if (req.user) {
    const { profile, userId, profileImg } = req.user;
    const user = {
      userName: profile.nickname,
      userId: userId,
      profileImg: profileImg,
    };
    console.log("유저확인", user);
    res.send({ user });
  } else {
    res.send({});
  }
});

app.use("/api", router);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 연결 성공");
});

export { app, express };
