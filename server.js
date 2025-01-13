const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const userRoute = require('./routes/user.routes');
const passwordRoute = require('./routes/password.routes');
const connectToDB = require('./config/db');
const path = require('path');
const app = express();

connectToDB();

const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', userRoute);
app.use('/user', passwordRoute);

app.listen(port);
