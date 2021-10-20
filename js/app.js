const mongoose = require("mongoose");

 DB = "mongodb://localhost:27017/Book"

 mongoose.connect(DB,{ useNewUrlParser: true ,useUnifiedTopology: true});

mongoose.connection.once('open',()=>{
    console.log("Connected to Db");

}).on('err',(err)=>{
    console.log('error is : ',err);
})

const NameSchema = new mongoose.Schema({
    username: String,
    authorname: String,
    bookname: String,
    genre: String,
    publisher: String,
    publicationyear: Number,
    bookreview: String
})
const Name = new mongoose.model("formdatas",NameSchema);

exports.Name = Name;