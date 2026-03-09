"use strict";

function cardProduto(p){

 if(!p) return ""

 const estoque = Number(p.estoque)||0
 const preco = Number(p.preco)||0
 const id = p.id || p.nome.replace(/\s+/g,"-").toLowerCase()

 return `

 <div class="card produto-card" onclick="abrirProduto('${id}')">

 <div class="produto-img">
 <img src="${p.imagem}" loading="lazy" alt="${p.nome}">
 </div>

 <div class="produto-info">

 <div class="title">${p.nome}</div>

 <div class="price">
 R$ ${preco.toFixed(2)}
 </div>

 <div class="stock">
 ${estoque>0?estoque+" disponíveis":"Esgotado"}
 </div>

 <button
 class="btn"
 ${estoque===0?"disabled":""}
 onclick='event.stopPropagation(); addCart(${JSON.stringify(p)})'>

 Adicionar ao Carrinho

 </button>

 </div>

 </div>
 `
}

function abrirProduto(id){
 if(!id) return
 window.location="produto.html?id="+id
}

function renderCatalogo(lista){

 const area=document.getElementById("listaProdutos")
 if(!area) return

 area.innerHTML=""

 lista.forEach(p=>{
  area.innerHTML+=cardProduto(p)
 })

 animarCards()
}

function renderRecomendados(lista){

 const area=document.getElementById("recomendacoes")
 if(!area) return

 area.innerHTML=""

 const rec=gerarRecomendacoes(lista)

 rec.forEach(p=>{
  area.innerHTML+=cardProduto(p)
 })

 animarCards()
}

function animarCards(){

 if(typeof gsap==="undefined") return

 gsap.from(".card",{
  opacity:0,
  y:30,
  stagger:.05,
  duration:.6
 })

}
