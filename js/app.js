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
