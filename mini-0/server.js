const express=require("express");
const mongoose=require("mongoose");
const userRoutes=require("./routes/user.routes");
const app=express();

app.use(express.json());

async function main(){
    await mongoose.connect()
}