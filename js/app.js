const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};
let categoriaAtual = "Todos";

/* =========================
   CARREGAR PRODUTOS
========================= */
async function carregarProdutos(){
  try{
    const res = await fetch(API_URL + "?acao=produtos");
    const data = await res.json();

    produtos = data.map(p => ({
      nome: p.nome,
      preco: Number(p.preco),
      promocao: Number(p["promoçao"]) || 0,
      categoria: p.categoria,
      imagem: p.imagem,
      estoque: Number(p.estoque)
    }));

    // Promoções primeiro
    produtos.sort((a,b)=>{
      const promoA = a.promocao > 0 ? 1 : 0;
      const promoB = b.promocao > 0 ? 1 : 0;
      return promoB - promoA;
    });

    criarFiltros();
    renderizar(produtos);

  }catch(e){
    console.error("Erro ao carregar:", e);
    document.getElementById("produtos").innerHTML="<p>Erro ao carregar produtos.</p>";
  }
}

/* =========================
   FILTROS
========================= */
function criarFiltros(){
  const area=document.getElementById("filtros");
  const categorias=["Todos",...new Set(produtos.map(p=>p.categoria))];
  area.innerHTML="";

  categorias.forEach(cat=>{
    const btn=document.createElement("button");
    btn.innerText=cat;
    btn.onclick=()=>filtrar(cat);
    area.appendChild(btn);
  });
}

function filtrar(cat){
  categoriaAtual=cat;
  if(cat==="Todos") renderizar(produtos);
  else renderizar(produtos.filter(p=>p.categoria===cat));
}

/* =========================
   RENDERIZAR PRODUTOS
========================= */
function renderizar(lista){
  const grid=document.getElementById("produtos");
  grid.innerHTML="";

  const fragment=document.createDocumentFragment();

  lista.forEach((p,index)=>{
    const precoFinal=p.promocao>0?p.promocao:p.preco;
    const temPromo=p.promocao>0;

    const card=document.createElement("div");
    card.className="produto-card";
    card.style.animationDelay = `${index * 40}ms`;

    card.innerHTML=`
      ${temPromo?`<div class="badge">PROMOÇÃO</div>`:""}
      <img src="${p.imagem}" loading="lazy">
      <h3>${p.nome}</h3>
      ${temPromo?
      `<div><span class="antigo">R$ ${p.preco.toFixed(2)}</span> 
       <span class="promo">R$ ${p.promocao.toFixed(2)}</span></div>`:
      `<div>R$ ${p.preco.toFixed(2)}</div>`}
      <small>Estoque: ${p.estoque}</small>
      <div class="contador">
        <button onclick="alterar('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome]||0}</span>
        <button onclick="alterar('${p.nome}',1)">+</button>
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  atualizarCarrinho();
}

/* =========================
   CARRINHO
========================= */
function alterar(nome,valor){
  const produto=produtos.find(p=>p.nome===nome);
  if(!carrinho[nome]) carrinho[nome]=0;
  if(valor>0 && carrinho[nome]>=produto.estoque) return;
  carrinho[nome]+=valor;
  if(carrinho[nome]<0) carrinho[nome]=0;
  filtrar(categoriaAtual);
}

function atualizarCarrinho(){
  const area=document.getElementById("itensCarrinho");
  area.innerHTML="";
  let total=0;
  let contador=0;

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const p=produtos.find(x=>x.nome===nome);
      const preco=p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[nome];
      contador+=carrinho[nome];

      area.innerHTML+=`
      <div>
        <strong>${nome}</strong><br>
        Qtd: ${carrinho[nome]}<br>
        R$ ${(preco*carrinho[nome]).toFixed(2)}
        <hr>
      </div>`;
    }
  });

  document.getElementById("valorTotal").innerText="R$ "+total.toFixed(2);
  document.getElementById("contadorCarrinho").innerText=contador;
}

/* =========================
   ABRIR / FECHAR
========================= */
function abrirCarrinho(){
  document.getElementById("drawerCarrinho").style.display="flex";
}

function fecharCarrinho(){
  document.getElementById("drawerCarrinho").style.display="none";
}

/* =========================
   INICIAR
========================= */
carregarProdutos();
