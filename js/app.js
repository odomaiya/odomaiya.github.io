let listaProdutos=[];

async function iniciar(){

 listaProdutos=await buscarProdutos();

 window.listaProdutos=listaProdutos;

 criarIndice(listaProdutos);

 ativarBusca();

 ativarAdmin();

 renderBanner(listaProdutos);

 renderVitrine(listaProdutos);

 renderDestaques(listaProdutos);

 renderPromocoes(listaProdutos);

 renderMaisVendidos(listaProdutos);

 renderRecomendados(listaProdutos);

 renderCatalogo(listaProdutos);

}

document.addEventListener("DOMContentLoaded",iniciar);
