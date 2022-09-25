

let t1 = document.querySelector(".title1");
let s1 = document.querySelector(".s1");
let signin = document.querySelector(".signin");


t1.addEventListener("click", function(){
  t1.classList.toggle("op1");
  s1.classList.toggle("show");
  signin.classList.toggle("signinup");
  t2.classList.remove("op2");
  s2.classList.remove("show");
  signup.classList.remove("signupup");
});

let t2 = document.querySelector(".title2");
let s2 = document.querySelector(".s2");
let signup = document.querySelector(".signup");

t2.addEventListener("click", function(){
  t2.classList.toggle("op2");
  s2.classList.toggle("show");
  signup.classList.toggle("signupup");
  t1.classList.remove("op1");
  s1.classList.remove("show");
  signin.classList.remove("signinup");
});

function signin_new(){
  let args ={};
  let x = document.querySelectorAll(".s1 input");
  // SeclectorAll 回傳是 NodeList
  for(let i of x){
    args[i.name] = i.value;
  }
  fetch('/signin_new', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)})
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      if (data.result == "OK"){
        // alert("登入成功！");
        window.location.href= "/member"
      }else{
        let caution = document.querySelector(".c1");
        caution.innerText = data.result;
        caution.style.opacity="0.9";
        setTimeout(()=>{
          caution.style.opacity="0";
        },1600)
      }
  });
}


function register(){
  let args ={};
  let x = document.querySelectorAll(".s2 input");
  for(let i of x){
    args[i.name] = i.value;
  }
  // console.log(args)

  // fetch
  fetch('/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(args)})
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      if (data.result == "OK"){
        // alert("註冊成功！");
        window.location.href= "/member"
      }else{
        let caution = document.querySelector(".c2");
        caution.innerText = data.result;
        caution.style.opacity="0.9";
        setTimeout(()=>{
          caution.style.opacity="0";
        },1600)
      }
  });

  // ajax
  // $.ajax({url:"/register", type:"post", data: args, dataType:"json"}).done( function(data){
  //   if(data.result == "OK"){
  //     alert("註冊成功！");
  //     window.location.href = "/"
  //   }else{
  //     $(".caution").html(data.result).css("opacity","0.9");
  //     setTimeout(()=>{
  //       $(".caution").css("opacity","0");
  //     },1600)
  //   }
  // })
}; 














  // (async () => {
  //   const rawResponse = await fetch('/register', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(args)
  //   });
  //   const content = await rawResponse.json();
  
  //   console.log(content);
  // })();
  // let formData = new FormData()
  // formData.append('prj_iid', thisform.prj_iid);
  // formData.append('overwirte', 1);
  // formData.append('fileUpload', event.target.files[0]);