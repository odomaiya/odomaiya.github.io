/* =========================================
CARRINHO DA LOJA
Odòmáiyà Artigos Religiosos
========================================= */

let cart = JSON.parse(localStorage.getItem("cart")) || []

/* =========================================
SALVAR CARRINHO
========================================= */

function salvarCart(){

 localStorage.setItem("cart", JSON.stringify(cart))

 atualizarCarrinho()

}


/* =========================================
ADICIONAR PRODUTO
========================================= */

function addCart(prod){

 const id = prod.id || prod.nome.replace(/\s+/g,"-").toLowerCase()

 let item = cart.find(i => i.id === id)

 if(item){

  item.qtd++

 }else{

  cart.push({
   ...prod,
   id:id,
   qtd:1
  })

 }

 atualizarRanking(id)

 salvarCart()

}


/* =========================================
REMOVER ITEM
========================================= */

function removerCart(id){

 cart = cart.filter(i => i.id !== id)

 salvarCart()

}


/* =========================================
TOTAL DO CARRINHO
========================================= */

function totalCart(){

 let total = 0

 cart.forEach(i=>{
  total += (Number(i.preco) || 0) * i.qtd
 })

 return total

}


/* =========================================
RENDER CARRINHO
========================================= */

function renderCart(){

 const area = document.getElementById("itensCarrinho")

 if(!area) return

 area.innerHTML = ""

 cart.forEach(i=>{

  area.innerHTML += `

  <div class="cart-item">

    <img src="${i.imagem}" class="cart-img">

    <div class="cart-info">

      <div class="cart-nome">${i.nome}</div>

      <div class="cart-qtd">
        ${i.qtd}x
      </div>

      <div class="cart-preco">
        R$ ${(i.preco * i.qtd).toFixed(2)}
      </div>

    </div>

    <button onclick="removerCart('${i.id}')">
    ✕
    </button>

  </div>

  `

 })

}


/* =========================================
ATUALIZAR CARRINHO
========================================= */

function atualizarCarrinho(){

 renderCart()

 const total = document.getElementById("totalCarrinho")
 if(total){
  total.innerText = "Total: R$ " + totalCart().toFixed(2)
 }

 const contador = document.getElementById("contadorCarrinho")

 if(contador){
  let qtd = 0
  cart.forEach(i=> qtd += i.qtd)
  contador.innerText = qtd
 }

}


/* =========================================
ABRIR CARRINHO
========================================= */

function abrirCarrinho(){

 const carrinho = document.getElementById("carrinhoLateral")

 if(carrinho){
  carrinho.style.right = "0"
 }

}


/* =========================================
FECHAR CARRINHO
========================================= */

function fecharCarrinho(){

 const carrinho = document.getElementById("carrinhoLateral")

 if(carrinho){
  carrinho.style.right = "-420px"
 }

}


/* =========================================
BOTÃO DO CARRINHO
========================================= */

document.addEventListener("DOMContentLoaded",()=>{

 const btn = document.getElementById("btnCarrinho")

 if(btn){
  btn.addEventListener("click", abrirCarrinho)
 }

 atualizarCarrinho()

})


/* =========================================
RANKING DE MAIS VENDIDOS
========================================= */

function atualizarRanking(id){

 let ranking = JSON.parse(localStorage.getItem("ranking")) || {}

 ranking[id] = (ranking[id] || 0) + 1

 localStorage.setItem("ranking", JSON.stringify(ranking))

}
