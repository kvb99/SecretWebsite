require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
var encrypt = require('mongoose-encryption')

const app = express()

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost/UserDB', {useNewUrlParser: true,useUnifiedTopology: true ,useCreateIndex:true});

const userSchema = mongoose.Schema({
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:String
})

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] });
const User = mongoose.model("User",userSchema)


app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.post("/login", function(req,res){
    User.findOne(
        {email:req.body.username},
        function(err,result){
            if(!err){
                if(result){
                    if(result.password===req.body.password){
                        res.render("secrets")
                    }
                }
            }
            else{
                res.send(err)
            }
        })
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
    const user = new User({
        email:req.body.username,
        password:req.body.password
    })
    user.save(function(err){
        if(!err){
            res.redirect("/login")
        }
        else{
            res.send(err)
        }
    })
    
})

app.listen(3000,function(){
    console.log("Port 3000")
})