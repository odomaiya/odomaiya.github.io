const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?output=csv";

let produtos = [];
let carrinho = {};

fetch(CSV_URL)
  .then(res => res.text())
  .then(text => {
    const linhas = text.split("\n").slice(1);
    linhas.forEach(l => {
      const [nome, preco, categoria, imagem, estoque] = l.split(",");
      produtos.push({ nome, preco: Number(preco), categoria, imagem, estoque: Number(estoque) });
    });
    renderProdutos();
    carregarCategorias();
  });

function renderProdutos(lista = produtos) {
  const area = document.getElementById("produtos");
  area.innerHTML = "";
  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      <div class="price">R$ ${p.preco.toFixed(2)}</div>
      <div class="stock">Em estoque: ${p.estoque}</div>
      <div class="qty">
        <button onclick="alterarQtd('${p.nome}', -1)">-</button>
        <span>${carrinho[p.nome]?.qtd || 0}</span>
        <button onclick="alterarQtd('${p.nome}', 1)">+</button>
      </div>
      <button class="add" onclick="adicionar('${p.nome}')">Adicionar</button>
    `;
    area.appendChild(card);
  });
}

function alterarQtd(nome, v) {
  if (!carrinho[nome]) carrinho[nome] = { qtd: 0 };
  carrinho[nome].qtd = Math.max(0, carrinho[nome].qtd + v);
  atualizarCarrinho();
  renderProdutos();
}

function adicionar(nome) {
  if (!carrinho[nome]) carrinho[nome] = { qtd: 1 };
  atualizarCarrinho();
}

function atualizarCarrinho() {
  let total = 0;
  let count = 0;
  Object.keys(carrinho).forEach(n => {
    const prod = produtos.find(p => p.nome === n);
    total += carrinho[n].qtd * prod.preco;
    count += carrinho[n].qtd;
  });
  document.getElementById("cart-count").innerText = count;
}

document.getElementById("cart-button").onclick = () =>
  document.getElementById("cart-modal").style.display = "block";

document.getElementById("fechar").onclick = () =>
  document.getElementById("cart-modal").style.display = "none";

document.getElementById("finalizar").onclick = () => {
  let msg = "🧾 Pedido Odòmáiyà\n\n";
  let total = 0;
  Object.keys(carrinho).forEach(n => {
    const p = produtos.find(x => x.nome === n);
    msg += `${n} – ${carrinho[n].qtd} un\n`;
    total += carrinho[n].qtd * p.preco;
  });
  msg += `\nTotal: R$ ${total.toFixed(2)}`;
  window.open(`https://wa.me/SEUNUMERO?text=${encodeURIComponent(msg)}`);
};
