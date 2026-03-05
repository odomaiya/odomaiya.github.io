let cart=JSON.parse(localStorage.getItem("cart"))||[]

function salvarCart(){

localStorage.setItem("cart",JSON.stringify(cart))

renderCart()

}

function addCart(prod){

let item=cart.find(i=>i.id==prod.id)

if(item){

if(item.qtd+1>verificarEstoque(prod.id)) return

item.qtd++

}else{

cart.push({...prod,qtd:1})

}

salvarCart()

}

function remover(id){

cart=cart.filter(i=>i.id!=id)

salvarCart()

}

function totalCart(){

let t=0

cart.forEach(i=>{

t+=i.preco*i.qtd

})

return t

}

function renderCart(){

const list=document.getElementById("cart-items")

if(!list) return

list.innerHTML=""

cart.forEach(i=>{

list.innerHTML+=`
<div class="cart-item">
${i.nome} x${i.qtd}
<span>R$ ${(i.preco*i.qtd).toFixed(2)}</span>
</div>
`

})

document.getElementById("cart-total").innerText=totalCart().toFixed(2)

document.getElementById("cart-count").innerText=cart.length

}

let ranking=JSON.parse(localStorage.getItem("ranking"))||{}

ranking[prod.id]=(ranking[prod.id]||0)+1

localStorage.setItem("ranking",JSON.stringify(ranking))
