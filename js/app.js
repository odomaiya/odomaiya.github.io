const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?output=csv";
const WHATS = "5554996048808";

let produtos = [];
let carrinho = [];

async function carregar() {
  const res = await fetch(CSV_URL);
  const texto = await res.text();
  const linhas = texto.split("\n").slice(1);

  produtos = linhas.map(l => {
    const [id,nome,preco,estoque,categoria,imagem,ativo] = l.split(",");
    return {id,nome,preco:+preco,estoque:+estoque,imagem,ativo};
  }).filter(p => p.ativo === "sim");

  render(produtos);
}

function render(lista) {
  const area = document.getElementById("produtos");
  area.innerHTML = "";
  lista.forEach(p => {
    area.innerHTML += `
      <div class="card">
        <img src="${p.imagem}">
        <h3>${p.nome}</h3>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <div class="estoque">Estoque: ${p.estoque}</div>
        <div class="qtd">
          <button onclick="alterar(${p.id},-1)">-</button>
          <span id="q${p.id}">1</span>
          <button onclick="alterar(${p.id},1)">+</button>
        </div>
        <button class="add" onclick="add(${p.id})">Adicionar</button>
      </div>
    `;
  });
}

function alterar(id, v) {
  const s = document.getElementById("q"+id);
  let n = +s.innerText + v;
  if (n < 1) n = 1;
  s.innerText = n;
}

function add(id) {
  const p = produtos.find(x => x.id == id);
  const qtd = +document.getElementById("q"+id).innerText;
  carrinho.push({...p,qtd});
  atualizar();
}

function atualizar() {
  const total = carrinho.reduce((s,i)=>s+i.preco*i.qtd,0);
  document.getElementById("total").innerText = "R$ " + total.toFixed(2);
}

function finalizar() {
  let msg = "🛍 Pedido Odòmáiyà\n\n";
  carrinho.forEach(i=>{
    msg += `${i.qtd}x ${i.nome} – R$ ${(i.preco*i.qtd).toFixed(2)}\n`;
  });
  msg += `\nTotal: R$ ${carrinho.reduce((s,i)=>s+i.preco*i.qtd,0).toFixed(2)}`;
  window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`);
}

carregar();
