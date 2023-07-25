const mongoose = require("mongoose");

// db connection
const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log("DB connected successfully.")
    } catch (err) {
        console.log("DB Connection failed,", err)
    }
}

module.exports = db;