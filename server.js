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
const bodyParser = require('body-parser');
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
app.use(bodyParser.json());

const fns = require('date-fns')



app.get("/",async function(req,res){
  
  let collection = db.collection("user");
  let data = [];

  result = await collection.find({});
  await result.forEach(user => {
    data.push(user);
  });

  // if(!data){
  //   res.render("index.ejs");
  //   return;
  // }

  res.render("regi.ejs", {data:data});
});

app.post("/signup",async function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  collection = db.collection("user");
  let data = [];

  result = await collection.find({});
  await result.forEach(user => {
    data.push(user);
  });
  res.render("index.ejs",{data:data});
});

// 回應前端 js 的路由
app.post("/register",function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if(!name){
    return res.json({result:"暱稱欄請勿空白"});
  }
  if(!email){
    return res.json({result:"信箱欄請勿空白"});
  }
  if(!password){
    return res.json({result:"密碼欄請勿空白"});
  }

  let collection = db.collection("userInfo");
  (async function() {
    let result =await collection.findOne({
      name:name
    });
    if(result != null){
      return res.json({result:"此暱稱已註冊，請換一個"});
    }
    result = await collection.findOne({
      email:email
    });
    if(result != null){
      return res.json({result:"此信箱已註冊，請換一個"});
    }
    
    req.session.data = name;

    await collection.insertOne({
      name:name, email:email, password:password
    })


    return res.json({result:"OK"});
  })()
});

app.post("/signin_new" ,function(req,res){
  const email = req.body.email;
  const password = req.body.password;

  if(!email){
    return res.json({result:"信箱欄請勿空白"});
  }
  if(!password){
    return res.json({result:"密碼欄請勿空白"});
  }
  let collection = db.collection("userInfo");

  (async function() {
    let result =await collection.findOne({
      email:email
    });
    if(result == null){
      return res.json({result:"此信箱尚未註冊"});
    }
    result = await collection.findOne({
      $and:[
        {email: email},
        {password: password}
      ]
    });
    if(result == null){
      return res.json({result:"密碼錯誤"});
    }

    // 加到線上資料庫
    collection = db.collection("user-online");
    let onlineName = await collection.findOne({
      name:result.name
    });
    if(!onlineName){
      await collection.insertOne({
        name:result.name
      });
    }

    req.session.data = result.name;
    return res.json({result:"OK"});
  })()

});

// 會員頁面
app.get("/member",async function(req,res){
  !req.session.data ? res.redirect("/") : null;

  let collection = db.collection("user");
  let data = [];
  let memberLst =[];
  let name = req.session.data;
  let online = [];

  result = await collection.find({});
  await result.forEach(user => {
    data.push(user);
  });

  collection = db.collection("userInfo");
  result = await collection.find({});
  await result.forEach(user => {
    memberLst.push(user.name);
  });

  collection = db.collection("user-online");
  result = await collection.find({});
  await result.forEach(username => {
    online.push(username);
  });

  res.render("index.ejs",{data:data, memberLst:memberLst, online:online, name:name});
});


// 送出留言
app.post("/stay",async function(req,res){
  const msg = req.body.msg;
  const name = req.session.data
  let collection = db.collection("user");

  let t = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS").split("T")
  let date = t[0].replace(/"-"/g,".").slice(2)
  let time = t[1].split(".")[0]

  let result = await collection.insertOne({
    name:name, msg:msg, date:date, time: time
  });
  return res.json({name:name, msg:msg, date:date, time: time});
});

// 登出
app.post("/signout", function(req,res){
  // const name = req.session.data;
  const name = req.body.name;
  console.log(name);
  req.session.data = null;
  let collection = db.collection("user-online");

  (async function(){
    await collection.deleteOne({
      name: name
    });
  })()
  // res.redirect("/");
  return res.json({result:"OK"});
});

// 創房
app.post("/createRoom", function(req,res){
  const room = req.body.room;
  const password = req.body.password;

  if (room.length != 4) return res.json({result: "房號需要4碼"});
  let collection = db.collection("roomInfo");
  (async function(){
    let result = await collection.findOne({room: room});
    if(result){
      return res.json({result: "此房號已註冊"});
    }
    await collection.insertOne({
      room:room, password:password
    });
    return res.json({result:"OK"});
  })()
});

app.post("/getOnline",async function(req,res){
  let online = [];
  let collection = db.collection("user-online");

  result = await collection.find({});
  await result.forEach(username => {
    online.push(username);
  });
  return res.json({online:online});
});

// 啟動伺服器在 http:localhost:3000/
app.listen(3001, function(){
  console.log("Server Started");
});