
/* ========================================
   ODÒMÁIYÀ - APP.JS PROFISSIONAL
   Versão Blindada 2.0
======================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

/* ========================================
   INIT
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    atualizarCarrinhoUI();
});

/* ========================================
   LOADER
======================================== */

function mostrarLoader() {
    document.getElementById("produtos").innerHTML = `
        <div style="text-align:center;padding:40px;font-weight:600;">
            Carregando produtos...
        </div>
    `;
}

/* ========================================
   BUSCAR PRODUTOS
======================================== */

async function carregarProdutos() {
    mostrarLoader();

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro na API");

        const data = await response.json();

        produtos = data.filter(p => p.estoque > 0);

        renderProdutos(produtos);
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("produtos").innerHTML = `
            <div style="text-align:center;padding:40px;color:red;">
                Não foi possível carregar os produtos.
            </div>
        `;
    }
}

/* ========================================
   RENDER PRODUTOS
======================================== */

function renderProdutos(lista) {
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach(produto => {
        const promoClass = produto.promocao ? "promo" : "";
        const estoqueBaixo = produto.estoque < 10 ? "quase-esgotado" : "";

        container.innerHTML += `
            <div class="produto ${promoClass} ${estoqueBaixo}">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p class="preco">
                    ${produto.promocao ? 
                        `<span class="preco-antigo">R$ ${produto.preco}</span> 
                         R$ ${produto.promocao}` 
                        : `R$ ${produto.preco}`
                    }
                </p>
                <p class="estoque">Estoque: ${produto.estoque}</p>
                ${produto.estoque < 10 ? `<p class="aviso-estoque">⚠ Poucas unidades</p>` : ""}
                <button onclick="adicionarCarrinho('${produto.nome}')">
                    Adicionar
                </button>
            </div>
        `;
    });
}

/* ========================================
   CARRINHO
======================================== */

function adicionarCarrinho(nome) {
    const produto = produtos.find(p => p.nome === nome);
    if (!produto) return;

    const existente = carrinho.find(item => item.nome === nome);

    if (existente) {
        if (existente.quantidade < produto.estoque) {
            existente.quantidade++;
        } else {
            alert("Estoque máximo atingido.");
            return;
        }
    } else {
        carrinho.push({
            nome: produto.nome,
            preco: produto.promocao || produto.preco,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarCarrinhoUI();
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarCarrinhoUI() {
    const total = carrinho.reduce((soma, item) => {
        return soma + (item.preco * item.quantidade);
    }, 0);

    document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`;
}

/* ========================================
   CHECKOUT
======================================== */

async function finalizarPedido() {

    if (carrinho.length === 0) {
        alert("Carrinho vazio.");
        return;
    }

    const nome = prompt("Seu nome:");
    const telefone = prompt("Seu telefone:");

    if (!nome || !telefone) {
        alert("Preencha corretamente.");
        return;
    }

    const pedido = {
        cliente: nome,
        telefone: telefone,
        itens: carrinho,
        total: carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(pedido)
        });

        if (!response.ok) throw new Error("Erro ao enviar");

        alert("Pedido enviado com sucesso!");
        carrinho = [];
        salvarCarrinho();
        atualizarCarrinhoUI();

    } catch (error) {
        alert("Erro ao enviar pedido.");
        console.error(error);
    }
}
