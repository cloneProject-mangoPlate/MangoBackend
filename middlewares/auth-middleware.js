





import User from "../models/user.js";
import request from "request";

export default (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 사용하세요",
    });
    return;
  }

  try {
    const options = {
      uri: "https://kapi.kakao.com/v1/user/access_token_info",
      headers: { Authorization: `Bearer ${token}` },
    };
    request(options, function (err, response, body) {
      //callback
    });

    request.get(
      {
        headers: { Authorization: `Bearer ${token}` },
        url: "https://kapi.kakao.com/v1/user/access_token_info",
      },
      function (error, response, body) {
        console.log(response);
        if (response) {
          res.locals.userId = id;
          next();
        } if(error){
          throw 
        }
        // const { id } = body;
        // console.log(id);
      }
    );
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


