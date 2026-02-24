const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};
let categoriaAtual = "Todos";

async function carregarProdutos() {
  const res = await fetch(API_URL + "?acao=produtos");
  produtos = await res.json();
  criarFiltros();
  renderizar(produtos);
}

function criarFiltros() {
  const area = document.getElementById("filtros");
  const categorias = ["Todos", ...new Set(produtos.map(p => p.categoria))];
  area.innerHTML = "";

  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filtro-btn";
    btn.innerText = cat;
    btn.onclick = () => filtrar(cat);
    area.appendChild(btn);
  });
}

function filtrar(cat) {
  categoriaAtual = cat;
  if (cat === "Todos") renderizar(produtos);
  else renderizar(produtos.filter(p => p.categoria === cat));
}

function renderizar(lista) {
  const grid = document.getElementById("produtos");
  grid.innerHTML = "";

  lista.forEach(p => {

    const precoFinal = p.promocao && p.promocao > 0 ? p.promocao : p.preco;
    const temPromo = p.promocao && p.promocao > 0;

    const card = document.createElement("div");
    card.className = "produto-card";

    card.innerHTML = `
      ${temPromo ? `<div class="badge">PROMOÇÃO</div>` : ""}
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      ${temPromo 
        ? `<div class="preco">
            <span class="antigo">R$ ${p.preco}</span>
            <span class="promo">R$ ${p.promocao}</span>
           </div>`
        : `<div class="preco">R$ ${p.preco}</div>`
      }
      <small>Estoque: ${p.estoque}</small>
      <div class="contador">
        <button onclick="alterar('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome] || 0}</span>
        <button onclick="alterar('${p.nome}',1)">+</button>
      </div>
    `;

    grid.appendChild(card);
  });

  atualizarCarrinho();
}

function alterar(nome, valor) {
  const produto = produtos.find(p => p.nome === nome);

  if (!carrinho[nome]) carrinho[nome] = 0;

  if (valor > 0 && carrinho[nome] >= produto.estoque) return;

  carrinho[nome] += valor;
  if (carrinho[nome] < 0) carrinho[nome] = 0;

  renderizar(produtos.filter(p => categoriaAtual === "Todos" || p.categoria === categoriaAtual));
}

function atualizarCarrinho() {
  const area = document.getElementById("itensCarrinho");
  area.innerHTML = "";
  let total = 0;

  Object.keys(carrinho).forEach(nome => {
    if (carrinho[nome] > 0) {
      const p = produtos.find(x => x.nome === nome);
      const preco = p.promocao && p.promocao > 0 ? p.promocao : p.preco;
      total += preco * carrinho[nome];

      area.innerHTML += `<div>${nome} x${carrinho[nome]}</div>`;
    }
  });

  document.getElementById("valorTotal").innerText = "R$ " + total.toFixed(2);
}

function abrirCheckout() {
  const modal = document.getElementById("modalCheckout");
  const conteudo = document.getElementById("checkoutConteudo");

  conteudo.innerHTML = `
    <h2>Finalizar Pedido</h2>
    <input id="nomeCliente" placeholder="Seu nome">
    
    <div class="radio-group">
      <label><input type="radio" name="tipo" value="Retirada" checked> Retirada</label>
      <label><input type="radio" name="tipo" value="Entrega"> Entrega</label>
    </div>

    <div id="enderecoArea" style="display:none;">
      <input id="endereco" placeholder="Digite seu endereço">
    </div>

    <select id="pagamento">
      <option>Pix</option>
      <option>Crédito</option>
      <option>Débito</option>
      <option>Dinheiro</option>
    </select>

    <button onclick="confirmarPedido()">Confirmar Pedido</button>
  `;

  document.querySelectorAll("input[name='tipo']").forEach(r => {
    r.addEventListener("change", e => {
      document.getElementById("enderecoArea").style.display =
        e.target.value === "Entrega" ? "block" : "none";
    });
  });

  modal.style.display = "flex";
}

async function confirmarPedido() {
  const nome = document.getElementById("nomeCliente").value;
  const tipo = document.querySelector("input[name='tipo']:checked").value;
  const pagamento = document.getElementById("pagamento").value;
  const endereco = tipo === "Entrega" ? document.getElementById("endereco").value : "";

  if (!nome) return alert("Digite seu nome");

  let itens = [];
  let total = 0;

  Object.keys(carrinho).forEach(nomeProduto => {
    if (carrinho[nomeProduto] > 0) {
      const p = produtos.find(x => x.nome === nomeProduto);
      const preco = p.promocao && p.promocao > 0 ? p.promocao : p.preco;

      itens.push({
        nome: nomeProduto,
        quantidade: carrinho[nomeProduto],
        preco
      });

      total += preco * carrinho[nomeProduto];
    }
  });

  const venda = {
    cliente: { nome, tipo, endereco, pagamento },
    itens,
    total
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(venda)
  });

  let mensagem = `✨ Odòmàiyá Artigos Religiosos ✨%0A`;
  mensagem += `Cliente: ${nome}%0A`;
  mensagem += `Tipo: ${tipo}%0A`;
  if (tipo === "Entrega") mensagem += `Endereço: ${endereco}%0A`;
  mensagem += `Pagamento: ${pagamento}%0A%0A`;

  itens.forEach(i => {
    mensagem += `${i.nome} x${i.quantidade}%0A`;
  });

  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  window.open(`https://wa.me/555496048808?text=${mensagem}`);

  carrinho = {};
  await carregarProdutos();
  document.getElementById("modalCheckout").style.display = "none";
}

carregarProdutos();
