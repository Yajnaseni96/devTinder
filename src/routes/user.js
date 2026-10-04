const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

userRouter.get("/user/requests/pending", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        //}).populate("fromUserId", ["firstName", "lastName"]); //can be done like this or below
        }).populate("fromUserId", "firstName lastName photoUrl age about skills");

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        });
    } catch(err) {
        res.status(400).json({
            message: err
        });
    }
});

module.exports = userRouter;