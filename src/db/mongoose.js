const mongoose = require('mongoose')
require('dotenv').config()

const mongoAtlasUri = process.env.MONGO_ATLAS_URI

try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      mongoAtlasUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log(" Mongoose is connected")
    );

  } catch (e) {
    console.log("could not connect");
  }


