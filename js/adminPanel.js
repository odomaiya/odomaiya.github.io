let clicks=0

const rodape=document.getElementById("rodape")

rodape.addEventListener("click",()=>{

clicks++

if(clicks>=10){

window.location="admin.html?login"

}

})
