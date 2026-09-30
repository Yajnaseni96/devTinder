const express = require('express');
const connectDB = require('./config/database');
const app = express(); 
const cookie_parser = require('cookie-parser');

app.use(cookie_parser());
app.use(express.json());   

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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

