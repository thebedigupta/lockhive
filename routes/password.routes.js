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

router.post('/passwords', ensureAuthenticated, async (req, res) => {
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

// Update an existing password
router.put('/passwords/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { website, username, password, category } = req.body;
    const updatedPassword = await Password.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { website, username, password, category },
      { new: true, runValidators: true }
    );
    if (!updatedPassword) {
      return res.status(404).json({ message: 'Password not found' });
    }
    res.status(200).json(updatedPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
});

// Delete an existing password
router.delete('/passwords/:id', ensureAuthenticated, async (req, res) => {
  try {
    const deletedPassword = await Password.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deletedPassword) {
      return res.status(404).json({ message: 'Password not found' });
    }
    res.status(200).json({ message: 'Password deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting password', error });
  }
});

module.exports = router;
