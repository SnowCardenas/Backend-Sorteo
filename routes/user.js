const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Endpoints

router.get("/allUsers", async (req, res) => {
  const users = await User.find({});

  res.send(users);
});

router.post("/signUp", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(400).send("El email esta en uso");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: passwordHash });
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email: email });

    if (!existUser) {
      return res.status(400).send("El Usuario no existe");
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return res.status(400).send("Password Incorrecto");
    }
    jwt.sign({ email: existUser.email, id: existUser._id }, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        throw err;
      }
      res.cookie("token", token).send(existUser);
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send({ message: "No tienes un token" });
  }
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        throw err;
      }
      res.send(user);
    });
  } else {
    res.send(null);
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });

  return res.sendStatus(200);
});

module.exports = router;
