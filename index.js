import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import dotenv from "dotenv";

import "./models/index.js";

dotenv.config();
const app = express();

const corsOption = {
  origin: process.env.CORS,
  Credential: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 연결 성공");
});

export { app, express };
