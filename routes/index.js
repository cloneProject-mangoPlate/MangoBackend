import express from "express";
import auth from "../middlewares/auth-middleware.js";
import shopsRouter from "./shops.js";
import reviewsRouter from "./reviews.js";
import searchRouter from "./search.js";
<<<<<<< HEAD
import signinRouter from "./socialSignin.js";
=======
import socialRouter from "./socialSignin.js"
>>>>>>> ba029d8f7a98bc73c38d3d1254f9358d87d99244

const router = express.Router();

router.use("/shops", shopsRouter);
router.use("/reviews", reviewsRouter);
router.use("/search", searchRouter);
<<<<<<< HEAD
router.use("/social", signinRouter);
router.use(auth);
=======
router.use("/social", socialRouter);
// router.use(auth);
>>>>>>> ba029d8f7a98bc73c38d3d1254f9358d87d99244

export default router;
