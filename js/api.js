/* =========================================
API DA LOJA - ODOMAIYA
Conexão com Google Sheets
========================================= */

async function apiFetch() {

    try {

        const response = await fetch(CONFIG.API_URL, {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Erro ao acessar API");
        }

        const data = await response.json();

        return data;

    } catch (error) {

        console.error("Erro API:", error);

        return [];

    }

}



/* =========================================
NORMALIZAR PRODUTO
========================================= */

function normalizarProduto(p) {

    return {

        nome: p.nome || "",

        preco: Number(p.preco) || 0,

        promocao: (p.promocao || "").toUpperCase(),

        categoria: (p.categoria || "").toLowerCase(),

        imagem: p.imagem || "",

        estoque: Number(p.estoque) || 0,

        id: gerarIdProduto(p)

    };

}



/* =========================================
GERAR ID
========================================= */

function gerarIdProduto(p) {

    return (p.nome || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

}



/* =========================================
BUSCAR PRODUTOS
========================================= */

async function buscarProdutos() {

    const data = await apiFetch();

    if (!Array.isArray(data)) return [];

    return data.map(normalizarProduto);

}



/* =========================================
BUSCAR PRODUTO POR ID
========================================= */

async function buscarProdutoPorId(id) {

    const produtos = await buscarProdutos();

    return produtos.find(p => p.id === id);

}



/* =========================================
PRODUTOS POR CATEGORIA
========================================= */

async function buscarPorCategoria(categoria) {

    const produtos = await buscarProdutos();

    return produtos.filter(p => p.categoria === categoria);

}



/* =========================================
PRODUTOS EM PROMOÇÃO
========================================= */

async function buscarPromocoes() {

    const produtos = await buscarProdutos();

    return produtos.filter(p => p.promocao === "SIM");

}



/* =========================================
PRODUTOS COM ESTOQUE
========================================= */

async function buscarDisponiveis() {

    const produtos = await buscarProdutos();

    return produtos.filter(p => p.estoque > 0);

}



/* =========================================
RANKING DE PRODUTOS
========================================= */

function ordenarPorPreco(produtos) {

    return produtos.sort((a, b) => a.preco - b.preco);

}



/* =========================================
PRODUTOS RELACIONADOS
========================================= */

function produtosRelacionados(produto, lista) {

    return lista
        .filter(p => p.categoria === produto.categoria && p.id !== produto.id)
        .slice(0, 6);

}



/* =========================================
BUSCA INTELIGENTE
========================================= */

function buscaProdutos(lista, termo) {

    termo = termo.toLowerCase();

    return lista.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.categoria.includes(termo)
    );

}



/* =========================================
CACHE LOCAL
========================================= */

function salvarCache(produtos) {

    if (!CONFIG.CACHE.usarLocalStorage) return;

    localStorage.setItem("produtos_cache", JSON.stringify(produtos));

    localStorage.setItem("produtos_cache_time", Date.now());

}

function carregarCache() {

    if (!CONFIG.CACHE.usarLocalStorage) return null;

    const data = localStorage.getItem("produtos_cache");

    const time = localStorage.getItem("produtos_cache_time");

    if (!data || !time) return null;

    const expirou = Date.now() - time > CONFIG.CACHE.tempoProdutos;

    if (expirou) return null;

    return JSON.parse(data);

}



/* =========================================
CARREGAR PRODUTOS OTIMIZADO
========================================= */

async function carregarProdutos() {

    const cache = carregarCache();

    if (cache) return cache;

    const produtos = await buscarProdutos();

    salvarCache(produtos);

    return produtos;

}
