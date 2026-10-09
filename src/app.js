const express = require('express');
const connectDB = require('./config/database');
const app = express(); 
const cookie_parser = require('cookie-parser');
const cors = require('cors');

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(cookie_parser());
app.use(express.json());   

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
    .then(() => {
        console.log("Database is connected");
        app.listen(3000, () => {
            console.log("Server created successfully!!")
        });
    })
    .catch(() => {
        console.log("Database is not connected");
    })

