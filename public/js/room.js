let checkUser = document.querySelectorAll(".checkUser");
let checkUserLst = [];
for(let i of checkUser){
  checkUserLst.push(i.textContent)
}
let users = document.querySelectorAll(".memberName");

for(let i of users){
  let name = i.textContent;
  if(checkUserLst.includes(name)){
    i.classList.add("checkup");
  }
};

function signout(){
  let name = document.querySelector(".user_inner h2 span");
  let args = {name:name.innerText};
  fetch("/signout", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)})
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
        window.location.href="/";

    });
  // window.location.href="/signout";
};

let msg = document.querySelectorAll(".msg");
for(let i=0;i<msg.length;i++){
  setTimeout(()=>{
    msg[i].classList.add("msgIn");
  },300*i);
  setTimeout(() => {
    setTimeout(()=>{
      msg[i].classList.add("msgStay");
      msg[i].classList.remove("msgIn");
    },500*i)  
  }, 500);
};

let ct =0

let lobby = document.querySelector(".backlobby");
let leave = document.querySelector(".leaveRoom");
let room = document.querySelector(".listTitle span").innerText

function roomStay(){
  let x = document.querySelector("textarea");
  let name = document.querySelector(".user_inner h2 span").innerText;
  fetch('/roomStay', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({msg: x.value, room:room, name:name})})
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      x.value = "";
      const element = document.querySelector(".forScroll");
      setTimeout(()=>{
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },500);
  });
}

function backlobby(){
  let name = document.querySelector(".user_inner h2 span");
  let room = document.querySelector(".listTitle span").innerText

  let args = {name:name.innerText,room:room};
  console.log(args);
  fetch("/backLobby", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)})
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      if(data){
        window.location.href="/member";
      }
    });
}

function leaveRoom(){
  let name = document.querySelector(".user_inner h2 span");
  let args = {name:name.innerText,room:room};
  fetch("/leaveRoom", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)})
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      if(data){
        console.log("bb")
        window.location.href="/member";
      }
    });
}


// 即時更新線上人數
setInterval(()=>{
  let room = document.querySelector(".listTitle span").innerText
  let args ={room:room};
  // console.log(args);
  fetch("/getRoomOnline", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)
  }).then((res)=>{
    return res.json();
  }).then((data)=>{
    if(data){
      let on =[];
      let content = document.querySelector(".memberBox");
      let underline = "";
      for(let i of data.member){
        underline += `<div class="memberName">${i.name}</div>`
      }
      for(let i of data.online){
        underline += `<div class="checkUser">${i.name}</div>`
        on.push(i.name); 
      }
      content.innerHTML = `
      <h3 class="listTitle">用戶列表</h2>
        ${underline}
      `
      let users = document.querySelectorAll(".memberName");

      for(let i of users){
        if(on.includes(i.textContent)){
          i.classList.add("checkup");
        }
      };
    }
  });
},5000)

// 即時更新留言板
setInterval(()=>{
  let room = document.querySelector(".listTitle span").innerText
  let args ={room:room};
  fetch("/RoomMsgUpdate", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)
  }).then((res)=>{
    return res.json();
  }).then((data)=>{
    if(data){
      let on =[];
      let content = document.querySelector(".msgOutter");
      let underline = "";
      for(let i of data.msg){
        underline += `
        <div class="msg msgStay" id="${i.date}+${i.time}">
          <div class="time">
            <span>${i.date}</span>
            <span>${i.time}</span>
          </div>
          <div class="userName">${i.name} : </div>
          <div class="userMsg">${i.msg}</div>
          <hr>
        </div>
        `
      }
      content.innerHTML = `${underline}`;
    }
  });
},1000)
