const { ValidationError } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../models");

const User = db.users;

const createUser = async (req, res) => {
  console.log(req.body);
  try {
    const { firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({
        message: `User already exists with email ${email}.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully.",
      user: newUser,
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({
        error: e.errors[0].message,
      });
    }
    return res.status(500).json({
      error: e.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: `User does not exist with email ${email}.`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password.",
      });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await User.update(
      {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    return res.status(200).json({
      message: "User logged in successfully.",
      user,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({
        error: e.errors[0].message,
      });
    }
    return res.status(500).json({
      error: e.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
};
