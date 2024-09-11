const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()


app.use(cors());
app.use(express.json())


const userRoutes = require("./routes/user.js")

app.use(`/api/user`, userRoutes)


app.listen(process.env.Port, () =>{
    console.log(`Server are running on Port ${process.env.Port}`)
});

mongoose.connect(process.env.DATABASE_STRING)

const databds = mongoose.connection;
 
databds.on('error',(error)=>{
    console.log(error,"not connnect")
})
databds.once('connected',()=>{
    console.log("Database connected")
})


app.get('/', (req,res) =>{
    res.status(200)
    res.send("Hello Word")
});

