const CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv";
const WHATS = "555496048808";

let produtos = [];
let carrinho = [];
let etapa = 1;

async function carregarProdutos(){
 const res = await fetch(CSV);
 const texto = await res.text();
 const linhas = texto.split("\n").slice(1);

 produtos = linhas.map(l=>{
   const [nome,preco,categoria,imagem,estoque]=l.split(",");
   return {nome,preco:parseFloat(preco),categoria,imagem,estoque:parseInt(estoque)};
 }).filter(p=>p.nome);

 renderCategorias();
 renderProdutos(produtos);
}

function renderCategorias(){
 const cats=[...new Set(produtos.map(p=>p.categoria))];
 const el=document.getElementById("categorias");
 el.innerHTML=`<button onclick="filtrar('')">Todos</button>`;
 cats.forEach(c=>{
   el.innerHTML+=`<button onclick="filtrar('${c}')">${c}</button>`;
 });
}

function filtrar(c){
 if(!c) return renderProdutos(produtos);
 renderProdutos(produtos.filter(p=>p.categoria===c));
}

function renderProdutos(lista){
 const el=document.getElementById("produtos");
 el.innerHTML="";
 lista.forEach(p=>{
   const qtd=carrinho.find(i=>i.nome===p.nome)?.qtd||0;
   el.innerHTML+=`
   <div class="card">
    <img src="${p.imagem}">
    <h3>${p.nome}</h3>
    <div class="preco">R$ ${p.preco.toFixed(2)}</div>
    <div class="estoque">Restam ${p.estoque}</div>
    <div class="controle">
      <button onclick="alterar('${p.nome}',-1)">-</button>
      <span>${qtd}</span>
      <button onclick="alterar('${p.nome}',1)">+</button>
    </div>
   </div>`;
 });
}

function alterar(nome,delta){
 const prod=produtos.find(p=>p.nome===nome);
 let item=carrinho.find(i=>i.nome===nome);
 if(!item && delta>0){
   carrinho.push({...prod,qtd:1});
 }else if(item){
   item.qtd+=delta;
   if(item.qtd<=0) carrinho=carrinho.filter(i=>i.nome!==nome);
 }
 atualizarCarrinho();
 renderProdutos(produtos);
}

function atualizarCarrinho(){
 const el=document.getElementById("listaCarrinho");
 const totalEl=document.getElementById("total");
 const contador=document.getElementById("contador");
 if(!el) return;
 el.innerHTML="";
 let total=0;
 carrinho.forEach(i=>{
   total+=i.preco*i.qtd;
   el.innerHTML+=`<div>${i.nome} x${i.qtd}</div>`;
 });
 totalEl.innerText=`R$ ${total.toFixed(2)}`;
 contador.innerText=carrinho.reduce((s,i)=>s+i.qtd,0);
}

function abrirCheckout(){
 if(carrinho.length===0) return alert("Carrinho vazio");
 document.getElementById("checkout").classList.add("ativo");
 etapa=1; mostrarEtapa();
}

function mostrarEtapa(){
 document.querySelectorAll(".etapa").forEach(e=>e.style.display="none");
 document.getElementById("etapa-"+etapa).style.display="block";
}

function proximaEtapa(){ etapa++; mostrarEtapa(); }
function etapaAnterior(){ etapa--; mostrarEtapa(); }

function tipoEntrega(v){
 document.getElementById("campo-endereco").style.display=v==="entrega"?"block":"none";
 document.getElementById("aviso-retirada").style.display=v==="retirada"?"block":"none";
}

function finalizarPedido(){
 const nome=document.getElementById("cliente-nome").value;
 const entrega=document.querySelector('input[name="entrega"]:checked')?.value;
 const endereco=document.getElementById("cliente-endereco").value;
 const pagamento=document.getElementById("pagamento").value;

 if(!nome||!entrega||!pagamento) return alert("Preencha tudo");

 let msg=`✨ Pedido Odòmáiyà ✨\n\n👤 ${nome}\n\n🛍️ Itens:\n`;
 let total=0;

 carrinho.forEach(i=>{
   const sub=i.preco*i.qtd;
   total+=sub;
   msg+=`• ${i.nome} x${i.qtd}\nSubtotal: R$ ${sub.toFixed(2)}\n\n`;
 });

 msg+=`💰 Total: R$ ${total.toFixed(2)}\n🚚 ${entrega}\n`;
 if(entrega==="Entrega") msg+=`📍 ${endereco}\n⚠️ Taxa será informada\n`;
 msg+=`💳 ${pagamento}`;

 const url=`https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;

 document.getElementById("loader").style.display="flex";
 setTimeout(()=>{ window.open(url,"_blank"); },1500);
}

document.addEventListener("DOMContentLoaded",carregarProdutos);
