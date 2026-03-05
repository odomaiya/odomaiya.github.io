/* =========================================
APP PRINCIPAL DA LOJA
Odòmáiyà Artigos Religiosos
Inicialização geral do sistema
========================================= */

let listaProdutos = [];


/* =========================================
INICIAR LOJA
========================================= */

async function iniciar() {

    try {

        /* carregar produtos da API */
        listaProdutos = await carregarProdutos();

        /* salvar global */
        window.listaProdutos = listaProdutos;


        /* =============================
        SISTEMAS BASE
        ============================= */

        if (typeof criarIndice === "function") {
            criarIndice(listaProdutos);
        }

        if (typeof ativarBusca === "function") {
            ativarBusca();
        }

        if (typeof ativarAdmin === "function") {
            ativarAdmin();
        }


        /* =============================
        HOME
        ============================= */

        if (typeof renderBanner === "function") {
            renderBanner(listaProdutos);
        }

        if (typeof renderVitrine === "function") {
            renderVitrine(listaProdutos);
        }

        if (typeof renderDestaques === "function") {
            renderDestaques(listaProdutos);
        }

        if (typeof renderPromocoes === "function") {
            renderPromocoes(listaProdutos);
        }

        if (typeof renderMaisVendidos === "function") {
            renderMaisVendidos(listaProdutos);
        }

        if (typeof renderRecomendados === "function") {
            renderRecomendados(listaProdutos);
        }

        if (typeof renderCatalogo === "function") {
            renderCatalogo(listaProdutos);
        }


        /* =============================
        EXPERIÊNCIA AVANÇADA
        ============================= */

        if (typeof iniciarVitrine3D === "function") {
            iniciarVitrine3D(listaProdutos);
        }

        if (typeof gerarSugestoes === "function") {
            gerarSugestoes(listaProdutos);
        }

        if (typeof iniciarRanking === "function") {
            iniciarRanking(listaProdutos);
        }


        /* =============================
        ANIMAÇÕES
        ============================= */

        if (CONFIG.ANIMACOES.ativarParticulas) {

            if (typeof iniciarParticulas === "function") {
                iniciarParticulas();
            }

        }

    } catch (erro) {

        console.error("Erro ao iniciar loja:", erro);

    }

}



/* =========================================
DOM PRONTO
========================================= */

document.addEventListener("DOMContentLoaded", iniciar);
