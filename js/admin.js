const API="https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec";

let adminClicks=0;

function ativarAdmin(){

 const rodape=document.querySelector("footer");

 rodape.addEventListener("click",()=>{

  adminClicks++;

  if(adminClicks>=10){

   window.location="admin.html";

  }

 });

}



async function salvarProduto(){

 const produto={

  nome:document.querySelector("#nome").value,
  preco:document.querySelector("#preco").value,
  promocao:document.querySelector("#promo").value,
  categoria:document.querySelector("#categoria").value,
  imagem:document.querySelector("#imagem").value,
  estoque:document.querySelector("#estoque").value

 };

 await fetch(API,{

  method:"POST",

  body:JSON.stringify(produto)

 });

 alert("produto salvo");

}
