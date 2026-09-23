const mongoose = require("mongoose");

//Returns a promise
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://meyajnasenipanda_db_user:nWa29deJmYPkqLXm@node.wdabdil.mongodb.net/devTinder");
}

module.exports = connectDB;
