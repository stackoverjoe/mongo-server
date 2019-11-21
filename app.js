//const markers = require("./carts");
//var http = require("http");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ngrok = require("ngrok");

var app = express();

const server = app.listen(3000, () => {
  console.log("okok");
});
//connect to db
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0-8p2zq.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

//create schema
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

var user = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String
});

//use Cart to add new carts
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

var jParser = bodyParser.json();
app.set("view engine", "ejs");
//app.use('')

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/carts.js");
});

app.get("/carts/:id", function(req, res) {
  console.log(req.params);
  Cart.find({ title: req.params.id }, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

app.get("/user/:id", function(req, res) {
  Users.find({ firstName: req.params.id }, function(err, data) {
    if (err) throw err;
    res.json(data);
  });
});

app.get("/carts", function(req, res) {
  console.log(req.params);
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

ngrok.connect(
  {
    proto: "http",
    addr: 3000,
    subdomain: "cartcity"
  },
  (err, url) => {
    if (err) {
      //return new Error(console.log(err));
    } else {
      console.log("Tunnel Created at", url);
    }
  }
);
//app.listen(3000);

//server.listen(3000, "127.0.0.1");
console.log("Listening on port 3000");
