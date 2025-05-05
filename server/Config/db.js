const mongoose = require('mongoose');
require('dotenv').config();

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL)
    console.log(`MongoDB Connected: at port ${process.env.PORT}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
