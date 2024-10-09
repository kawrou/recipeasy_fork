const mongoose = require("mongoose");

const connectToDatabase = async () => {
  const mongoDbUrl = process.env.MONGODB_URL;

  if (!mongoDbUrl) {
    console.error(
      "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set. See the README for more details."
    );
    throw new Error("No connection string provided");
  }

  try {
    await mongoose.connect(mongoDbUrl);
    if (process.env.NODE_ENV !== "test") {
      console.log("Successfully connected to MongoDb");
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

module.exports = { connectToDatabase };
