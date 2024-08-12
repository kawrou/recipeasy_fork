const { generateToken } = require("../lib/token");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// @desc Create new user
// @route POST /users
// @access Private
const create = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); //last parameter -> salt rounds

    await User.create({
      email,
      password: hashedPassword,
      username,
    });

    res.status(201).json({ message: `New user ${username} created.` });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400)({ message: "Invalid user data received." });
    }

    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or email already exists." });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
};

//TODO: Implement
//This controller isn't actually being used and can't be used until the create function above hashes password
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//TODO: CAN DELETE as JWT implementation has changed
const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

const UsersController = {
  create: create,
  login: login,
  logout,
  logout,
};

module.exports = UsersController;
