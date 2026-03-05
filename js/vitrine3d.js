/* =========================================
VITRINE 3D PREMIUM
Odòmáiyà Artigos Religiosos
========================================= */

let vitrine3DIndex = 0
let vitrine3DTimer = null


/* =========================================
INICIAR VITRINE 3D
========================================= */

function iniciarVitrine3D(produtos){

 const container = document.querySelector("#vitrine3d")

 if(!container) return

 container.innerHTML = ""

 const lista = produtos.filter(p => p.promocao === "VITRINE")

 if(lista.length === 0){
  container.style.display = "none"
  return
 }

 lista.forEach((p,i)=>{

  container.innerHTML += `

  <div class="vitrine3d-card" data-index="${i}" onclick="abrirProduto('${p.id}')">

    <div class="vitrine3d-inner">

      <img src="${p.imagem}" loading="lazy" alt="${p.nome}">

      <div class="vitrine3d-info">
        <h3>${p.nome}</h3>
        <p>R$ ${parseFloat(p.preco).toFixed(2)}</p>
      </div>

    </div>

  </div>

  `

 })

 aplicarPosicoes3D()

 iniciarAutoVitrine3D()

 ativarInteracao3D()

}



/* =========================================
APLICAR POSIÇÕES 3D
========================================= */

function aplicarPosicoes3D(){

 const cards = document.querySelectorAll(".vitrine3d-card")

 cards.forEach((card,i)=>{

  let pos = i - vitrine3DIndex

  if(pos < -3) pos += cards.length
  if(pos > 3) pos -= cards.length

  let translateX = pos * 260
  let scale = 1 - Math.abs(pos) * 0.15
  let rotateY = pos * 35
  let z = -Math.abs(pos) * 200

  card.style.transform = `
  translateX(${translateX}px)
  translateZ(${z}px)
  rotateY(${rotateY}deg)
  scale(${scale})
  `

  card.style.zIndex = 100 - Math.abs(pos)

 })

}



/* =========================================
AUTO MOVIMENTO
========================================= */

function iniciarAutoVitrine3D(){

 if(vitrine3DTimer) clearInterval(vitrine3DTimer)

 vitrine3DTimer = setInterval(()=>{

  vitrine3DIndex++

  const cards = document.querySelectorAll(".vitrine3d-card")

  if(vitrine3DIndex >= cards.length){
   vitrine3DIndex = 0
  }

  aplicarPosicoes3D()

 }, 4000)

}



/* =========================================
INTERAÇÃO COM MOUSE
========================================= */

function ativarInteracao3D(){

 const container = document.querySelector("#vitrine3d")

 if(!container) return

 container.addEventListener("mousemove", e=>{

  const rect = container.getBoundingClientRect()

  const x = (e.clientX - rect.left) / rect.width

  const rot = (x - 0.5) * 10

  container.style.transform = `rotateY(${rot}deg)`

 })

 container.addEventListener("mouseleave", ()=>{

  container.style.transform = "rotateY(0deg)"

 })

}



/* =========================================
NAVEGAÇÃO MANUAL
========================================= */

function vitrine3DProximo(){

 const cards = document.querySelectorAll(".vitrine3d-card")

 vitrine3DIndex++

 if(vitrine3DIndex >= cards.length){
  vitrine3DIndex = 0
 }

 aplicarPosicoes3D()

}

function vitrine3DAnterior(){

 const cards = document.querySelectorAll(".vitrine3d-card")

 vitrine3DIndex--

 if(vitrine3DIndex < 0){
  vitrine3DIndex = cards.length - 1
 }

 aplicarPosicoes3D()

}
