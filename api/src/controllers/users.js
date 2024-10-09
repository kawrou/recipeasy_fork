const { generateToken } = require("../lib/token");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// @desc Create new user
// @route POST /users
// @access Private
const create = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return res.status(400).json({ message: "Invalid user data received." });
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
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or email already exists." });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
};


const UsersController = {
  create: create,
};

module.exports = UsersController;
