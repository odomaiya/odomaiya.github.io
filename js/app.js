let listaProdutos = []

async function iniciar(){

 try{

  listaProdutos = await carregarProdutos()

  window.listaProdutos = listaProdutos

  if(typeof criarIndice === "function"){
   criarIndice(listaProdutos)
  }

  if(typeof ativarBusca === "function"){
   ativarBusca()
  }

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

  if(typeof iniciarVitrine3D === "function"){
   iniciarVitrine3D(listaProdutos)
  }

  if(typeof gerarSugestoes === "function"){
   gerarSugestoes(listaProdutos)
  }

  if(typeof animarCards === "function"){
   animarCards()
  }

 }catch(e){

  console.error("Erro ao iniciar loja:",e)

 }

}

document.addEventListener("DOMContentLoaded", iniciar)
