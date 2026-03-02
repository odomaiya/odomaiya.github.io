window.UI = {

carrinho:{},

toggleCarrinho(){
document.getElementById("drawer").classList.toggle("ativo")
},

renderProdutos(lista){
const grid=document.getElementById("produtos")

grid.innerHTML=lista.map(p=>{

let classe="card"
if(p.promocao>0) classe+=" promocao"
if(p.estoque<=5) classe+=" baixo"

return `
<div class="${classe}">
${p.promocao>0?'<div class="ribbon">PROMOÇÃO</div>':''}
<h3>${p.nome}</h3>
<div class="preco">R$ ${(p.promocao>0?p.promocao:p.preco).toFixed(2)}</div>
<div>Estoque: ${p.estoque}</div>
<div class="qtd-box">
<button onclick="UI.diminuir('${p.nome}')">-</button>
<span>${this.carrinho[p.nome]||0}</span>
<button onclick="UI.aumentar('${p.nome}')">+</button>
</div>
</div>`
}).join("")
},

aumentar(nome){
this.carrinho[nome]=(this.carrinho[nome]||0)+1
this.atualizar()
},

diminuir(nome){
if(this.carrinho[nome]>0)this.carrinho[nome]--
this.atualizar()
},

atualizar(){
document.getElementById("contadorCarrinho").innerText=
Object.values(this.carrinho).reduce((a,b)=>a+b,0)
this.renderCarrinho()
},

renderCarrinho(){
const box=document.getElementById("carrinho-itens")
let total=0

box.innerHTML=Object.keys(this.carrinho).map(n=>{
if(this.carrinho[n]>0){
const p=ESTOQUE.lista.find(x=>x.nome===n)
const preco=p.promocao>0?p.promocao:p.preco
total+=preco*this.carrinho[n]
return `<div>${n} — R$ ${preco.toFixed(2)} x${this.carrinho[n]}</div>`
}
return ""
}).join("")

document.getElementById("carrinho-total").innerText="R$ "+total.toFixed(2)
}

}
