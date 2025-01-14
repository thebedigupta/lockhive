const mongoose = require('mongoose');

function connectToDB() {
  mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
  });
}

module.exports = connectToDB;
