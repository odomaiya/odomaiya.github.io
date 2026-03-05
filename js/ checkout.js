let etapa=1;

function abrirCarrinho(){

document.getElementById("carrinho").classList.add("ativo");
document.getElementById("overlay").classList.add("ativo");

atualizarCarrinho();

}

function fecharCarrinho(){

document.getElementById("carrinho").classList.remove("ativo");
document.getElementById("overlay").classList.remove("ativo");

}

function abrirCheckout(){

fecharCarrinho();

document.getElementById("modal").style.display="flex";

}

function proxima(n){

document.getElementById("etapa"+etapa).style.display="none";

etapa=n;

document.getElementById("etapa"+etapa).style.display="block";

}

async function buscarCEP(){

const cep = document.getElementById("cep").value.replace(/\D/g,"");

if(cep.length!==8) return;

const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

const d = await r.json();

if(d.erro) return;

document.getElementById("rua").value=d.logradouro;
document.getElementById("bairro").value=d.bairro;
document.getElementById("cidade").value=d.localidade;
document.getElementById("estado").value=d.uf;

}

async function finalizarPedido(){

let total=0;

let mensagem="✨ *Novo Pedido Odòmáiyà* ✨\n\n";

const nome = cliente.value;
const telefone = telefoneCliente.value;
const tipo = tipoEntrega.value;
const pagamento = pagamentoTipo.value;

mensagem+="👤 Cliente: "+nome+"\n";
mensagem+="📦 Tipo: "+tipo+"\n";
mensagem+="💳 Pagamento: "+pagamento+"\n\n";

if(tipo==="entrega"){

mensagem+=`📍 Endereço:
${rua.value}, ${numero.value}
${bairro.value}
${cidade.value} - ${estado.value}
CEP: ${cep.value}\n\n`;

}

mensagem+="🛍️ Itens:\n";

Object.keys(carrinho).forEach(n=>{

const p = produtos.find(x=>x.nome===n);

const preco = p.promocao>0?p.promocao:p.preco;

total+=preco*carrinho[n];

mensagem+=`• ${n} x${carrinho[n]} — ${money(preco)}\n`;

});

mensagem+=`\n💰 Total: ${money(total)}`;

await fetch(CONFIG.API_URL,{
method:"POST",
body:JSON.stringify({
acao:"pedido",
cliente:nome,
telefone:telefone,
tipo:tipo,
pagamento:pagamento,
itens:carrinho,
total:total
})
});

window.open(
"https://wa.me/"+CONFIG.WHATSAPP+
"?text="+encodeURIComponent(mensagem)
);

localStorage.removeItem("carrinho");

location.reload();

}
