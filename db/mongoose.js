const mongoose = require('mongoose')

const mongoAtlasUri = 'mongodb+srv://bobkwando:6569Rocks!@pre-req-app.vxi3b.mongodb.net/test'
// mongoose.connect(mongoAtlasUri||'mongodb://127.0.0.1:27017/course-pre-req',{
// 	useNewUrlParser: true,useUnifiedTopology: true 
// 	// useFindAndModify: false
// })

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


