const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const statusType = ["ignored", "interested"];

            if (!statusType.includes(status)) {
                return res.status(400).json({
                    message: "Invalid status! " + status
                });
            }

            const isUserPresent = await User.findById(toUserId);

            if (!isUserPresent) {
                return res.status(400).send("User not found");
            }

            const existingConnection = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            });

            if (existingConnection) {
                return res.status(400).json({
                    message: "Connection already exists!"
                });
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });

            const data = await connectionRequest.save();

            return res.status(200).json({
                message: `${req.user.firstName} is ${status} in ${isUserPresent.firstName}`,
                data
            });

        } catch (err) {
            return res.status(400).json({
                message: err.message
            });
        }
    }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user; //userAuth middleware returns back and adds re.user.
        const {status, requestId} = req.params;
        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status!"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            status: "interested",
            toUserId: loggedInUser._id
        })

        if(!connectionRequest) {
            return res.status(404).json({message: "Connection not found!!"});
        }

        connectionRequest.status = status;
        await connectionRequest.save();
        console.log(connectionRequest)
        const data = res.send(200).json({message: "Connection request " + data + status})
        
    } catch {

    }
});

module.exports = requestRouter;