//var http = require("http");
//const fs = require("fs");was using when not requiring express
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ngrok = require("ngrok");

var app = express();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

//connect to db
mongoose.connect(
  //admin:admin will be env variable
  "mongodb+srv://admin:admin@cluster0-8p2zq.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

//Food cart schema
var foodCart = new mongoose.Schema({
  coordinate: {
    latitude: Number,
    longitude: Number
  },
  title: String,
  phoneNumber: String,
  description: String,
  image: {
    uri: String
  },
  menu: {
    menu: [
      {
        foodName: String,
        description: String,
        price: Number,
        quantity: Number
      }
    ]
  }
});

//User Schema
var user = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String
});

//Create models
var Cart = mongoose.model("Cart", foodCart);
var Users = mongoose.model("Users", user);

//loading code
/*
markers.forEach(function(obj) {
  var newCart = Cart({
    coordinate: {
      latitude: obj.coordinate.latitude,
      longitude: obj.coordinate.longitude
    },
    title: obj.title,
    phoneNumber: obj.phoneNumber,
    description: obj.description,
    image: { uri: obj.image.uri },
    menu: {
      menu: [...obj.menu.menu]
    }
  }).save(function(err) {
    if (err) throw err;
    console.log("saved");
  });
});*/

//middleware to parse json requests
var jParser = bodyParser.json();
//Ejs for possible templating/server side rendering
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  //res.send("Entry");
  res.render("landing");
});

app.get("/carts/:id", function(req, res) {
  Cart.find({ title: req.params.id }, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

app.get("/users/:id", function(req, res) {
  Users.find({ firstName: req.params.id }, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

app.get("/users", function(req, res) {
  Users.find({}, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

app.get("/carts", function(req, res) {
  Cart.find({}, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

app.post("/carts", jParser, function(req, res) {
  var obj = req.body;
  var newCart = Cart({
    coordinate: {
      latitude: obj.coordinate.latitude,
      longitude: obj.coordinate.longitude
    },
    title: obj.title,
    phoneNumber: obj.phoneNumber,
    description: obj.description,
    image: { uri: obj.image.uri },
    menu: {
      menu: [...obj.menu.menu]
    }
  }).save(function(err) {
    if (err) throw err;
    console.log("saved");
  });
  console.log(req.body);
});

app.get("*", function(req, res) {
  res.render("404");
});

(async function() {
  const url = await ngrok.connect({
    proto: "http",
    addr: 3000,
    subdomain: "cartcity"
  });
})();
//app.listen(3000);

//server.listen(3000, "127.0.0.1");
console.log("Listening on port 3000");
