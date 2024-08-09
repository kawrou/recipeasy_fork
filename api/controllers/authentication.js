const User = require("../models/user");
const { generateToken, generateRefreshToken } = require("../lib/token");
const JWT = require("jsonwebtoken");

const createToken = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All login fields are required." });
  }

  const user = await User.findOne({ username: username }).exec();

  if (!user) {
    console.log("Auth Error: User not found");
    return res
      .status(401)
      .json({ message: "Please check your login details." });
  }

  if (user.password !== password) {
    console.log("Auth Error: Passwords do not match");
    return res
      .status(401)
      .json({ message: "Please check your login details." });
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ token: accessToken, message: "Login successful." });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  try {
    const payload = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ user_id: payload.user_id }).exec();
    if (!user) return res.status(401).json({ message: "Unathorized" });

    const accessToken = generateToken(user.id);
    res
      .status(201)
      .json({ token: accessToken, message: "Access token issued" });
  } catch (err) {
    console.error(err);
    if (err instanceof JWT.JsonWebTokenError) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logOut = async (req, res) => {};

//I THINK THIS IS UNECESSARY
//TODO: Needs a simple test for this
// uses token checker to test if a token is valid
const checkToken = async (req, res) => {
  // res.json({ message: 'Token is valid' });
  try {
    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const AuthenticationController = {
  createToken,
  checkToken,
  refresh,
};

module.exports = AuthenticationController;
