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
  let memberLst =[];
  let online = [];

  result = await collection.find({});
  await result.forEach(user => {
    data.push(user);
  });

  collection = db.collection("userInfo");

  result = await collection.find({});
  await result.forEach(user => {
    memberLst.push(user);
  });
  collection = db.collection("user-online");

  result = await collection.find({});
  await result.forEach(user => {
    online.push(user);
  });
  // if(!data){
  //   res.render("index.ejs");
  //   return;
  // }

  res.render("regi.ejs", {data:data,memberLst:memberLst,online:online});
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
  
  result = await collection.findOne({
    name:name
  });

  result = await collection.find({});
  await result.forEach(username => {
    online.push(username);
  });

  res.render("index.ejs",{data:data, memberLst:memberLst, online:online, name:name});
});


// 登出
app.post("/signout", function(req,res){
  // const name = req.session.data;
  const name = req.body.name;
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
  const name = req.body.name;
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

    db = client.db(room);
    collection = db.collection("room-online");
    result = await collection.findOne({
      name: name
    })
    if(!result){
      await collection.insertOne({
        name: name
      })
    }
    db = client.db("msgExam");

    return res.json({result: null,room:room});
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

// 找房
app.post("/findRoom",async function(req,res){
  const name = req.body.name;
  const room = req.body.room;
  const password = req.body.password;

  let collection = db.collection("roomInfo");
  let result =await collection.findOne({
    $and :[
      {room:room},{password:password}
    ]
  });

  if (!result) return res.json({result:"房號密碼錯誤"});

  db = client.db(room);
  collection = db.collection("room-online");
  result = await collection.findOne({
    name: name
  })
  if(!result){
    await collection.insertOne({
      name: name
    })
  }
  db = client.db("msgExam");

  return res.json({result:"OK",room:room});
});

// 房間即時線上
app.post("/getRoomOnline",async function(req,res){
  // const name = res.body.name;
  const room = req.body.room;
  let online = [];
  let member = [];

  db = client.db(room);

  let collection = db.collection("roomMember");
  await collection.deleteOne({
    name:null
  })
  result = await collection.find({});
  await result.forEach(username => {
    member.push(username);
  });

  db = client.db(room);
  collection = db.collection("room-online");
  await collection.deleteOne({
    name:null
  })
  result = await collection.find({});
  await result.forEach(username => {
    online.push(username);
  });

  db = client.db("msgExam");

  return res.json({online:online,member:member});
});


// 回到大廳 刪掉 room-online 個人資料
app.post("/backLobby",function(req,res){
  const name = req.body.name;
  const room = req.body.room;

  db = client.db(room);

  let collection = db.collection("room-online");

  (async function(){
    await collection.deleteOne({
      name:name
    });
  })()
  db = client.db("msgExam");

  return res.json({result:"OK"});
});

// 退出房間 
app.post("/leaveRoom",function(req,res){
  const name = req.body.name;
  const room = req.body.room;

  db = client.db(room);

  let collection = db.collection("room-online");

  (async function(){
    await collection.deleteOne({
      name:name
    });
  })()

  collection = db.collection("roomMember");

  (async function(){
    await collection.deleteOne({
      name:name
    });

    let cklst = [];
    let result = await collection.find({});
    await result.forEach((data)=>{
      cklst.push(data)
    });
    console.log(cklst.length);

    if(cklst.length==0){
      db = client.db(room);
      // 直接移除資料庫 但要先指定
      db.dropDatabase();
      // db.dropUser(room);
      // db.removeUser(room);
      // console.log(`資料庫${name}已刪除`);
      db = client.db("msgExam");

      collection = db.collection("roomInfo");
      
      await collection.deleteOne({
        room:room
      });

    }
  })()

  db = client.db("msgExam");

  return res.json({result:"OK"});
});

// 連線到房間
app.get("/openRoom",async function(req,res){
  if(!req.session.data){
    res.redirect("/");
  }
  const room  = req.query.room;
  // console.log(room);
  db = client.db(room);

  let collection = db.collection("roomMsg");
  let data = [];
  let memberLst =[];
  let name = req.session.data;
  let online = [];

  let result = await collection.find({});
  await result.forEach(user => {
    data.push(user);
  });

  collection = db.collection("roomMember");
  
  // 增加自己
  result = await collection.findOne({
    name:name
  });
  if(!result){
    result = await collection.insertOne({
      name:name
    });  
  }

  await collection.deleteOne({
    name:null
  })

  result = await collection.find({});
  await result.forEach(user => {
    memberLst.push(user.name);
  });
  // 增加線上
  collection = db.collection("room-online");
  // 先加自己
  result = await collection.findOne({
    name:name
  });
  if(!result){
    result = await collection.insertOne({
      name:name
    });  
  }

  await collection.deleteOne({
    name:null
  })
  // 再去渲染其他線上
  result = await collection.find({});
  await result.forEach(username => {
    online.push(username);
  });

  // db 要指定回去
  db = client.db("msgExam");

  res.render("room.ejs",{data:data, memberLst:memberLst, online:online, name:name, room:room});
});


// 房間留言
app.post("/roomStay",async function(req,res){
  const room = req.body.room;
  const name = req.body.name;
  const msg = req.body.msg;

  db = client.db(room);

  let collection = db.collection("roomMsg");

  let t = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS").split("T")
  let date = t[0].replace(/"-"/g,".").slice(2)
  let time = t[1].split(".")[0]

  let result = await collection.insertOne({
    name:name, msg:msg, date:date, time: time
  });

  db = client.db("msgExam");

  return res.json({name:name, msg:msg, date:date, time: time});

});

// 房間留言板更新
app.post("/RoomMsgUpdate",async function(req,res){
  const room = req.body.room;

  db = client.db(room);

  let collection = db.collection("roomMsg");
  let msg =[]
  let result = await collection.find({});
  await result.forEach((data)=>{
    msg.push(data);
  });


  db = client.db("msgExam");

  return res.json({msg:msg});
});

// 送出留言
app.post("/stay",async function(req,res){
  const msg = req.body.msg;
  const name = req.session.data
  let collection = db.collection("user");

  let t = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS").split("T")
  let date = t[0].replace(/"-"/g,".").slice(2)
  let time = t[1].split(".")[0]

await collection.insertOne({
    name:name, msg:msg, date:date, time: time
  });
  return res.json({name:name, msg:msg, date:date, time: time});
});


// 大廳留言板更新
app.post("/lobbyMsgUpdate",async function(req,res){

  let collection = db.collection("user");
  let msg =[]
  let result = await collection.find({});
  await result.forEach((data)=>{
    msg.push(data);
  });

  return res.json({msg:msg});
});

// 啟動伺服器在 http:localhost:3000/
app.listen(3001, function(){
  console.log("Server Started");
});