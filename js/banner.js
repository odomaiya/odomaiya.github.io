const banners=[

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

function carregarBanner(){

let i=Math.floor(Math.random()*banners.length)

let b=banners[i]

document.getElementById("banner").innerHTML=`

<img src="${b.img}" class="banner-img">

<div class="banner-text">

<h1>${b.titulo}</h1>
<p>${b.texto}</p>

</div>

`

gsap.from(".banner-text",{y:60,opacity:0,duration:1})

}
