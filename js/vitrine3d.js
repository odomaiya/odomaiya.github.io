"use strict";

let vitrine3DIndex=0
let vitrine3DTimer=null

function iniciarVitrine3D(produtos){

 const container=document.querySelector("#vitrine3d")
 if(!container) return

 const lista=produtos.filter(p=>p.promocao==="VITRINE")

 container.innerHTML=""

 lista.forEach((p,i)=>{

 container.innerHTML+=`

 <div class="vitrine3d-card"
 data-index="${i}"
 onclick="abrirProduto('${p.id}')">

 <img src="${p.imagem}" loading="lazy">

 </div>

 `
 })

 aplicarPosicoes3D()

 iniciarAutoVitrine3D()
}

function aplicarPosicoes3D(){

 const cards=document.querySelectorAll(".vitrine3d-card")

 cards.forEach((card,i)=>{

 const pos=i-vitrine3DIndex

 const translateX=pos*260
 const rotateY=pos*35

 card.style.transform=
 `translateX(${translateX}px) rotateY(${rotateY}deg)`

 })

}

function iniciarAutoVitrine3D(){

 if(vitrine3DTimer) clearInterval(vitrine3DTimer)

 vitrine3DTimer=setInterval(()=>{

 const cards=document.querySelectorAll(".vitrine3d-card")

 vitrine3DIndex++

 if(vitrine3DIndex>=cards.length){
 vitrine3DIndex=0
 }

 aplicarPosicoes3D()

 },4000)

}
