let checkUser = document.querySelectorAll(".checkUser");
// console.log(checkUser); // aaa
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
  // console.log(name.innerText);
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
  // console.log(x.value)
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
      
      // let content = document.querySelector(".messageBox");
      // content.innerHTML += `
      // <div class="msg msgStay">
      //   <div class="time">
      //       <span>${data.date}</span>
      //       <span>${data.time}</span>
      //     </div>
      //     <div class="userName">${data.name}</div>
      //     <div class="userMsg">${data.msg}</div>
      //     <hr>
      //   </div>
      // </div>
      // `
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
        // console.log("bb")
        window.location.href="/member";
      }
    });
}

function leaveRoom(){
  let name = document.querySelector(".user_inner h2 span");
  let args = {name:name.innerText,room:room};
  // console.log(args);
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

// let mkRoom =  document.querySelector(".mkRoom");
// let fdRoom =  document.querySelector(".fdRoom");
// let block = document.querySelector(".twobutton");
// let mkInput = document.querySelector(".mkInput");
// let makeItnum = document.querySelector(".makeItnum");
// let makeItpass = document.querySelector(".makeItpass");

// room.addEventListener("click", function(e){
//   // console.log("aa")
//   mkRoom.classList.add("roomShow");
//   fdRoom.classList.add("roomShow");
//   room.classList.add("roomClose");
//   leave.classList.add("roomClose");
//   window.addEventListener("click", function ck2(f){
//     if (block.contains(f.target)){
//       // console.log("inside");
//       mkRoom.addEventListener("click", function mkR(g){
//         // console.log("mk")
//         mkRoom.classList.remove("roomShow");
//         mkInput.classList.add("mkInputShow");
//         room.classList.remove("roomClose");
//         this.removeEventListener("click", mkR);
//         if(!block.contains(g.target)){
//           this.removeEventListener("click", mkR);
//         }
//       });
//     } else{
//       // console.log("outside")
//       mkRoom.classList.remove("roomShow");
//       fdRoom.classList.remove("roomShow");
//       room.classList.remove("roomClose");
//       leave.classList.remove("roomClose");
//       mkInput.classList.remove("mkInputShow");
//       this.removeEventListener("click", ck2);
//       makeItnum.value = "";
//       makeItpass.value = "";
//     }
//   });
// });

// let caution = document.querySelector(".caution");

// makeItnum.addEventListener("input", function(evt){
//   if(evt.target.value.length == 4){
//     makeItpass.value = "";
//   }
// });

// makeItpass.addEventListener("input", function(evt){
//   if(evt.target.value.length == 4){
//     let args = {room:makeItnum.value, password:evt.target.value};
//     fetch('/createRoom', {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify(args)})
//       .then((res)=>{
//         return res.json();
//       })
//       .then((data)=>{
//         if(!data.result){
//           window.location.href=`/openRoom?room=${data.room}`;
//         }else{
//           caution.innerText = `${data.result}`
//           caution.classList.add("c1");
//           setTimeout(()=>{
//             caution.classList.remove("c1");
//           },1600);
//         }
//     });
//   }
// });


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
      // console.log(data.member);
      // console.log(data.online);
      let on =[];
      let content = document.querySelector(".memberBox");
      let underline = "";
      // console.log(data.member);
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
  // console.log(args);
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
      // console.log(data.msg)
      // let lastDate;
      // let lastTime;
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
        // lastDate = i.date;
        // lastTime = i.time;
      }
      content.innerHTML = `${underline}`;
    }
  });
},1000)
