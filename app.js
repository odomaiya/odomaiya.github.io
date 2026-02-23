/* ============================
   CONFIGURAÇÕES
============================ */
const CONFIG = {
  planilhaCSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv",
  whatsapp: "555496048808"
};

let produtos = [];
let carrinho = [];
let etapa = 1;

/* ============================
   CARREGAR PRODUTOS CSV
============================ */
async function carregarProdutos() {
  const res = await fetch(CONFIG.planilhaCSV);
  const texto = await res.text();

  const linhas = texto.split("\n").slice(1);

  produtos = linhas.map(linha => {
    const [nome, preco, categoria, imagem, estoque] = linha.split(",");

    return {
      nome: nome?.trim(),
      preco: parseFloat(preco),
      categoria: categoria?.trim(),
      imagem: imagem?.trim(),
      estoque: parseInt(estoque)
    };
  }).filter(p => p.nome);

  renderCategorias();
  renderProdutos(produtos);
}

/* ============================
   CATEGORIAS
============================ */
function renderCategorias() {
  const categorias = [...new Set(produtos.map(p => p.categoria))].sort();
  const container = document.getElementById("categorias");

  container.innerHTML = `<button onclick="filtrarCategoria('')">Todos</button>`;

  categorias.forEach(cat => {
    container.innerHTML += `
      <button onclick="filtrarCategoria('${cat}')">${cat}</button>
    `;
  });
}

function filtrarCategoria(cat) {
  if (!cat) return renderProdutos(produtos);
  const filtrado = produtos.filter(p => p.categoria === cat);
  renderProdutos(filtrado);
}

/* ============================
   RENDER PRODUTOS
============================ */
function renderProdutos(lista) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(produto => {
    const qtd = carrinho.find(i => i.nome === produto.nome)?.qtd || 0;

    container.innerHTML += `
      <div class="card">
        <img src="${produto.imagem}" loading="lazy">
        <h3>${produto.nome}</h3>
        <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
        <div class="estoque">
          ${produto.estoque > 0 
            ? `Restam ${produto.estoque} unidades` 
            : "Indisponível"}
        </div>

        <div class="controle">
          <button onclick="alterarQtd('${produto.nome}', -1)">−</button>
          <span id="qtd-${produto.nome}">${qtd}</span>
          <button onclick="alterarQtd('${produto.nome}', 1)">+</button>
        </div>
      </div>
    `;
  });
}

/* ============================
   ALTERAR QUANTIDADE
============================ */
function alterarQtd(nome, delta) {
  const produto = produtos.find(p => p.nome === nome);
  let item = carrinho.find(i => i.nome === nome);

  if (!item && delta > 0) {
    carrinho.push({ ...produto, qtd: 1 });
  } else if (item) {
    item.qtd += delta;
    if (item.qtd <= 0) {
      carrinho = carrinho.filter(i => i.nome !== nome);
    }
  }

  atualizarCarrinho();
  renderProdutos(produtos);
}

/* ============================
   ATUALIZAR CARRINHO
============================ */
function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  const totalEl = document.getElementById("total");
  const contador = document.getElementById("contador");

  if (!lista) return;

  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach(item => {
    total += item.preco * item.qtd;

    lista.innerHTML += `
      <div class="item-carrinho">
        <span>${item.nome} x${item.qtd}</span>
        <span>R$ ${(item.preco * item.qtd).toFixed(2)}</span>
      </div>
    `;
  });

  totalEl.innerText = `R$ ${total.toFixed(2)}`;
  contador.innerText = carrinho.reduce((s, i) => s + i.qtd, 0);
}

/* ============================
   ABRIR CHECKOUT
============================ */
function abrirCheckout() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  document.getElementById("checkout").classList.add("ativo");
  etapa = 1;
  mostrarEtapa();
}

function fecharCheckout() {
  document.getElementById("checkout").classList.remove("ativo");
}

/* ============================
   ETAPAS CHECKOUT
============================ */
function mostrarEtapa() {
  document.querySelectorAll(".etapa").forEach(e => e.style.display = "none");
  document.getElementById(`etapa-${etapa}`).style.display = "block";
}

function proximaEtapa() {
  if (etapa < 3) {
    etapa++;
    mostrarEtapa();
  }
}

function etapaAnterior() {
  if (etapa > 1) {
    etapa--;
    mostrarEtapa();
  }
}

/* ============================
   ENTREGA DINÂMICA
============================ */
function tipoEntrega(valor) {
  const campoEndereco = document.getElementById("campo-endereco");
  const avisoRetirada = document.getElementById("aviso-retirada");

  if (valor === "entrega") {
    campoEndereco.style.display = "block";
    avisoRetirada.style.display = "none";
  } else {
    campoEndereco.style.display = "none";
    avisoRetirada.style.display = "block";
  }
}

/* ============================
   FINALIZAR PEDIDO
============================ */
function finalizarPedido() {

  const nome = document.getElementById("cliente-nome").value;
  const entrega = document.querySelector('input[name="entrega"]:checked')?.value;
  const endereco = document.getElementById("cliente-endereco").value;
  const pagamento = document.getElementById("pagamento").value;

  if (!nome || !entrega || !pagamento) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  let mensagem = `✨ Pedido Odòmáiyà ✨\n\n`;
  mensagem += `👤 Cliente: ${nome}\n\n`;
  mensagem += `🛍️ Itens:\n`;

  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;

    mensagem += `• ${item.nome}\n`;
    mensagem += `   Qtd: ${item.qtd}\n`;
    mensagem += `   Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
  });

  mensagem += `💰 Total: R$ ${total.toFixed(2)}\n`;
  mensagem += `🚚 Tipo: ${entrega}\n`;

  if (entrega === "entrega") {
    mensagem += `📍 Endereço: ${endereco}\n`;
    mensagem += `⚠️ Taxa de entrega será informada.\n`;
  } else {
    mensagem += `📍 Retirada na loja.\n`;
  }

  mensagem += `💳 Pagamento: ${pagamento}\n\n`;
  mensagem += `Aguardo confirmação 🙏`;

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

  document.getElementById("loader").style.display = "flex";

  setTimeout(() => {
    window.open(url, "_blank");
    document.getElementById("loader").style.display = "none";
    fecharCheckout();
    carrinho = [];
    atualizarCarrinho();
    renderProdutos(produtos);
  }, 1500);
}

/* ============================
   INICIAR
============================ */
document.addEventListener("DOMContentLoaded", carregarProdutos);
