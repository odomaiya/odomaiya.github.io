function renderProdutos(lista){

 const grid=document.querySelector("#produtosGrid");

 grid.innerHTML="";

 lista.forEach(p=>{

  if(p.estoque<=0) return;

  grid.innerHTML+=`

  <div class="produto">

   <img src="${p.imagem}">

   <h3>${p.nome}</h3>

   <p class="preco">R$ ${p.preco.toFixed(2)}</p>

   <button onclick="addCarrinho('${p.nome}')">
   Adicionar
   </button>

  </div>

  `;

 });

}

function abrirProduto(id){

window.location="produto.html?id="+id

}
<div class="title">${p.nome}</div>

<div class="price">
R$ ${parseFloat(p.preco).toFixed(2)}
</div>

<div class="stock">
${estoque>0?estoque+" disponíveis":"Esgotado"}
</div>

<button class="btn"
${estoque==0?"disabled":""}
onclick='addCart(${JSON.stringify(p)})'>

Adicionar ao Carrinho

</button>

</div>

`

})

gsap.from(".card",{opacity:0,y:30,stagger:.05})

}


function renderRecomendados(lista){

const rec=gerarRecomendacoes(lista)

const area=document.getElementById("recomendados")

area.innerHTML=""

rec.forEach(p=>{

area.innerHTML+=`

<div class="card">

<img src="${p.imagem}">
<div class="title">${p.nome}</div>
<div class="price">R$ ${p.preco}</div>

<button class="btn"
onclick='addCart(${JSON.stringify(p)})'>

Adicionar

</button>

</div>

`

})

}

function renderVitrine(produtos){

 const vitrine=document.querySelector("#vitrine");

 const lista=produtos.filter(p=>p.promocao==="VITRINE");

 if(lista.length===0){
  vitrine.style.display="none";
  return;
 }

 lista.forEach(p=>{

  vitrine.innerHTML+=`

  <div class="vitrine-item">

   <img src="${p.imagem}">
   <h2>${p.nome}</h2>

  </div>

  `;

 });

}
function renderBanner(produtos){

 const banners=produtos.filter(p=>p.promocao==="BANNER");

 if(banners.length===0) return;

 let i=0;

 setInterval(()=>{

  const p=banners[i];

  document.querySelector("#banner").innerHTML=`

  <img src="${p.imagem}">
  <div class="banner-text">
   <h1>${p.nome}</h1>
  </div>

  `;

  i++;
  if(i>=banners.length) i=0;

 },4000);

}
function renderDestaques(produtos){

 const area=document.querySelector("#destaques");

 produtos
 .filter(p=>p.promocao==="SIM")
 .forEach(p=>{

  area.innerHTML+=`

  <div class="card-destaque">

   <img src="${p.imagem}">
   <h3>${p.nome}</h3>
   <p>R$ ${p.preco}</p>

  </div>

  `;

 });

}
function renderPromocoes(produtos){

 const area=document.querySelector("#promocoes");

 produtos
 .filter(p=>p.promocao==="PROMO")
 .forEach(p=>{

  area.innerHTML+=`

  <div class="promo-card">

   <img src="${p.imagem}">
   <h3>${p.nome}</h3>

   <p class="promo-preco">
   R$ ${p.preco}
   </p>

  </div>

  `;

 });

}
