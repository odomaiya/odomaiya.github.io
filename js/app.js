const api = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = [];

fetch(api)
.then(res => res.json())
.then(data => {
    produtos = data;
    renderProdutos(produtos);
});

function renderProdutos(lista){
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(prod => {
        container.innerHTML += `
        <div class="card">
            <h3>${prod.nome}</h3>
            <p>R$ ${Number(prod.preco).toFixed(2)}</p>
            <button onclick="adicionar(${prod.id})">Adicionar</button>
        </div>
        `;
    });
}

function adicionar(id){
    const item = produtos.find(p => p.id == id);
    const existente = carrinho.find(p => p.id == id);

    if(existente){
        existente.qtd++;
    } else {
        carrinho.push({...item, qtd:1});
    }

    atualizarCarrinho();
}

function atualizarCarrinho(){
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const countEl = document.getElementById("cart-count");

    container.innerHTML = "";
    let total = 0;
    let count = 0;

    carrinho.forEach(item => {
        total += item.preco * item.qtd;
        count += item.qtd;

        container.innerHTML += `
        <p>${item.nome} (${item.qtd}x) - R$ ${(item.preco*item.qtd).toFixed(2)}</p>
        `;
    });

    totalEl.innerText = "R$ " + total.toFixed(2);
    countEl.innerText = count;
}

function toggleCarrinho(){
    document.getElementById("carrinho").classList.toggle("ativo");
}

function abrirCheckout(){
    document.getElementById("checkout").classList.remove("hidden");
}

function fecharCheckout(){
    document.getElementById("checkout").classList.add("hidden");
}

document.getElementById("cep").addEventListener("blur", function(){
    const cep = this.value.replace(/\D/g,"");
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("rua").value = data.logradouro;
        document.getElementById("cidade").value = data.localidade;
    });
});

function finalizarPedido(){
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

    carrinho.forEach(item=>{
        mensagem += `• ${item.nome} (${item.qtd}x) - R$ ${(item.preco*item.qtd).toFixed(2)}\n`;
        total += item.preco * item.qtd;
    });

    mensagem += `\n💰 Total: R$ ${total.toFixed(2)}`;

    const url = `https://wa.me/555496048808?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}
