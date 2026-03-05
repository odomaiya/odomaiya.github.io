let produtos=[]

async function iniciar(){

produtos=await fetchProdutos()

atualizarEstoque(produtos)

renderProdutos(produtos)

renderRecomendados(produtos)

renderCart()

carregarBanner()

criarParticulas()

vitrineAnimada()

}

function abrirCarrinho(){

document.getElementById("cart-panel").classList.toggle("open")

}


function irCheckout(){

localStorage.setItem("checkout",JSON.stringify(cart))

window.location="admin.html"

}
async function iniciar(){

 const produtos=await carregarProdutos();

 renderBanner(produtos);
 renderVitrine(produtos);
 renderDestaques(produtos);
 renderPromocoes(produtos);
 renderProdutos(produtos);

}

document.addEventListener("DOMContentLoaded",iniciar);
