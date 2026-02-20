// ===============================
// CONFIGURAÇÃO
// ===============================

const numeroWhatsApp = "5599999999999"; // COLOQUE SEU NÚMERO COM DDI

const enderecoLoja = "Odòmáiyà Artigos Religiosos - R. Sete de Agosto, 28 - Centro, Passo Fundo - RS, 99025-030";

let produtos = [];
let carrinho = [];

// ===============================
// CARREGAR PRODUTOS DA PLANILHA
// ===============================

async function carregarProdutos() {
  const url = "COLE_AQUI_SEU_LINK_CSV";

  try {
    const resposta = await fetch(url);
    const texto = await resposta.text();
    const linhas = texto.split("\n").slice(1);

    produtos = linhas.map(linha => {
      const colunas = linha.split(",");
      return {
        id: colunas[0],
        nome: colunas[1],
        preco: parseFloat(colunas[2]),
        categoria: colunas[3],
        imagem: colunas[4],
        estoque: parseInt(colunas[5])
      };
    });

    renderizarProdutos();
  } catch (erro) {
    document.getElementById("produtos").innerHTML = "Erro ao carregar produtos.";
  }
}

// ===============================
// RENDER PRODUTOS
// ===============================

function renderizarProdutos(lista = produtos) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(prod => {
    container.innerHTML += `
      <div class="card">
        <img src="${prod.imagem}" alt="${prod.nome}" loading="lazy">
        <h3>${prod.nome}</h3>
        <p class="preco">R$ ${prod.preco.toFixed(2)}</p>
        <p class="estoque">Restam ${prod.estoque} unidades</p>
        <button onclick="adicionarCarrinho('${prod.id}')">Adicionar</button>
      </div>
    `;
  });
}

// ===============================
// CARRINHO
// ===============================

function adicionarCarrinho(id) {
  const produto = produtos.find(p => p.id === id);

  const item = carrinho.find(p => p.id === id);

  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ ...produto, qtd: 1 });
  }

  atualizarCarrinho();
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(p => p.id === id);
  if (!item) return;

  item.qtd += delta;

  if (item.qtd <= 0) {
    carrinho = carrinho.filter(p => p.id !== id);
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const container = document.getElementById("itensCarrinho");
  container.innerHTML = "";

  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;

    container.innerHTML += `
      <div class="item-carrinho">
        <strong>${item.nome}</strong>
        <div class="controle">
          <button onclick="alterarQuantidade('${item.id}', -1)">-</button>
          <span>${item.qtd}</span>
          <button onclick="alterarQuantidade('${item.id}', 1)">+</button>
        </div>
        <p>R$ ${subtotal.toFixed(2)}</p>
      </div>
    `;
  });

  document.getElementById("total").innerText = "Total: R$ " + total.toFixed(2);
  document.getElementById("contador").innerText = carrinho.length;
}

// ===============================
// FORMULÁRIO DINÂMICO
// ===============================

function alternarEntrega(valor) {
  const campoEndereco = document.getElementById("campoEndereco");
  const infoRetirada = document.getElementById("infoRetirada");

  if (valor === "entrega") {
    campoEndereco.style.display = "block";
    infoRetirada.style.display = "none";
  } else {
    campoEndereco.style.display = "none";
    infoRetirada.style.display = "block";
  }
}

// ===============================
// FINALIZAR PEDIDO
// ===============================

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const nome = document.getElementById("nomeCliente").value;
  const tipo = document.getElementById("tipoEntrega").value;
  const endereco = document.getElementById("enderecoCliente").value;
  const pagamento = document.getElementById("formaPagamento").value;
  const obs = document.getElementById("observacoes").value;

  let mensagem = "✨ Pedido Odòmáiyà ✨\n\n";
  mensagem += "🛍️ Itens:\n\n";

  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;

    mensagem += `• ${item.nome}\n`;
    mensagem += `Quantidade: ${item.qtd}\n`;
    mensagem += `Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
  });

  mensagem += `💰 Total: R$ ${total.toFixed(2)}\n\n`;
  mensagem += `👤 Cliente: ${nome}\n`;

  if (tipo === "entrega") {
    mensagem += `🚚 Entrega no endereço:\n${endereco}\n`;
    mensagem += `⚠️ Lembrar que há taxa de entrega.\n`;
  } else {
    mensagem += `🏬 Retirada na loja:\n${enderecoLoja}\n`;
  }

  mensagem += `💳 Pagamento: ${pagamento}\n`;

  if (obs) {
    mensagem += `📝 Observações: ${obs}\n`;
  }

  mensagem += "\nAguardo confirmação. 🙏";

  const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, "_blank");
}

// ===============================
carregarProdutos();
