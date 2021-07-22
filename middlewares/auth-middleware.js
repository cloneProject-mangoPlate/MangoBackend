import User from "../models/user.js";

export default (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization){
    res.status(401).send({
      errorMessage: "token이 없습니다"
    })
    return;
  }

  const [tokenType, tokenValue] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    res.sendStatus(401)
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);

    User.findById(userId).then((user) => {
      if (user === null) {
        throw new Error("invalidUser");
      }
      res.locals.userId = userId;
      next();
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(419).send({ message: "token 만료" });
      return;
    } else {
      res.status(401).send({ message: "token이 유효하지 않습니다." });
      return;
    }
  }
};
