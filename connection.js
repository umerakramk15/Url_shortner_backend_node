const mongoose = require("mongoose");

async function connecttoMongoose(url){
  return mongoose.connect(url)
}

module.exports = {
  connecttoMongoose
}