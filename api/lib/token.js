const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

/**
 * This function is used to generate a JWT authentication
 * token for a specific user.
 * JWTs in 100 Seconds: https://www.youtube.com/watch?v=UBUNrFtufWo
 */
const generateToken = (user_id) => { 
  return JWT.sign(
    {
      user_id: user_id,
      iat: Math.floor(Date.now() / 1000),
    },
    secret,
    { expiresIn: "10s" }
  );
};

const generateRefreshToken = (user_id) => {
  return JWT.sign(
    {
      user_id: user_id,
      iat: Math.floor(Date.now() / 1000),
    },
    refreshTokenSecret,
    { expiresIn: "1d" }
  );
};

const decodeToken = (token) => {
  return JWT.decode(token, secret);
};

module.exports = { generateToken, generateRefreshToken, decodeToken };
