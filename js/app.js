/* ==========================================================
   ODÒMÁIYÀ ENTERPRISE SYSTEM
   Sistema completo, robusto e profissional
========================================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};
let categoriaAtual = "todas";
let buscaAtual = "";
let etapaCheckout = 1;

/* ==========================================================
   UTIL
========================================================== */

function money(v){
  return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function showLoading(state){
  const l = document.getElementById("loadingGlobal");
  if(!l) return;
  l.style.display = state ? "flex" : "none";
}

/* ==========================================================
   CARREGAR PRODUTOS
========================================================== */

async function carregarProdutos(){
  try{
    showLoading(true);

    const r = await fetch(API_URL+"?acao=produtos",{cache:"no-store"});
    produtos = await r.json();

    produtos.sort((a,b)=>{
      if(b.promocao>0 && a.promocao===0) return 1;
      if(a.promocao>0 && b.promocao===0) return -1;
      return a.nome.localeCompare(b.nome);
    });

    montarCategorias();
    renderProdutos();

  }catch(e){
    alert("Erro ao carregar produtos.");
  }finally{
    showLoading(false);
  }
}

/* ==========================================================
   CATEGORIAS DINÂMICAS
========================================================== */

function montarCategorias(){
  const container = document.getElementById("categorias");
  if(!container) return;

  const categorias = [...new Set(produtos.map(p=>p.categoria).filter(Boolean))];

  container.innerHTML = "";

  criarBotaoCategoria("todas","Todas");

  categorias.forEach(cat=>{
    criarBotaoCategoria(cat,cat);
  });
}

function criarBotaoCategoria(valor,label){
  const btn = document.createElement("button");
  btn.className = "categoria-btn" + (categoriaAtual===valor?" ativa":"");
  btn.innerText = label;
  btn.onclick = ()=>{
    categoriaAtual = valor;
    atualizarCategoriasUI();
    renderProdutos();
  };
  document.getElementById("categorias").appendChild(btn);
}

function atualizarCategoriasUI(){
  document.querySelectorAll(".categoria-btn").forEach(btn=>{
    btn.classList.remove("ativa");
    if(btn.innerText.toLowerCase()===categoriaAtual.toLowerCase()
      || (categoriaAtual==="todas" && btn.innerText==="Todas")){
        btn.classList.add("ativa");
    }
  });
}

/* ==========================================================
   FILTRO + BUSCA
========================================================== */

function renderProdutos(){
  const grid = document.getElementById("produtos");
  grid.innerHTML = "";

  let lista = produtos.filter(p=>{
    const matchCategoria = categoriaAtual==="todas" || p.categoria===categoriaAtual;
    const matchBusca = p.nome.toLowerCase().includes(buscaAtual.toLowerCase());
    return matchCategoria && matchBusca;
  });

  lista.forEach(p=>{
    const preco = p.promocao>0?p.promocao:p.preco;
    const estoqueBaixo = p.estoque>0 && p.estoque<10;

    const card = document.createElement("div");
    card.className = "produto"
      + (p.promocao>0?" promo":"")
      + (estoqueBaixo?" quase-esgotado":"");

    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <h4>${p.nome}</h4>
      <p>${money(preco)}</p>
      ${estoqueBaixo?'<div class="aviso-estoque">⚠ Poucas unidades</div>':''}
      <div class="contador">
        <button onclick="alterarQtd('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome]||0}</span>
        <button onclick="alterarQtd('${p.nome}',1)">+</button>
      </div>
    `;

    grid.appendChild(card);
  });

  atualizarCarrinhoUI();
}

/* ==========================================================
   ALTERAR QUANTIDADE
========================================================== */

function alterarQtd(nome,valor){
  const produto = produtos.find(p=>p.nome===nome);
  if(!produto) return;

  if(!carrinho[nome]) carrinho[nome]=0;

  if(valor>0 && carrinho[nome]>=produto.estoque){
    alert("Estoque máximo atingido.");
    return;
  }

  carrinho[nome]+=valor;
  if(carrinho[nome]<0) carrinho[nome]=0;

  renderProdutos();
}

/* ==========================================================
   CARRINHO DRAWER
========================================================== */

function abrirCarrinho(){
  document.getElementById("drawer").classList.add("ativo");
  document.getElementById("overlay").style.display="block";
}

function fecharCarrinho(){
  document.getElementById("drawer").classList.remove("ativo");
  document.getElementById("overlay").style.display="none";
}

function atualizarCarrinhoUI(){
  const lista = document.getElementById("listaCarrinho");
  const totalEl = document.getElementById("totalCarrinho");

  let total = 0;
  let html = "";

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const p = produtos.find(x=>x.nome===nome);
      const preco = p.promocao>0?p.promocao:p.preco;
      total += preco*carrinho[nome];

      html+=`
      <div style="margin-bottom:10px;">
        <strong>${nome}</strong><br>
        ${carrinho[nome]}x ${money(preco)}
      </div>
      `;
    }
  });

  if(!html) html="<p>Seu carrinho está vazio</p>";

  lista.innerHTML = html;
  totalEl.innerText = money(total);
}

/* ==========================================================
   CHECKOUT MULTI ETAPA
========================================================== */

function abrirCheckout(){
  fecharCarrinho();
  document.getElementById("modalCheckout").style.display="flex";
  etapaCheckout=1;
  atualizarEtapas();
}

function proximaEtapa(){
  if(etapaCheckout<3){
    etapaCheckout++;
    atualizarEtapas();
  }
}

function voltarEtapa(){
  if(etapaCheckout>1){
    etapaCheckout--;
    atualizarEtapas();
  }
}

function atualizarEtapas(){
  document.querySelectorAll(".etapa").forEach((e,i)=>{
    e.style.display = (i+1===etapaCheckout)?"block":"none";
  });
}

/* ==========================================================
   SUGESTÃO INTELIGENTE
========================================================== */

function sugerirProduto(){
  const itens = Object.keys(carrinho).filter(n=>carrinho[n]>0);
  if(itens.length===0) return null;

  const base = produtos.find(p=>p.nome===itens[0]);
  if(!base) return null;

  const sugestao = produtos
    .filter(p=>p.categoria===base.categoria && !itens.includes(p.nome))
    .sort((a,b)=>b.promocao-a.promocao || a.preco-b.preco)[0];

  return sugestao||null;
}

/* ==========================================================
   FINALIZAR PEDIDO
========================================================== */

async function finalizarPedido(){

  const nome = document.getElementById("cliente").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if(!nome || !telefone){
    alert("Preencha nome e telefone.");
    return;
  }

  let total = 0;
  let mensagem = "✨ *Novo Pedido Odòmáiyà* ✨\n\n";
  mensagem += "👤 Cliente: "+nome+"\n";
  mensagem += "📞 Telefone: "+telefone+"\n\n";
  mensagem += "🛍️ Itens:\n";

  Object.keys(carrinho).forEach(n=>{
    if(carrinho[n]>0){
      const p = produtos.find(x=>x.nome===n);
      const preco = p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[n];
      mensagem+=`• ${n} x${carrinho[n]} — ${money(preco)}\n`;
    }
  });

  mensagem+=`\n💰 Total: ${money(total)}\n`;

  try{
    await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({
        cliente:nome,
        telefone:telefone,
        itens:carrinho,
        total:total
      })
    });

    window.open("https://wa.me/555496048808?text="+encodeURIComponent(mensagem));
    location.reload();

  }catch{
    alert("Erro ao enviar pedido.");
  }
}

/* ==========================================================
   BUSCA
========================================================== */

document.addEventListener("input",e=>{
  if(e.target.id==="busca"){
    buscaAtual = e.target.value;
    renderProdutos();
  }
});

/* ==========================================================
   INIT
========================================================== */

document.addEventListener("DOMContentLoaded",()=>{
  carregarProdutos();
});
