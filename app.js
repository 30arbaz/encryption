
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

// console.log(process.env.SECRET);

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password:String
});




userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']  });

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});


app.get("/register",function(req,res){
  res.render("register");
});


app.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });

    await newUser.save();
    res.render('secrets');
  } catch (err) {
    console.error(err);
    // Handle the error appropriately, e.g., send an error response
    res.status(500).send("Registration failed");
  }
});


app.post("/login", function(req,res ){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username})
  .then(function(foundUser){

      if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");

      }
    }
  }).catch(function(err){
    console.log(err);
  })
});





app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
});
