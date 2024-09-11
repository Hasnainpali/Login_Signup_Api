const express = require("express");
const { User } = require("../models/Users");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({
        msg: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        msg: "User is already registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.status(201).json({
      success: true,
      msg: "User registered successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error during signup:", error); // Log the error for debugging
    res.status(500).json({ msg: "Something went wrong" });
  }
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        return res.status(404).json({ error: true, msg: "User not found" });
      }

      const matchPassword = await bcrypt.compare(password, existingUser.password);
      if (!matchPassword) {
        return res.status(400).json({ error: true, msg: "Invalid email or password" });
      }

      res.status(200).json({ user: existingUser });
    } catch (error) {
      res.status(500).json({ error: true, msg: "Something went wrong" });
    }
});

router.get('/', async (req, res) => {
    try {
        const userList = await User.find();
        if (!userList) {
          return res.status(500).json({ success: true });
        }
        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ success: false, msg: "Something went wrong" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ message: "The user with the given ID was not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
          return res.status(200).json({ success: true, message: "The user is deleted" });
        } else {
          return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
});

module.exports = router;
