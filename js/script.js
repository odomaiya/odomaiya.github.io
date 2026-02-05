const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfMSS4eNDSyxy558PIJ3SbMeGWolSWa3hi5yzomDK6XYALEcdPM6s-toS0SFaZL-e-QC7jQvJVVcxW/pub?output=csv";
const numeroWhats = "5542999861309";
const enderecoLoja = "Rua Sete de Agosto, 28 – Passo Fundo/RS";

let produtos = [];
let carrinho = [];

fetch(csvUrl)
  .then(r => r.text())
  .then(csv => {
    const linhas = csv.split("\n").slice(1);
    linhas.forEach(l => {
      const [id,nome,categoria,preco,desconto,estoque,imagem,destaque] = l.split(",");
      if (nome) {
        produtos.push({
          nome,
          categoria,
          preco: Number(preco),
          desconto: Number(desconto),
          imagem,
          destaque
        });
      }
    });
    renderizar(produtos);
  });

function renderizar(lista) {
  const c = document.getElementById("produtos");
  c.innerHTML = "";
  lista.forEach(p => {
    const precoFinal = p.desconto > 0 ? p.preco - p.desconto : p.preco;
    c.innerHTML += `
      <div class="card">
        ${p.destaque === "sim" ? <div class="promo">Promoção</div> : ""}
        <img src="${p.imagem}">
        <h4>${p.nome}</h4>
        <p class="preco"><strong>R$ ${precoFinal.toFixed(2)}</strong></p>
        <button onclick="add('${p.nome}', ${precoFinal})">Adicionar</button>
      </div>
    `;
  });
}

document.getElementById("ordenar").onchange = e => {
  if (e.target.value === "menor") {
    renderizar([...produtos].sort((a,b)=>a.preco-b.preco));
  }
  if (e.target.value === "maior") {
    renderizar([...produtos].sort((a,b)=>b.preco-a.preco));
  }
};

function add(nome, preco) {
  const i = carrinho.find(p=>p.nome===nome);
  i ? i.qtd++ : carrinho.push({nome,preco,qtd:1});
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const l = document.getElementById("itens-carrinho");
  let t = 0, q = 0;
  l.innerHTML = "";
  carrinho.forEach(p=>{
    t += p.preco*p.qtd;
    q += p.qtd;
    l.innerHTML += <div>${p.nome} x${p.qtd}</div>;
  });
  document.getElementById("contador").innerText = q;
  document.getElementById("total").innerText = "Total: R$ "+t.toFixed(2);
}

document.getElementById("btn-carrinho").onclick=()=>document.getElementById("carrinho-modal").style.display="block";
document.getElementById("fechar").onclick=()=>document.getElementById("carrinho-modal").style.display="none";

document.getElementById("finalizar").onclick=()=>{
  document.getElementById("opcoes-entrega").style.display="block";
};

function montarMsg(extra){
  let m="🛍 Pedido Odòmáiyà:%0A";
  carrinho.forEach(p=>m+=• ${p.nome} x${p.qtd}%0A);
  return m+extra;
}

document.getElementById("retirada").onclick=()=>{
  window.open(https://wa.me/${numeroWhats}?text=+montarMsg(%0ARetirada na loja:%0A${enderecoLoja}));
};

document.getElementById("entrega").onclick=()=>{
  window.open(https://wa.me/${numeroWhats}?text=+montarMsg(%0AEntrega.%0AInforme seu endereço:));
};
