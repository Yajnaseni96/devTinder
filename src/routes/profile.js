const express = require('express');
const User = require('../models/user');
const {userAuth} = require('../middlewares/auth');
const {validateEditProfile} = require('../utils/validation');
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log("user", user)
        res.send(user);
    } catch(err) {
        res.status(400).send("ERROR: " + err);
    }    
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfile(req)) {
            throw new Error("Invalid field!!")
        }

        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();

        res.send(`${loggedInUser.firstName} Profile updated successfully!`);
    } catch(err) {
        res.status(400).send("ERROR: " + err);
    }    
});

profileRouter.patch("/forgotPassword", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});

        if(!user){
            throw new Error("Email not present");
        }

        if(validator.isStrongPassword(password)) {
            const passwordHash = await bcrypt.hash(password, 10);

            user.password = passwordHash;
            await user.save();
            res.send("Password updated successfully!!")
        } else  {
            throw new Error("Password is not valid!")
        }
    } catch(err) {
        res.status(400).send("Error saving the user" + err);
    }
});

module.exports = profileRouter;