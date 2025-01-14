const mongoose = require('mongoose');

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // Ensure indexes are created
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Could not connect to MongoDB', err);
      process.exit(1); // Exit process with failure
    });
}

module.exports = connectToDB;
