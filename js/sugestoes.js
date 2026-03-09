"use strict";

function gerarSugestoes(produtos){

 const area=document.querySelector("#sugestoes")
 if(!area) return

 const carrinho=JSON.parse(localStorage.getItem("cart"))||[]

 if(carrinho.length===0){
 area.style.display="none"
 return
 }

 const sugestoes=produtos
 .filter(p=>Number(p.estoque)>0)
 .slice(0,4)

 area.innerHTML=""

 sugestoes.forEach(p=>{
 area.innerHTML+=cardProduto(p)
 })

}
