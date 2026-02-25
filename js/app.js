const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = [];

async function carregarProdutos() {
    const res = await fetch(API_URL);
    const data = await res.json();

    produtos = data.map(p => ({
        ...p,
        preco: Number(String(p.preco).replace(",", "."))
    }));

    renderizarProdutos(produtos);
}

function renderizarProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(prod => {
        container.innerHTML += `
            <div class="card">
                ${prod.promocao ? `<span class="badge">Promoção</span>` : ""}
                <img src="${prod.imagem}" alt="${prod.nome}">
                <h3>${prod.nome}</h3>
                <p class="preco">R$ ${prod.preco.toFixed(2)}</p>
                <div class="controle">
                    <button onclick="alterarQtd(${prod.id}, -1)">-</button>
                    <span id="qtd-${prod.id}">0</span>
                    <button onclick="alterarQtd(${prod.id}, 1)">+</button>
                </div>
            </div>
        `;
    });
}

function alterarQtd(id, delta) {
    const produto = produtos.find(p => p.id == id);
    if (!produto) return;

    let item = carrinho.find(p => p.id == id);

    if (!item && delta > 0) {
        carrinho.push({ ...produto, qtd: 1 });
    } else if (item) {
        item.qtd += delta;
        if (item.qtd <= 0) {
            carrinho = carrinho.filter(p => p.id != id);
        }
    }

    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const countEl = document.getElementById("cart-count");

    lista.innerHTML = "";
    let total = 0;
    let quantidade = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.qtd;
        total += subtotal;
        quantidade += item.qtd;

        lista.innerHTML += `
            <div class="item-carrinho">
                <p>${item.nome}</p>
                <p>${item.qtd}x - R$ ${subtotal.toFixed(2)}</p>
            </div>
        `;
    });

    totalEl.innerText = `R$ ${total.toFixed(2)}`;
    countEl.innerText = quantidade;
}

function toggleCarrinho() {
    document.getElementById("carrinho").classList.toggle("ativo");
}

function abrirCheckout() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }
    document.getElementById("checkout").classList.remove("hidden");
}

function fecharCheckout() {
    document.getElementById("checkout").classList.add("hidden");
}

document.getElementById("cep").addEventListener("blur", async function () {
    const cep = this.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();

    document.getElementById("rua").value = data.logradouro || "";
    document.getElementById("cidade").value = data.localidade || "";
});

function finalizarPedido() {
    const nome = document.getElementById("nome").value;
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value;
    const cidade = document.getElementById("cidade").value;
    const pagamento = document.getElementById("pagamento").value;

    let mensagem = `✨ *Novo Pedido Odòmáiyà* ✨\n\n`;
    mensagem += `👤 Cliente: ${nome}\n`;
    mensagem += `📍 Entrega: ${rua}, ${numero} - ${cidade}\n`;
    mensagem += `💳 Pagamento: ${pagamento}\n\n`;
    mensagem += `🛒 Itens:\n`;

    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.qtd;
        mensagem += `• ${item.nome} (${item.qtd}x) - R$ ${subtotal.toFixed(2)}\n`;
        total += subtotal;
    });

    mensagem += `\n💰 Total: R$ ${total.toFixed(2)}`;

    const url = `https://wa.me/555496048808?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}

carregarProdutos();
