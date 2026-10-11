const mongoose = require("mongoose");
const User = require("../models/user");
//Returns a promise
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://meyajnasenipanda_db_user:nWa29deJmYPkqLXm@node.wdabdil.mongodb.net/devTinder");

    // const result = await User.updateMany(
    //     {}, 
    //     { $set: { photoUrl: "https://pravatar.cc" } }
    // );

}

module.exports = connectDB;
