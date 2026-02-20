const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv";

let produtos = [];
let carrinho = [];

fetch(csvUrl)
.then(res=>res.text())
.then(text=>{
const linhas=text.split("\n").slice(1);

produtos=linhas.map(l=>{
const c=l.split(";");
return{
nome:c[0],
preco:parseFloat(c[1].replace(",",".")),
categoria:c[2],
estoque:parseInt(c[3]),
imagem:c[4]
};
});

renderizar(produtos);
});

function renderizar(lista){
const area=document.getElementById("produtos");
area.innerHTML="";
lista.forEach(p=>{
area.innerHTML+=`
<div class="card">
<img src="${p.imagem}" loading="lazy">
<h4>${p.nome}</h4>
<p>Restam ${p.estoque} unidades</p>
<p>R$ ${p.preco.toFixed(2)}</p>
<button onclick="adicionar('${p.nome}')">Adicionar</button>
</div>
`;
});
}

function adicionar(nome){
const prod=produtos.find(p=>p.nome===nome);
let item=carrinho.find(i=>i.nome===nome);
if(item){item.qtd++}else{
carrinho.push({nome:prod.nome,preco:prod.preco,qtd:1});
}
atualizar();
}

function atualizar(){
let total=0;
const area=document.getElementById("itensCarrinho");
area.innerHTML="";
carrinho.forEach(i=>{
const sub=i.qtd*i.preco;
total+=sub;
area.innerHTML+=`
<p>${i.nome} (${i.qtd}) - R$ ${sub.toFixed(2)}
<button onclick="remover('${i.nome}')">❌</button></p>
`;
});
document.getElementById("total").innerText="Total: R$ "+total.toFixed(2);
document.getElementById("contador").innerText=carrinho.reduce((a,b)=>a+b.qtd,0);
}

function remover(nome){
carrinho=carrinho.filter(i=>i.nome!==nome);
atualizar();
}

function abrirCarrinho(){
document.getElementById("carrinho").style.display="block";
}

function finalizarPedido(){
let nome=document.getElementById("clienteNome").value;
let entrega=document.getElementById("tipoEntrega").value;
let endereco=document.getElementById("endereco").value;
let pagamento=document.getElementById("pagamento").value;

let msg=`✨ Pedido Odòmáiyà ✨%0A`;
msg+=`👤 Nome: ${nome}%0A`;
msg+=`🚚 Entrega: ${entrega}%0A`;
if(entrega==="Entrega"){msg+=`📍 Endereço: ${endereco}%0A`;}
msg+=`💳 Pagamento: ${pagamento}%0A%0A🛍️ Itens:%0A`;

carrinho.forEach(i=>{
msg+=`• ${i.nome} (${i.qtd})%0A`;
});

window.open(`https://wa.me/5554996048808?text=${msg}`);
}
