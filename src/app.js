const express = require('express');
const app = express(); 
const connectDB = require('./config/database');
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookie_parser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

app.use(cookie_parser());
app.use(express.json());

app.post("/signup", async (req, res) => {
    //Create a new instance of user

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

app.post("/login", async (req, res) => {
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
            
            const token = await user.getJwt();
            res.cookie("token", token);
            res.status(200).send("Login successful!");
        } else {
            throw new Error("Login not successful");
        }
    } catch(err) {
        res.status(400).send("ERROR: " + err);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch(err) {
        res.status(400).send("ERROR: " + err);
    }    
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
        const user = req.user;

        res.send(user.firstName + " has sent a connection request.");
});

app.get("/user", async (req, res)  =>{
    try {
        const userEmail = req.body.emailId;
        const user = await User.find({emailId: userEmail});
        res.send(user);
    } catch(err){
        res.status(400).send("Something went wrong!!");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const user = await User.find({});
        res.send(user);
    } catch {
        res.status(404).send("User not found!!");
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete({_id: userId});
        res.send("User deleted successfully!!");
    } catch (err) {
        res.status(404).send("Something went wrong!!");
    }
});

app.patch("/user/:userId", async (req, res) => {    
    const userId = req.params?.userId;
    const data = req.body;
    const ALLOWED_UPDATES = [
        "firstName", "photoUrl", "about", "gender", "age", "skills"
    ]
    const isUpdatesAllowed = Object.keys(data).every(k=> ALLOWED_UPDATES.includes(k));

    try {
        if(!isUpdatesAllowed) {
            throw new Error("This field cannot be changed");
        }

        if(!data.photoUrl) {
            data.photoUrl = "https://www.magnific.com/free-vector/woman-with-long-brown-hair-pink-shirt_233878810.htm#fromView=keyword&page=1&position=9&uuid=5f2cb9a6-1cd8-4ef6-80d5-43eb000a3431&track=ais_hybrid&query=Default+user"
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {runValidators: true});
        res.send("User updated successfully!!");
    } catch(err) {
        res.status(404).send("Something went wrong!!"+ err);
    }
});

connectDB()
    .then(() => {
        console.log("Database is connected");
        app.listen(3000, () => {
            console.log("Server created successfully!!")
        });
    })
    .catch(()=>{
        console.log("Database is not connected");
    })

