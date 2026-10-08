const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {validateSignUpData} = require('../utils/validation');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    //validate data
    validateSignUpData(req);

    const {firstName, lastName, emailId, password} = req.body;
    //encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({firstName, lastName, emailId, password: passwordHash});

    try {
        await user.save();
        res.send("User added successfully!!")
    } catch(err) {
        res.status(400).send("Error saving the user" + err);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error("Email not present");
        }

        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid) {

            //Create a JWT token - Not anymore as we have declared it in userSchema we can use it directly
            // const token = await jwt.sign({_id: user._id}, "DEVTinder@880", {expiresIn: "7d"})
            
            const token = await user.getJWT();
            res.cookie("token", token);
            res.status(200).send(user);
        } else {
            throw new Error("Login not successful");
        }
    } catch(err) {
        res.status(400).send("ERROR: " + err);
    }
});

authRouter.post("/logout", async(req, res) => {
    const {emailId} = req.body;
    const user = await User.findOne({emailId: emailId});;
    const token = await user.getJWT();

    res.cookie(token, null, {
        expires: new Date(Date.now())
    });

    res.send("Logout successful!!")
});

module.exports = authRouter;