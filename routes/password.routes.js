const express = require('express');
const router = express.Router();
const Password = require('../models/password.model');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/passwords', ensureAuthenticated, async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.user._id });
    // res.status(200).json(passwords);
    res.render('password');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching passwords', error });
  }
});

router.post('/create', ensureAuthenticated, async (req, res) => {
  try {
    const { website, username, password, category } = req.body;
    const newPassword = new Password({
      website,
      username,
      password,
      category,
      user: req.user._id,
    });
    await newPassword.save();
    res.status(201).json(newPassword);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: 'Username already exists for this user' });
    } else {
      res.status(500).json({ message: 'Error creating password', error });
    }
  }
});

module.exports = router;
