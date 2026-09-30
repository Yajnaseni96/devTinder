const express = require('express');
const User = require('../models/user');
const {userAuth} = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
        const user = req.user;

        res.send(user.firstName + " has sent a connection request.");
});

module.exports = requestRouter;