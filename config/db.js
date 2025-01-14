const mongoose = require('mongoose');
require('dotenv').config();

function connectToDB() {
  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in your .env file');
    process.exit(1); // Exit if the environment variable is missing
  }

  mongoose
    .connect(process.env.MONGO_URI) // No additional options needed
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Could not connect to MongoDB', err);
      process.exit(1); // Exit the app if the connection fails
    });
}

module.exports = connectToDB;
