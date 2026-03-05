/* =========================================
UI - RENDERIZAÇÃO DA LOJA
Odòmáiyà Artigos Religiosos
========================================= */


/* =========================================
CARD DE PRODUTO
========================================= */

function cardProduto(p){

 const estoque = Number(p.estoque) || 0

 return `

 <div class="card produto-card" onclick="abrirProduto('${p.id}')">

   <div class="produto-img">

     <img src="${p.imagem}" loading="lazy" alt="${p.nome}">

   </div>

   <div class="produto-info">

     <div class="title">${p.nome}</div>

     <div class="price">
       R$ ${parseFloat(p.preco).toFixed(2)}
     </div>

     <div class="stock">
       ${estoque > 0 ? estoque + " disponíveis" : "Esgotado"}
     </div>

     <button 
     class="btn"
     ${estoque == 0 ? "disabled" : ""}
     onclick='event.stopPropagation(); addCart(${JSON.stringify(p)})'>

     Adicionar ao Carrinho

     </button>

   </div>

 </div>

 `
}


/* =========================================
ABRIR PRODUTO
========================================= */

function abrirProduto(id){

 window.location = "produto.html?id=" + id

}


/* =========================================
RENDER CATALOGO
========================================= */

function renderCatalogo(lista){

 const area = document.getElementById("catalogo")

 if(!area) return

 area.innerHTML = ""

 lista.forEach(p=>{
   area.innerHTML += cardProduto(p)
 })

}


/* =========================================
RENDER RECOMENDADOS
========================================= */

function renderRecomendados(lista){

 const area = document.getElementById("recomendados")

 if(!area) return

 area.innerHTML = ""

 const rec = gerarRecomendacoes(lista)

 rec.forEach(p=>{
   area.innerHTML += cardProduto(p)
 })

}


/* =========================================
RENDER VITRINE
========================================= */

function renderVitrine(produtos){

 const vitrine = document.querySelector("#vitrine")

 if(!vitrine) return

 vitrine.innerHTML = ""

 const lista = produtos.filter(p=>p.promocao === "VITRINE")

 if(lista.length === 0){

  vitrine.style.display = "none"
  return

 }

 lista.forEach(p=>{

  vitrine.innerHTML += `

  <div class="vitrine-item" onclick="abrirProduto('${p.id}')">

    <img src="${p.imagem}" alt="${p.nome}">
    <h2>${p.nome}</h2>

  </div>

  `

 })

}


/* =========================================
RENDER BANNER
========================================= */

function renderBanner(produtos){

 const banner = document.querySelector("#banner")

 if(!banner) return

 const banners = produtos.filter(p=>p.promocao === "BANNER")

 if(banners.length === 0){

  banner.style.display = "none"
  return

 }

 let i = 0

 function trocarBanner(){

  const p = banners[i]

  banner.innerHTML = `

  <div class="banner-slide">

   <img src="${p.imagem}" alt="${p.nome}">

   <div class="banner-text">
     <h1>${p.nome}</h1>
   </div>

  </div>

  `

  i++
  if(i >= banners.length) i = 0

 }

 trocarBanner()

 setInterval(trocarBanner, 4000)

}


/* =========================================
DESTAQUES
========================================= */

function renderDestaques(produtos){

 const area = document.querySelector("#destaques")

 if(!area) return

 area.innerHTML = ""

 produtos
 .filter(p=>p.promocao === "SIM")
 .forEach(p=>{

  area.innerHTML += `

  <div class="card-destaque" onclick="abrirProduto('${p.id}')">

   <img src="${p.imagem}" alt="${p.nome}">
   <h3>${p.nome}</h3>
   <p>R$ ${p.preco}</p>

  </div>

  `

 })

}


/* =========================================
PROMOÇÕES
========================================= */

function renderPromocoes(produtos){

 const area = document.querySelector("#promocoes")

 if(!area) return

 area.innerHTML = ""

 produtos
 .filter(p=>p.promocao === "PROMO")
 .forEach(p=>{

  area.innerHTML += `

  <div class="promo-card" onclick="abrirProduto('${p.id}')">

   <img src="${p.imagem}" alt="${p.nome}">
   <h3>${p.nome}</h3>

   <p class="promo-preco">
   R$ ${p.preco}
   </p>

  </div>

  `

 })

}


/* =========================================
MAIS VENDIDOS (RANKING)
========================================= */

function renderMaisVendidos(produtos){

 const area = document.getElementById("maisVendidos")

 if(!area) return

 area.innerHTML = ""

 const ranking = iniciarRanking(produtos)

 ranking.slice(0,6).forEach(p=>{
   area.innerHTML += cardProduto(p)
 })

}


/* =========================================
ANIMAÇÃO DE CARDS
========================================= */

function animarCards(){

 if(typeof gsap === "undefined") return

 gsap.from(".card",{
  opacity:0,
  y:30,
  stagger:.05,
  duration:.6
 })

}

setTimeout(animarCards,300)
