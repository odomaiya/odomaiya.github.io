const UI = {

produtos:[],
carrinho:[],

init(){
this.carregar();
document.getElementById("busca").addEventListener("input",(e)=>{
this.render(this.produtos.filter(p=>
p.nome.toLowerCase().includes(e.target.value.toLowerCase())
));
});
document.getElementById("abrirCarrinho").onclick=()=>{
document.getElementById("drawer").classList.toggle("ativo");
};
document.getElementById("btn-finalizar").onclick=()=>this.finalizar();
},

async carregar(){
this.produtos=await API.getProdutos();
this.render(this.produtos);
},

render(lista){
const grid=document.getElementById("produtos");
grid.innerHTML=lista.map(p=>{

let classes="card";
if(p.promocao) classes+=" promocao";
if(p.estoque<=3) classes+=" baixo-estoque";

return `
<div class="${classes}">
${p.promocao?'<div class="ribbon">PROMOÇÃO</div>':''}
<img src="${p.imagem}">
<h3>${p.nome}</h3>
<div class="preco">R$ ${p.promocao || p.preco}</div>
${p.estoque<=3?'<div class="estoque-alerta">⚠ Poucas unidades</div>':''}
<button onclick="UI.add('${p.nome}')">Adicionar</button>
</div>
`;
}).join("");
},

add(nome){
const item=this.carrinho.find(i=>i.nome===nome);
if(item) item.qtd++;
else this.carrinho.push({nome,qtd:1});
this.renderCarrinho();
},

renderCarrinho(){
const box=document.getElementById("carrinho-itens");
const totalBox=document.getElementById("carrinho-total");
const contador=document.getElementById("contadorCarrinho");

if(!this.carrinho.length){
box.innerHTML="Carrinho vazio";
totalBox.innerText="R$ 0,00";
contador.innerText="0";
return;
}

let total=0;

box.innerHTML=this.carrinho.map(i=>{
const p=this.produtos.find(x=>x.nome===i.nome);
const preco=p.promocao || p.preco;
total+=preco*i.qtd;
return `<div>${i.nome} - ${i.qtd}x</div>`;
}).join("");

totalBox.innerText="R$ "+total.toFixed(2);
contador.innerText=this.carrinho.length;
},

async finalizar(){
if(!this.carrinho.length) return alert("Carrinho vazio");

const payload={
action:"registrarVenda",
cliente:document.getElementById("cliente").value,
entrega:document.getElementById("entrega").value,
pagamento:document.getElementById("pagamento").value,
itens:JSON.stringify(this.carrinho),
total:document.getElementById("carrinho-total").innerText
};

await API.registrarVenda(payload);
alert("Pedido enviado!");
this.carrinho=[];
this.renderCarrinho();
this.carregar();
}

};

window.UI=UI;
