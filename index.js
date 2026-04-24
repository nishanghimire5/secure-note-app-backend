require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json())

app.post('/signup',async(req,res)=>{

})


app.post('/signin', async(req,res)=>{

})


//(create my note)
app.post('/notes/',async(req,res)=>{

})


// (get my list of notes)
app.get('/notes/',async(req,res)=>{

})

//(update my note)

app.put('/notes/:id',async(req,res)=>{

})


//(delete a note)

app.delete('/notes/:id',async(req,res)=>{

})

app.listen(process.env.PORT);