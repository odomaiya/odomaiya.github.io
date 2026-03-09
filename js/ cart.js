"use strict";

let cart = JSON.parse(localStorage.getItem("cart")) || []

function salvarCart(){

 localStorage.setItem("cart", JSON.stringify(cart))

 atualizarCarrinho()

}

function addCart(prod){

 if(!prod) return

 const id = prod.id || prod.nome.replace(/\s+/g,"-").toLowerCase()

 let item = cart.find(i=>i.id===id)

 if(item){
  item.qtd++
 }else{
  cart.push({...prod,id,qtd:1})
 }

 atualizarRanking(id)

 salvarCart()

}

function removerCart(id){

 cart = cart.filter(i=>i.id!==id)

 salvarCart()

}

function totalCart(){

 return cart.reduce((t,i)=>{

  return t + (Number(i.preco)||0)*i.qtd

 },0)

}

function renderCart(){

 const area=document.getElementById("itensCarrinho")

 if(!area) return

 area.innerHTML=""

 cart.forEach(i=>{

  area.innerHTML+=`

  <div class="cart-item">

  <img src="${i.imagem}" class="cart-img">

  <div>

  ${i.nome} x${i.qtd}

  </div>

  <button onclick="removerCart('${i.id}')">✕</button>

  </div>

  `

 })

}

function atualizarCarrinho(){

 renderCart()

 const total=document.getElementById("totalCarrinho")

 if(total){

  total.innerText="Total: R$ "+totalCart().toFixed(2)

 }

}

document.addEventListener("DOMContentLoaded",atualizarCarrinho)
