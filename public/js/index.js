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
      let content = document.querySelector(".messageBox");
      content.innerHTML += `
      <div class="msg msgStay">
        <div class="time">
            <span>${data.date}</span>
            <span>${data.time}</span>
          </div>
          <div class="userName">${data.name}</div>
          <div class="userMsg">${data.msg}</div>
          <hr>
        </div>
      </div>
      `
  });
}

let room = document.querySelector(".room");
let leave = document.querySelector(".leave");
let mkRoom =  document.querySelector(".mkRoom");
let fdRoom =  document.querySelector(".fdRoom");
let block = document.querySelector(".twobutton");
let mkInput = document.querySelector(".mkInput");
let makeItnum = document.querySelector(".makeItnum");
let makeItpass = document.querySelector(".makeItpass");

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
        this.removeEventListener("click", mkR);
        if(!block.contains(g.target)){
          this.removeEventListener("click", mkR);
        }
      });
    } else{
      // console.log("outside")
      mkRoom.classList.remove("roomShow");
      fdRoom.classList.remove("roomShow");
      room.classList.remove("roomClose");
      leave.classList.remove("roomClose");
      mkInput.classList.remove("mkInputShow");
      this.removeEventListener("click", ck2);
      makeItnum.value = "";
      makeItpass.value = "";
    }
  });
});

let caution = document.querySelector(".caution");

makeItnum.addEventListener("input", function(evt){
  if(evt.target.value.length == 4){
    makeItpass.value = "";
  }
});

makeItpass.addEventListener("input", function(evt){
  if(evt.target.value.length == 4){
    let args = {room:makeItnum.value, password:evt.target.value};
    fetch('/createRoom', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(args)})
      .then((res)=>{
        return res.json();
      })
      .then((data)=>{
        if(data.result=="OK"){
          console.log("創建");
        }else{
          caution.innerText = `${data.result}`
          caution.classList.add("c1");
          setTimeout(()=>{
            caution.classList.remove("c1");
          },1600);
        }

    });
  }
});

// 即時更新線上人數
setInterval(()=>{
  console.log("aa");
  let args ={name:""};
  fetch("/getOnline", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)
  }).then((res)=>{
    return res.json();
  }).then((data)=>{
    // console.log(data.online);

    for(let i of users){
        i.classList.remove("checkup");
      }

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
