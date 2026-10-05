const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();
const userData = ["firstName", "lastName", "age", "photoUrl", "about", "skills"];

userRouter.get("/user/requests/pending", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        //}).populate("fromUserId", ["firstName", "lastName"]); //can be done like this or below
        }).populate("fromUserId", userData);

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", userData)
        .populate("toUserId", userData);

        if(!connections) {
            throw new Error("No connections found")
        }
        
        const data = connections.map((row) => {
            if(loggedInUser._id.toString() === row.fromUserId._id.toString()) {
                return row.toUserId;
            }
            
            return row.fromUserId;
        });

        res.json({ data});
    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [{toUserId: loggedInUser._id}, {fromUserId: loggedInUser._id}],
        }).select("fromUserId toUserId");
        console.log("connectionRequest", connectionRequest)
        
        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        console.log("hideUsersFromFeed", hideUsersFromFeed)
        const users = await User.find({
            $and: [
                {_id: { $nin:  Array.from(hideUsersFromFeed)}}, //nin means not in this array
                {_id: { $ne: loggedInUser._id}} //ne means not equal to
            ]
        });

        res.send(users);
    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

module.exports = userRouter;