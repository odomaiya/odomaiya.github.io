"use strict";

let adminClicks=0

function ativarAdmin(){

 const rodape=document.querySelector("footer")

 if(!rodape) return

 rodape.addEventListener("click",()=>{

 adminClicks++

 if(adminClicks>=10){

 window.location="admin.html"

 }

 })

}
