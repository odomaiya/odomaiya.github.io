const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};

async function carregarProdutos(){
  const res = await fetch(API_URL + "?acao=produtos");
  const data = await res.json();

  produtos = data.map(p => {

    const preco = Number(String(p.preco || 0).replace(",", "."));
    const promoBruta = String(p.promocao || "").trim();

    const promocao = promoBruta !== ""
      ? Number(promoBruta.replace(",", "."))
      : 0;

    return {
      nome: p.nome,
      preco: preco,
      promocao: (promocao > 0 && promocao < preco) ? promocao : 0,
      categoria: p.categoria || "Outros",
      imagem: p.imagem || "",
      estoque: Number(p.estoque) || 0
    };
  });

  // Promoções primeiro + ordem alfabética
  produtos.sort((a,b)=>{
    if(a.promocao > 0 && b.promocao === 0) return -1;
    if(a.promocao === 0 && b.promocao > 0) return 1;
    return a.nome.localeCompare(b.nome,"pt-BR");
  });

  renderizar(produtos);
}

function renderizar(lista){

  const grid = document.getElementById("produtos");
  grid.innerHTML = "";

  lista.forEach(p=>{

    const temPromo = p.promocao > 0;
    const precoFinal = temPromo ? p.promocao : p.preco;

    const card = document.createElement("div");
    card.className = "produto-card";
    if(temPromo) card.classList.add("promo-card");

    card.innerHTML = `
      ${temPromo?'<div class="badge">🔥 OFERTA</div>':""}
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      ${temPromo?
        `<div>
          <span class="antigo">R$ ${p.preco.toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>
          <span class="promo">R$ ${p.promocao.toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>
        </div>`
        :
        `<div>R$ ${p.preco.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>`
      }
      <div class="contador">
        <button onclick="alterar('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome]||0}</span>
        <button onclick="alterar('${p.nome}',1)">+</button>
      </div>
    `;

    grid.appendChild(card);
  });

  atualizarCarrinho();
}

function alterar(nome,valor){
  if(!carrinho[nome]) carrinho[nome]=0;
  carrinho[nome]+=valor;
  if(carrinho[nome]<0) carrinho[nome]=0;
  renderizar(produtos);
}

function atualizarCarrinho(){

  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contadorCarrinho");

  area.innerHTML="";
  let total=0;
  let qtdTotal=0;

  Object.keys(carrinho)
    .filter(n=>carrinho[n]>0)
    .sort((a,b)=>a.localeCompare(b,"pt-BR"))
    .forEach(nome=>{

      const p = produtos.find(x=>x.nome===nome);
      const preco = p.promocao>0?p.promocao:p.preco;

      total+=preco*carrinho[nome];
      qtdTotal+=carrinho[nome];

      area.innerHTML+=`
        <div>
          <strong>${nome}</strong><br>
          Qtde: ${carrinho[nome]}<br>
          R$ ${(preco*carrinho[nome]).toLocaleString("pt-BR",{minimumFractionDigits:2})}
        </div><hr>
      `;
    });

  contador.innerText=qtdTotal;
  document.getElementById("valorTotal").innerText=
    "R$ "+total.toLocaleString("pt-BR",{minimumFractionDigits:2});
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.toggle("ativo");
}

window.alterar = alterar;
window.abrirCarrinho = abrirCarrinho;

carregarProdutos();
