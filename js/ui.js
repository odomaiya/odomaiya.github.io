window.UI = {

carrinho:{},

toggleCarrinho(){
document.getElementById("drawer").classList.toggle("ativo")
},

renderProdutos(lista){
  const grid = document.querySelector("#produtos");

  if(!lista.length){
    grid.innerHTML = `<div style="padding:40px;text-align:center;font-weight:600;">Nenhum produto encontrado</div>`;
    return;
  }

  grid.innerHTML = lista.map(p=>`
    <div class="card">
      <img src="${p.imagem}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <div class="preco">R$ ${p.preco.toFixed(2)}</div>
      <div class="status">${p.estoque>0?'Disponível':'Sem estoque'}</div>
      <button ${p.estoque<=0?'disabled':''}
        onclick="UI.addCarrinho('${p.nome}')">
        Adicionar
      </button>
    </div>
  `).join('');
}
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
document.getElementById("abrir-carrinho")
  .addEventListener("click",()=> {
    document.getElementById("carrinho").classList.add("ativo");
  });

document.getElementById("fechar-carrinho")
  .addEventListener("click",()=> {
    document.getElementById("carrinho").classList.remove("ativo");
  });
