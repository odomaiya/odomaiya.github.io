/* =========================================
BANNER DINÂMICO
Odòmáiyà Artigos Religiosos
========================================= */

let bannerIndex = 0
let bannerTimer = null


/* =========================================
BANNERS PADRÃO (fallback)
========================================= */

const bannersPadrao = [

{
img:"banner1.jpg",
titulo:"Energia Espiritual",
texto:"Guias e proteção espiritual"
},

{
img:"banner2.jpg",
titulo:"Força dos Orixás",
texto:"Conexão com sua espiritualidade"
}

]


/* =========================================
GERAR BANNERS A PARTIR DOS PRODUTOS
========================================= */

function gerarBanners(produtos){

 const lista = produtos.filter(p=>p.promocao === "BANNER")

 if(lista.length === 0){

  return bannersPadrao

 }

 return lista.map(p=>({

  img: p.imagem,

  titulo: p.nome,

  texto: "Produto em destaque"

 }))

}


/* =========================================
RENDER BANNER
========================================= */

function renderBanner(produtos){

 const container = document.getElementById("banner")

 if(!container) return

 const banners = gerarBanners(produtos)

 if(banners.length === 0) return


 function mostrarBanner(){

  const b = banners[bannerIndex]

  container.innerHTML = `

  <div class="banner-slide">

   <img src="${b.img}" class="banner-img" loading="lazy">

   <div class="banner-overlay"></div>

   <div class="banner-text">

    <h1>${b.titulo}</h1>

    <p>${b.texto}</p>

   </div>

  </div>

  `


  /* animação */

  if(typeof gsap !== "undefined"){

   gsap.from(".banner-text",{

    y:80,
    opacity:0,
    duration:1

   })

  }


  bannerIndex++

  if(bannerIndex >= banners.length){

   bannerIndex = 0

  }

 }


 mostrarBanner()


 if(bannerTimer) clearInterval(bannerTimer)

 bannerTimer = setInterval(mostrarBanner, 5000)

}
