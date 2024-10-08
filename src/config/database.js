const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nodepractice:Ia460Y9tIrgsBoLG@nodepractice.ukyvs.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
