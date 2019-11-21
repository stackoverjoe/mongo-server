const mongoose = require("mongoose");

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

module.exports = mongoose.model("Cart", foodCart);
