const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;

        if(!token) {
            throw new Error("Token is not valid!!");
        }

        const decodedObj = await jwt.verify(token, "DEVTinder@880");
        const { _id } = decodedObj;
        const user = await User.findById(_id);

        if(!user) {
            throw new Error("User is not found");
        }

        req.user = user;
        next(); //since we are using a middleware, next will take us back to request handler
    } catch(err) {
        res.status(400).send("ERROR: ", err);
    }
};

module.exports = { userAuth };