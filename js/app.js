const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos=[];
let carrinho={};

async function carregarProdutos(){
  const res=await fetch(API_URL+"?acao=produtos&nocache="+Date.now());
  produtos=await res.json();

  produtos.forEach(p=>{
    p.preco=parseFloat(p.preco)||0;
    p.promocao=parseFloat(p.promocao)||0;
  });

  produtos.sort((a,b)=>{
    if((b.promocao||0)-(a.promocao||0)!==0)
      return (b.promocao||0)-(a.promocao||0);
    return a.nome.localeCompare(b.nome);
  });

  criarFiltros();
  renderizar(produtos);
}

function criarFiltros(){
  const area=document.getElementById("filtros");
  const categorias=["Todos",...new Set(produtos.map(p=>p.categoria))].sort();
  area.innerHTML="";
  categorias.forEach(cat=>{
    const btn=document.createElement("button");
    btn.innerText=cat;
    btn.onclick=()=>filtrar(cat);
    area.appendChild(btn);
  });
}

function filtrar(cat){
  if(cat==="Todos") renderizar(produtos);
  else renderizar(produtos.filter(p=>p.categoria===cat));
}

function renderizar(lista){
  const grid=document.getElementById("produtos");
  grid.innerHTML="";
  lista.forEach(p=>{
    const precoFinal=p.promocao>0?p.promocao:p.preco;
    const card=document.createElement("div");
    card.className="produto-card";
    if(p.promocao>0) card.classList.add("promo-card");

    card.innerHTML=`
      <img src="${p.imagem||'https://via.placeholder.com/200'}">
      <h4>${p.nome}</h4>
      <div>
        ${p.promocao>0?`<small style="text-decoration:line-through">R$ ${p.preco.toFixed(2).replace('.',',')}</small><br>`:""}
        <strong>R$ ${precoFinal.toFixed(2).replace('.',',')}</strong>
      </div>
      <div class="contador">
        <button onclick="alterar('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome]||0}</span>
        <button onclick="alterar('${p.nome}',1,${precoFinal})">+</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function alterar(nome,valor,preco=0){
  if(!carrinho[nome]) carrinho[nome]={qtd:0,preco};
  carrinho[nome].qtd+=valor;
  if(carrinho[nome].qtd<=0) delete carrinho[nome];
  atualizarCarrinho();
  renderizar(produtos);
}

function atualizarCarrinho(){
  const area=document.getElementById("carrinho-itens");
  const contador=document.getElementById("contador");
  const totalEl=document.getElementById("total-carrinho");

  area.innerHTML="";
  let total=0,qtd=0;

  Object.keys(carrinho).forEach(nome=>{
    const item=carrinho[nome];
    total+=item.qtd*item.preco;
    qtd+=item.qtd;
    area.innerHTML+=`<p>${nome} (${item.qtd}x) - R$ ${(item.qtd*item.preco).toFixed(2).replace('.',',')}</p>`;
  });

  totalEl.innerText="R$ "+total.toFixed(2).replace('.',',');
  contador.innerText=qtd;
}

function abrirCarrinho(){
  document.getElementById("overlay").style.display="block";
  document.getElementById("carrinho-lateral").classList.add("ativo");
}

function fecharCarrinho(){
  document.getElementById("overlay").style.display="none";
  document.getElementById("carrinho-lateral").classList.remove("ativo");
}

carregarProdutos();
