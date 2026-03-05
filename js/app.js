let listaProdutos=[];

async function iniciarSite(){

 listaProdutos=await buscarProdutos();

 renderBanner(listaProdutos);

 renderVitrine(listaProdutos);

 renderDestaques(listaProdutos);

 renderPromocoes(listaProdutos);

 renderCatalogo(listaProdutos);

 renderMaisVendidos(listaProdutos);

 renderRecomendados(listaProdutos);

}

document.addEventListener("DOMContentLoaded",iniciarSite);



function renderCatalogo(produtos){

 const grid=document.querySelector("#produtosGrid");

 grid.innerHTML="";

 produtos.forEach(p=>{

  if(!produtoDisponivel(p)) return;

  grid.innerHTML+=cardProduto(p);

 });

}



function renderVitrine(produtos){

 const area=document.querySelector("#vitrine");

 const lista=produtos.filter(p=>p.promocao==="VITRINE");

 if(lista.length===0){
  area.style.display="none";
  return;
 }

 area.innerHTML="";

 lista.forEach(p=>{

  if(!produtoDisponivel(p)) return;

  area.innerHTML+=cardProduto(p);

 });

}



function renderDestaques(produtos){

 const area=document.querySelector("#destaques");

 const lista=produtos.filter(p=>p.promocao==="SIM");

 area.innerHTML="";

 lista.forEach(p=>{

  if(!produtoDisponivel(p)) return;

  area.innerHTML+=cardProduto(p);

 });

}



function renderPromocoes(produtos){

 const area=document.querySelector("#promocoes");

 const lista=produtos.filter(p=>p.promocao==="PROMO");

 area.innerHTML="";

 lista.forEach(p=>{

  if(!produtoDisponivel(p)) return;

  area.innerHTML+=cardProduto(p);

 });

}



function renderBanner(produtos){

 const banners=produtos.filter(p=>p.promocao==="BANNER");

 if(banners.length===0) return;

 let i=0;

 setInterval(()=>{

  const p=banners[i];

  document.querySelector("#banner").innerHTML=`

  <div class="banner-slide">

   <img src="${p.imagem}">

   <div class="banner-text">

    <h1>${p.nome}</h1>

   </div>

  </div>

  `;

  i++;

  if(i>=banners.length) i=0;

 },5000);

}



function renderMaisVendidos(produtos){

 let vendas=JSON.parse(localStorage.getItem("vendas"))||{};

 let lista=produtos.slice();

 lista.sort((a,b)=>{

  return (vendas[b.nome]||0)-(vendas[a.nome]||0);

 });

 const area=document.querySelector("#maisVendidos");

 area.innerHTML="";

 lista.slice(0,6).forEach(p=>{

  if(!produtoDisponivel(p)) return;

  area.innerHTML+=cardProduto(p);

 });

}



function renderRecomendados(produtos){

 const recs=recomendar(produtos);

 const area=document.querySelector("#recomendados");

 area.innerHTML="";

 recs.forEach(p=>{

  area.innerHTML+=cardProduto(p);

 });

}
