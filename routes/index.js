import express from "express";
import shopsRouter from "./shops.js";
import reviewsRouter from "./reviews.js";
import searchRouter from "./search.js";
import socialRouter from "./socialSignin.js";

const router = express.Router();

router.use("/shops", shopsRouter);
router.use("/reviews", reviewsRouter);
router.use("/search", searchRouter);
router.use("/social", socialRouter);

export default router;
