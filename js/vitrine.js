/* =========================================
VITRINE PREMIUM
Odòmáiyà Artigos Religiosos
========================================= */

let vitrineLista = []


/* =========================================
INICIAR VITRINE
========================================= */

function renderVitrine(produtos){

 const area = document.getElementById("vitrine")

 if(!area) return

 area.innerHTML = ""

 vitrineLista = produtos.filter(p => p.promocao === "VITRINE")

 if(vitrineLista.length === 0){

  area.style.display = "none"
  return

 }

 vitrineLista.forEach(p=>{

  area.innerHTML += cardProduto(p)

 })

 animarVitrine()

 iniciarScrollVitrine()

}


/* =========================================
ANIMAÇÃO DA VITRINE
========================================= */

function animarVitrine(){

const cards=document.querySelectorAll("#vitrine .card")

if(cards.length===0) return

gsap.from(cards,{
 opacity:0,
 y:30,
 stagger:.08,
 duration:.6
})

}

/* =========================================
SCROLL SUAVE ESTILO APPLE STORE
========================================= */

function iniciarScrollVitrine(){

 const vitrine = document.getElementById("vitrine")

 if(!vitrine) return

 let isDown = false
 let startX
 let scrollLeft


 vitrine.addEventListener("mousedown", e=>{

  isDown = true
  vitrine.classList.add("drag")

  startX = e.pageX - vitrine.offsetLeft
  scrollLeft = vitrine.scrollLeft

 })


 vitrine.addEventListener("mouseleave",()=>{

  isDown = false
  vitrine.classList.remove("drag")

 })


 vitrine.addEventListener("mouseup",()=>{

  isDown = false
  vitrine.classList.remove("drag")

 })


 vitrine.addEventListener("mousemove", e=>{

  if(!isDown) return

  e.preventDefault()

  const x = e.pageX - vitrine.offsetLeft
  const walk = (x - startX) * 2

  vitrine.scrollLeft = scrollLeft - walk

 })

}


/* =========================================
VITRINE AUTOMÁTICA (CARROSSEL)
========================================= */

function iniciarAutoVitrine(){

 const vitrine = document.getElementById("vitrine")

 if(!vitrine) return

 setInterval(()=>{

  vitrine.scrollBy({

   left:300,
   behavior:"smooth"

  })

 },4000)

}


/* =========================================
ATIVAR ANIMAÇÃO AO CARREGAR
========================================= */

document.addEventListener("DOMContentLoaded",()=>{

 setTimeout(()=>{

  animarVitrine()

 },400)

})
