import express from "express";
import auth from "../middlewares/auth-middleware.js";
import restaurantsRouter from "./restaurants.js";
import reviewsRouter from "./reviews";
import usersRouter from "./users";

const router = express.Router();

router.use("/retaurants", restaurantsRouter);
router.use("/reviews", reviewsRouter);
router.use("/users", usersRouter);
router.use(auth);


export default router;
