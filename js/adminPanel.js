"use strict";

let clicks=0

const rodape=document.getElementById("rodape")

if(rodape){

rodape.addEventListener("click",()=>{

clicks++

if(clicks>=10){

window.location="admin.html?login"

}

})

}
