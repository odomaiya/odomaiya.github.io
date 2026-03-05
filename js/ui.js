function renderProdutos(lista){

const grid=document.getElementById("produtos")

grid.innerHTML=""

lista.forEach(p=>{

let estoque=verificarEstoque(p.id)

grid.innerHTML+=`

<div class="card">

<img src="${p.imagem}">

<div class="title">${p.nome}</div>

<div class="price">
R$ ${parseFloat(p.preco).toFixed(2)}
</div>

<div class="stock">
${estoque>0?estoque+" disponíveis":"Esgotado"}
</div>

<button class="btn"
${estoque==0?"disabled":""}
onclick='addCart(${JSON.stringify(p)})'>

Adicionar ao Carrinho

</button>

</div>

`

})

gsap.from(".card",{opacity:0,y:30,stagger:.05})

}


function renderRecomendados(lista){

const rec=gerarRecomendacoes(lista)

const area=document.getElementById("recomendados")

area.innerHTML=""

rec.forEach(p=>{

area.innerHTML+=`

<div class="card">

<img src="${p.imagem}">
<div class="title">${p.nome}</div>
<div class="price">R$ ${p.preco}</div>

<button class="btn"
onclick='addCart(${JSON.stringify(p)})'>

Adicionar

</button>

</div>

`

})

}
