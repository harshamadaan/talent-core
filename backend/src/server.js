import express from "express";
import path from "path";


import {ENV} from"./lib/env.js";

const app=express();

const __dirname=path.resolve();


// middleware
app.use(express.json());

app.get("/",(req,res) =>{
    res.status(200).json({msg:"success from api"})
});

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
}

app.listen(ENV.PORT, () =>console.log("Server is running on port:",ENV.PORT))
connectDB();