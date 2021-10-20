const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require('ejs');


let store=0;
// Parsers for POST data

app.set('view engine', 'ejs');
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));
app.use(express.static('public'))
DB = "mongodb://localhost:27017/Book"

app.use("/static", express.static('./static/'));
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

const Name = mongoose.model("formdatas",NameSchema);

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    message: String
  })
  
  const userDataa = mongoose.model("userdata",UserSchema);



  const RegSchema = new mongoose.Schema({
    email : String,
    firstname : String,
    lastname : String,
    passwd : String
  })

  const RegData = mongoose.model("RegData",RegSchema);
 
  app.post("/regPost", async(req, res)=>{
    let newForm = new RegData({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        passwd: req.body.passwd
    });
    const email = req.body.email;
    const userEmail =  await RegData.findOne({email:email})

    if(userEmail.email === email){
        res.status(400).send("This email is already in use");
    }else{
        newForm.save();
        res.send(req.body);
    }
    
   
})

app.post('/login', async(req,res)=>{
  try{
    const email = req.body.email;
    const passwd = req.body.passwd;

    const userEmail =  await RegData.findOne({email:email})
     if(userEmail.passwd === passwd){
         res.status(200).redirect("http://127.0.0.1:5503/page1.html");
     }else{
         res.send("Invalid password")
     }
  }catch(err){
      res.status(400).send("Invalid Login Details")
  }
});
app.get("/", (req,res)=>{
  
    res.sendFile(__dirname+ "/sample.html")
})


app.post("/posts",(req, res)=>{
    let newForm = new Name({
    username: req.body.username,
    authorname: req.body.authorname,
    bookname: req.body.bookname,
    genre: req.body.genre,
    publisher: req.body.publisher,
    publicationyear: req.body.publicationyear,
    bookreview: req.body.bookreview
    });
    newForm.save();
    res.redirect("http://localhost:3500/demo");
})


app.post("/userData",(req, res)=>{
    let newForm = new userDataa({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message
    });
    newForm.save();
    res.redirect("http://127.0.0.1:5503/page1.html");
})

app.post("/getBookData", async (req,res)=>{
    let payload = req.body.payload.trim();
    let search = await Name.find({bookname: {$regex: new RegExp('^'+payload+'.*','i')}}).exec();
    console.log();
    search = search.slice(0,10);
    res.send({payload: search});
})

app.get("/getData/:name",  (req,res)=>{
    console.log(req.params.name)
    Name.find({bookname :req.params.name }, (err,data)=>{
        res.render('page3',{
            dataList : data
        })
    })
})

app.get("/getData/",  (req,res)=>{
    Name.find({}, (err,data)=>{
        res.render('index',{
            dataList : data
        })
    })
})

app.get("/getDataForAdmin",  (req,res)=>{
    Name.find({}, (err,data)=>{
        res.render('admin',{
            dataList : data
        })
    })
})


app.get('/delete/:id', (req, res)=>{
    Name.findByIdAndRemove(req.params.id, (err, doc)=>{
        if (!err){
            res.redirect('/getDataForAdmin');
        }else{
            console.log("Error in book delete :"+ err);
        }
    });
});


app.get("/autocomplete/",  (req,res)=>{
    var regrex = new RegExp(req.query["term"], 'i');
    var filter =  Name.find({bookname: regrex},{'bookname':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    filter.exec(function(err,data){
        var result =[];
        if(!err){
            if(data && data.length && data.length>0){
                data.forEach(user=>{
                    let obj = {
                        id: user._id,
                        label: user.bookname
                    };

                    result.push(obj);
                });
            }
            // console.log(result);
            // res.jsonp(result);
            res.status(200).jsonp(result);
            // res.jsonp(result);

        }else{
            res.sendStatus(500);
            return;        
        }
    })
    Name.find({genre: regrex}).then((result)=>{
        console.log(result + "Result it is");
        res.render('index',{
            dataList : result
        })
        // res.status(200).json(result);  


    });
    
  
})


function buidTable(data){

    store="";
       for(var i =0; i < data.length;i++){
           if(data[i].username !=  undefined){
            store += data[i].username + "   "+ data[i].authorname+"    "+ data[i].bookname+"     "+ data[i].genre + "    "+ data[i].publisher + "   "+ data[i].publicationyear + "    "+ data[i].bookreview+ "\n";

           }
           // var row = `<tr>
           //                 <td>${data[i].Name}</td>
           //                 <td>${data[i].Age}</td>
           //                 <td>${data[i].Occupation}</td>
           //                 <td>${data[i].Hobbies}</td>
           //                 </tr>
           //                 `
       }
       console.log(store)
   }

app.get('/demo',(req,res)=>{
    res.render('demo');
})
app.listen(3500, ()=>{
    console.log("server is running at 3500");
})
