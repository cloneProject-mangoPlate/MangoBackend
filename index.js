import express from "express";
import cors from "cors";
import router from "./api/index.js";
import dotenv from 'dotenv'
import "./models/index.js";

dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.listen(process.env.PORT || 3000, () => {
    console.log("서버 연결");
});
