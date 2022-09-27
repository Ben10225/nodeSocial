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
function stay(){
  let x = document.querySelector("textarea");
  // console.log(x.value)
  fetch('/stay', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({msg: x.value})})
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      x.value = "";
      setTimeout(()=>{
        const element = document.querySelector(".forScroll");
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },1100);
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

let room = document.querySelector(".room");
let leave = document.querySelector(".leave");
let mkRoom =  document.querySelector(".mkRoom");
let fdRoom =  document.querySelector(".fdRoom");
let block = document.querySelector(".twobutton");
let mkInput = document.querySelector(".mkInput");
let psInput = document.querySelector(".psInput");
let makeItnum = document.querySelector(".makeItnum");
let makeItpass = document.querySelector(".makeItpass");
let passItnum = document.querySelector(".passItnum");
let passItpass = document.querySelector(".passItpass");

room.addEventListener("click", function(e){
  // console.log("aa")
  mkRoom.classList.add("roomShow");
  fdRoom.classList.add("roomShow");
  room.classList.add("roomClose");
  leave.classList.add("roomClose");
  window.addEventListener("click", function ck2(f){
    if (block.contains(f.target)){
      // console.log("inside");
      mkRoom.addEventListener("click", function mkR(g){
        // console.log("mk")
        mkRoom.classList.remove("roomShow");
        mkInput.classList.add("mkInputShow");
        room.classList.remove("roomClose");
        if(!block.contains(g.target)){
          this.removeEventListener("click", mkR);
        }
        block.addEventListener("click", function insidemkR(h){
          if(fdRoom.contains(h.target)){
            psInput.classList.add("psInputShow");
            mkRoom.classList.add("roomShow");
            room.classList.add("roomClose");
            makeItnum.value = "";
            makeItpass.value = "";
            this.removeEventListener("click", insidemkR);
          }
        }); 
      });
      fdRoom.addEventListener("click", function mkL(g){
        // console.log("mk")
        fdRoom.classList.remove("roomShow");
        psInput.classList.add("psInputShow");
        mkInput.classList.remove("mkInputShow");
        room.classList.add("roomClose");
        this.removeEventListener("click", mkL);
        if(!block.contains(g.target)){
          this.removeEventListener("click", mkL);
        }
        block.addEventListener("click", function insidemkL(h){
          if(mkRoom.contains(h.target)){
            mkRoom.classList.remove("roomShow");
            mkInput.classList.add("mkInputShow");
            psInput.classList.remove("psInputShow");
            fdRoom.classList.add("roomShow");
            leave.classList.add("roomClose");
            passItnum.value = "";
            passItpass.value = "";
            this.removeEventListener("click", insidemkL);
          }
        });
      });
    } else{
      // console.log("outside")
      mkRoom.classList.remove("roomShow");
      fdRoom.classList.remove("roomShow");
      room.classList.remove("roomClose");
      leave.classList.remove("roomClose");
      mkInput.classList.remove("mkInputShow");
      psInput.classList.remove("psInputShow");
      this.removeEventListener("click", ck2);
      makeItnum.value = "";
      makeItpass.value = "";
      passItnum.value = "";
      passItpass.value = "";
    }
  });
});

let cautionC1 = document.querySelector(".caution.c1");
let cautionC2 = document.querySelector(".caution.c2");

// 創建房間
makeItnum.addEventListener("input", function(evt){
  if(evt.target.value.length == 4){
    makeItpass.value = "";
    makeItpass.focus();
  }
});

makeItpass.addEventListener("input", function(evt){
  if(evt.target.value.length == 4){
    let name = document.querySelector(".user_inner h2 span").innerText;
    let args = {room:makeItnum.value, password:evt.target.value, name:name};
    fetch('/createRoom', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(args)})
      .then((res)=>{
        return res.json();
      })
      .then((data)=>{
        if(!data.result){
          window.location.href=`/openRoom?room=${data.room}`;
        }else{
          cautionC1.innerText = `${data.result}`
          cautionC1.classList.add("ctext");
          setTimeout(()=>{
            cautionC1.classList.remove("ctext");
          },1600);
        }
    });
  }
});

// 找尋房間
passItnum.addEventListener("input", function(evt){
  if(evt.target.value.length == 4){
    passItpass.value = "";
    passItpass.focus();
  }
});

passItpass.addEventListener("input", function(evt){
  if(evt.target.value.length == 4){
    let name = document.querySelector(".user_inner h2 span").innerText;
    let args = {room:passItnum.value, password:evt.target.value, name:name};
    fetch('/findRoom', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(args)})
      .then((res)=>{
        return res.json();
      })
      .then((data)=>{
        if(data.result=="OK"){
          window.location.href=`/openRoom?room=${data.room}`;
        }else{
          cautionC2.innerText = `${data.result}`
          cautionC2.classList.add("ctext");
          setTimeout(()=>{
            cautionC2.classList.remove("ctext");
          },1600);
        }
    });
  }
});

// 即時更新線上人數
setInterval(()=>{
  let args ={name:""};
  fetch("/getOnline", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)
  }).then((res)=>{
    return res.json();
  }).then((data)=>{

    for(let i of users){
        i.classList.remove("checkup");
    };

    let on =[];
    for(let i of data.online){
      on.push(i.name); 
    };
    for(let i of users){
      let name = i.textContent;
      if(on.includes(name)){
        i.classList.add("checkup");
      }
    };
  });
},5000)


// 即時更新留言板
setTimeout(()=>{
  setInterval(()=>{
    fetch("/lobbyMsgUpdate", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({})
    }).then((res)=>{
      return res.json();
    }).then((data)=>{
      if(data){
        let on =[];
        let content = document.querySelector(".msgOutter");
        let underline = "";
        // console.log(data.msg)
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
},5000)
