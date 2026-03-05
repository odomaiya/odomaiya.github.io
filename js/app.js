let produtos=[]

async function iniciar(){

produtos=await fetchProdutos()

atualizarEstoque(produtos)

renderProdutos(produtos)

renderRecomendados(produtos)

renderCart()

}

iniciar()


document.getElementById("busca").addEventListener("input",e=>{

let termo=e.target.value.toLowerCase()

let filtrado=produtos.filter(p=>p.nome.toLowerCase().includes(termo))

renderProdutos(filtrado)

})


function abrirCarrinho(){

document.getElementById("cart-panel").classList.toggle("open")

}


function irCheckout(){

localStorage.setItem("checkout",JSON.stringify(cart))

window.location="admin.html"

}
