"use strict";

let bannerIndex=0
let bannerTimer=null

function gerarBanners(produtos){

 const lista=produtos.filter(p=>p.promocao==="BANNER")

 if(lista.length===0) return []

 return lista.map(p=>({
 img:p.imagem,
 titulo:p.nome,
 texto:"Produto em destaque"
 }))
}

function renderBanner(produtos){

 const container=document.getElementById("banner")
 if(!container) return

 const banners=gerarBanners(produtos)

 if(banners.length===0) return

 function mostrar(){

 const b=banners[bannerIndex]

 container.innerHTML=`

 <div class="banner-slide">

 <img src="${b.img}" loading="lazy">

 <div class="banner-text">

 <h1>${b.titulo}</h1>
 <p>${b.texto}</p>

 </div>

 </div>
 `

 bannerIndex++

 if(bannerIndex>=banners.length){
 bannerIndex=0
 }

 }

 mostrar()

 if(bannerTimer) clearInterval(bannerTimer)

 bannerTimer=setInterval(mostrar,5000)
}
