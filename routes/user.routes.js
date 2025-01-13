const expres = require('express');
const router = expres.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const passwordModel = require('../models/password.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  body('email').trim().isEmail().isLength({ min: 11 }),
  body('password').trim().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req); // if error is not empty execute this
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Email ' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Email or Password' }] });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token);
    res.redirect('/user/passwords');
  }
);

router.get('/register', (req, res) => {
  res.render('register');
});
router.post(
  '/register',
  body('email').trim().isEmail().isLength({ min: 11 }),
  body('password').trim().isLength({ min: 6 }),
  body('username').trim().isLength({ min: 5 }),
  body('fname').trim().isLength({ min: 3 }),
  body('lname').trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, username, fname, lname } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      email,
      password: hashedPassword,
      username,
      fname,
      lname,
    });

    const result = await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('token', token, { httpOnly: true });
    // res.json(user);
    res.redirect('/user/passwords');
  }
);
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
