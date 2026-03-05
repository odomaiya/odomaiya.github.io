/* =========================================
CONFIGURAÇÃO GLOBAL DA LOJA
Odòmáiyà Artigos Religiosos
========================================= */

const CONFIG = {

    /* ==============================
    API GOOGLE SHEETS
    ============================== */

    API_URL: "https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec",

    API_TIMEOUT: 15000,


    /* ==============================
    WHATSAPP CHECKOUT
    ============================== */

    WHATSAPP: "555496048808",


    /* ==============================
    INFORMAÇÕES DA LOJA
    ============================== */

    LOJA: {

        nome: "Odòmáiyà Artigos Religiosos",

        endereco: "R. Sete de Agosto, 28 - Centro, Passo Fundo - RS",

        cidade: "Passo Fundo",

        estado: "RS",

        pais: "Brasil"

    },


    /* ==============================
    IDENTIDADE VISUAL
    ============================== */

    DESIGN: {

        corPrimaria: "#0b3a63",

        corSecundaria: "#0f5fa8",

        corDestaque: "#c7d9ff",

        corFundo: "#f8fbff",

        corTexto: "#1d1d1d"

    },


    /* ==============================
    ANIMAÇÕES
    ============================== */

    ANIMACOES: {

        ativarParticulas: true,

        ativarBrilhoEspiritual: true,

        ativarVitrine3D: true,

        velocidadeTransicao: 400

    },


    /* ==============================
    SISTEMA DE PRODUTOS
    ============================== */

    PRODUTOS: {

        campoNome: "nome",

        campoPreco: "preco",

        campoPromocao: "promocao",

        campoCategoria: "categoria",

        campoImagem: "imagem",

        campoEstoque: "estoque",

        estoqueMinimo: 1

    },


    /* ==============================
    VITRINE
    ============================== */

    VITRINE: {

        maxProdutos: 12,

        maxDestaques: 6,

        maxRecomendados: 8

    },


    /* ==============================
    BUSCA
    ============================== */

    BUSCA: {

        minimoCaracteres: 2,

        maxResultados: 12

    },


    /* ==============================
    CACHE E PERFORMANCE
    ============================== */

    CACHE: {

        tempoProdutos: 5 * 60 * 1000,

        usarLocalStorage: true

    },


    /* ==============================
    SEO
    ============================== */

    SEO: {

        titulo: "Odòmáiyà Artigos Religiosos",

        descricao: "Artigos religiosos de Umbanda e Candomblé com qualidade e axé.",

        palavras: "umbanda, candomblé, artigos religiosos, velas, guias, ervas, axé"

    },


    /* ==============================
    ADMIN
    ============================== */

    ADMIN: {

        usuario: "adm",

        senha: "99861309",

        ativarPainel: true

    }

};


/* =========================================
UTILITÁRIOS GLOBAIS
========================================= */

function getApiUrl(){
    return CONFIG.API_URL;
}

function getWhatsApp(){
    return CONFIG.WHATSAPP;
}

function getLojaNome(){
    return CONFIG.LOJA.nome;
}
