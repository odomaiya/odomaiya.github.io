"use strict";

let vitrineLista=[]

function renderVitrine(produtos){

 const area=document.getElementById("vitrine")
 if(!area) return

 area.innerHTML=""

 vitrineLista=produtos.filter(p=>p.promocao==="VITRINE")

 if(vitrineLista.length===0){
  area.style.display="none"
  return
 }

 vitrineLista.forEach(p=>{
  area.innerHTML+=cardProduto(p)
 })

 animarVitrine()
}

function animarVitrine(){

 const cards=document.querySelectorAll("#vitrine .card")

 if(cards.length===0) return

 if(typeof gsap!=="undefined"){
 gsap.from(cards,{
  opacity:0,
  y:40,
  stagger:.08,
  duration:.6
 })
 }

}
