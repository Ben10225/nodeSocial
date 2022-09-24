const mongo = require("mongodb");
const uri = "mongodb+srv://root:root123@mycluster.vp3x29m.mongodb.net/?retryWrites=true&w=majority";
const client = new mongo.MongoClient(uri);


let db = null;
client.connect(async function(err){
  if(err){
    console.log("資料庫連線失敗", err);
    return;
  }
  db = client.db("msgExam");
  console.log("資料庫連線成功");
});
// ----------------------------------------

const express = require("express");
const session = require("express-session");
const app = express();

app.use(session({
	secret: "anytext",
	resave: false,
	saveUninitialized: true
}));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

const fns = require('date-fns')



app.get("/",async function(req,res){
  
  let collection = db.collection("user");
  let data = [];

  result = await collection.find({});
  await result.forEach(user => {
    data.push(user);
  });

  if(!data){
    res.render("index.ejs");
    return;
  }

  res.render("regi.ejs", {data:data});
});

app.post("/signup",async function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // let collection = db.collection("userInfo");

  // let result =await collection.findOne({
  //   name:name
  // });
  // if(result != null){
  //   res.send("此暱稱已註冊，請換一個");
  //   return ;
  // }
  // result =await collection.findOne({
  //   email:email
  // });
  // if(result != null){
  //   res.send("此信箱已註冊，請換一個");
  //   return ;
  // }
  // await collection.insertOne({
  //   name:name, email:email, password:password
  // })


  collection = db.collection("user");
  let data = [];

  result = await collection.find({});
  await result.forEach(user => {
    data.push(user);
  });
  res.render("index.ejs",{data:data})
});

// 回應前端 js 的路由
app.post("/register",async function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if(name == ""){
    return res.json({result:"暱稱欄請勿空白"});
  }
  if(email == ""){
    return res.json({result:"信箱欄請勿空白"});
  }
  if(password == ""){
    return res.json({result:"密碼欄請勿空白"});
  }

  let collection = db.collection("userInfo");

  let result =await collection.findOne({
    name:name
  });
  if(result != null){
    return res.json({result:"此暱稱已註冊，請換一個"});
  }
  result =await collection.findOne({
    email:email
  });
  if(result != null){
    return res.json({result:"此信箱已註冊，請換一個"});
  }
  await collection.insertOne({
    name:name, email:email, password:password
  })
  return res.json({result:"OK"});
});



app.post("/stay",async function(req,res){
  const name = req.body.name;
  const msg = req.body.msg;
  let collection = db.collection("user");

  let t = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS").split("T")
  let date = t[0].replace(/"-"/g,".").slice(2)
  let time = t[1].split(".")[0]

  let result = await collection.insertOne({
    name:name, msg:msg, date:date, time: time
  });
  res.redirect("/");
});

// 啟動伺服器在 http:localhost:3000/
app.listen(3001, function(){
  console.log("Server Started");
});