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
  window.location.href="/signout";
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

