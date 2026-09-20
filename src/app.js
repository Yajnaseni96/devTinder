const express = require('express');
const app = express();



app.get("/user", (req,res) => {
    res.send({firstName: "Yajnaseni", lastName: "Panda"})
});

app.post("/user", (req,res) => {
     res.send("Data is saved in DB successfully!!")
});

app.delete("/user", (req,res) => {
    res.send("Delete data from DB is done successfully!!")
});

app.use("/hello", 
    (req, res, next) => {
        console.log("console 1");
        next();
    },
    (req, res, next) => {
        console.log("console 2");
        next();
    },
    (req, res, next) => {
        console.log("console 3");
        next();
    },
    (req, res, next) => {
        console.log("console 4");
        res.send("Response 4");
    }
);

app.listen(3000, ()=>{
    console.log("Server created successfully!!")
});

