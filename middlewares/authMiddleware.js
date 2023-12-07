const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      return res.status(401).send({
        message: "Authorization header is missing",
        success: false,
      });
    }

    const token = authorizationHeader.split(" ")[1];

    const decode = await verifyToken(token);

    if (decode) {
      req.body.userId = decode.id;
      next();
    } else {
      return res.status(401).send({
        message: "Auth Failed",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};




const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        reject(err);
      } else {
        resolve(decode);
      }
    });
  });
};

module.exports = authMiddleware;
