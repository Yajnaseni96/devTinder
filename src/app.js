const express = require('express');
const app = express(); 
const connectDB = require('./config/database');
const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req, res) => {
    //Create a new instance of user
    console.log(req.body)
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added successfully!!")
    } catch(err) {
        res.status(400).send("Error saving the user");
    }
})

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

app.patch("/user", async (req, res) => {
    const emailId = req.body.emailId;
    const data = req.body;

    try {
        const user = await User.findOneAndUpdate({ emailId: emailId }, data);
        res.send("User updated successfully!!");
    } catch(err) {
        res.status(404).send("Something went wrong!!");
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

