let produtos = [];
let carrinho = [];

async function carregarProdutos(){
const res = await fetch(API_URL+"?acao=produtos");
produtos = await res.json();

produtos.sort((a,b)=>{
if(a.promocao && !b.promocao) return -1;
if(!a.promocao && b.promocao) return 1;
return 0;
});

renderizarProdutos(produtos);
}

function renderizarProdutos(lista){
const div = document.getElementById("produtos");
div.innerHTML="";

lista.forEach(p=>{
const precoFinal = p.promocao && p.promocao!="" ? p.promocao : p.preco;

div.innerHTML+=`
<div class="card">
<img src="${p.imagem}">
<h3>${p.nome}</h3>
${p.promocao?`<div class="preco"><s>R$ ${p.preco}</s></div><div class="promocao">R$ ${p.promocao}</div>`:`<div class="preco">R$ ${p.preco}</div>`}
<button onclick='adicionarCarrinho(${JSON.stringify(p)})'>+</button>
</div>
`;
});
}

function adicionarCarrinho(prod){
let item = carrinho.find(i=>i.nome===prod.nome);
if(item){
item.qtd++;
}else{
carrinho.push({...prod,qtd:1});
}
atualizarCarrinho();
}

function atualizarCarrinho(){
const div = document.getElementById("cartItems");
div.innerHTML="";
let total=0;

carrinho.forEach(i=>{
const preco = i.promocao && i.promocao!="" ? parseFloat(i.promocao) : parseFloat(i.preco);
total+=preco*i.qtd;

div.innerHTML+=`
<div class="cart-item">
<span>${i.nome} x${i.qtd}</span>
<span>R$ ${(preco*i.qtd).toFixed(2)}</span>
</div>
`;
});

document.getElementById("cartTotal").innerText="Total: R$ "+total.toFixed(2);
document.getElementById("cartCount").innerText=carrinho.length;
}

function abrirCarrinho(){
document.getElementById("cartPanel").classList.add("active");
}

function fecharCarrinho(){
document.getElementById("cartPanel").classList.remove("active");
}

function mostrarEndereco(){
const tipo=document.getElementById("tipoEntrega").value;
document.getElementById("enderecoCliente").style.display= tipo==="Entrega"?"block":"none";
}

function finalizarPedido(){
if(carrinho.length===0)return alert("Carrinho vazio");

const nome=document.getElementById("nomeCliente").value;
const entrega=document.getElementById("tipoEntrega").value;
const endereco=document.getElementById("enderecoCliente").value;
const pagamento=document.getElementById("pagamento").value;

let msg=`🛍️ *Pedido - ${NOME_LOJA}*\n\n👤 Nome: ${nome}\n🚚 Tipo: ${entrega}\n`;
if(entrega==="Entrega") msg+=`📍 Endereço: ${endereco}\n`;
msg+=`💳 Pagamento: ${pagamento}\n\n📦 *Itens:*\n`;

let total=0;

carrinho.forEach(i=>{
const preco = i.promocao && i.promocao!="" ? parseFloat(i.promocao) : parseFloat(i.preco);
total+=preco*i.qtd;
msg+=`• ${i.nome} x${i.qtd} = R$ ${(preco*i.qtd).toFixed(2)}\n`;
});

msg+=`\n💰 Total: R$ ${total.toFixed(2)}\n\n✨ Obrigado pela preferência!`;

window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`,"_blank");
}

carregarProdutos();
