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

  const produtos = await carregarProdutos();

  window.PRODUTOS = produtos;

  renderBanner(produtos);
  renderVitrine(produtos);

}

document.addEventListener("DOMContentLoaded", iniciar);

  /* =============================
  CARREGAR PRODUTOS DA API
  ============================= */

  if(typeof buscarProdutos !== "function"){
   console.error("API não carregada")
   return
  }

  listaProdutos = await buscarProdutos()

  window.listaProdutos = listaProdutos


  /* =============================
  SISTEMAS BASE
  ============================= */

  if(typeof criarIndice === "function"){
   criarIndice(listaProdutos)
  }

  if(typeof ativarBusca === "function"){
   ativarBusca()
  }

  if(typeof ativarAdmin === "function"){
   ativarAdmin()
  }


  /* =============================
  HOME
  ============================= */

  if(typeof renderBanner === "function"){
   renderBanner(listaProdutos)
  }

  if(typeof renderVitrine === "function"){
   renderVitrine(listaProdutos)
  }

  if(typeof renderDestaques === "function"){
   renderDestaques(listaProdutos)
  }

  if(typeof renderPromocoes === "function"){
   renderPromocoes(listaProdutos)
  }

  if(typeof renderMaisVendidos === "function"){
   renderMaisVendidos(listaProdutos)
  }

  if(typeof renderRecomendados === "function"){
   renderRecomendados(listaProdutos)
  }

  if(typeof renderCatalogo === "function"){
   renderCatalogo(listaProdutos)
  }


  /* =============================
  EXPERIÊNCIA AVANÇADA
  ============================= */

  if(typeof iniciarVitrine3D === "function"){
   iniciarVitrine3D(listaProdutos)
  }

  if(typeof gerarSugestoes === "function"){
   gerarSugestoes(listaProdutos)
  }


  /* =============================
  ANIMAÇÕES
  ============================= */

  if(typeof animarCards === "function"){
   animarCards()
  }

 }catch(e){

  console.error("Erro ao iniciar loja:", e)

 }

}


/* =========================================
DOM PRONTO
========================================= */

document.addEventListener("DOMContentLoaded", iniciar)
