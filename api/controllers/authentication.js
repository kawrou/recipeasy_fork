const User = require("../models/user");
const { generateToken, generateRefreshToken } = require("../lib/token");

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

  res.status(201).json({ token: accessToken, message: "OK" });
};

const refresh = async (req, res) => {};

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
  createToken: createToken,
  checkToken: checkToken,
};

module.exports = AuthenticationController;
