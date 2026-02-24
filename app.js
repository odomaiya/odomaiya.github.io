let produtos=[];
let carrinho=[];
let etapaAtual=1;

async function carregar(){
 const res=await fetch(CONFIG.planilhaCSV);
 const txt=await res.text();
 const linhas=txt.split("\n").slice(1);

 produtos=linhas.map(l=>{
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

function filtrar(cat){
 if(!cat) return renderProdutos(produtos);
 renderProdutos(produtos.filter(p=>p.categoria===cat));
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
     <p>R$ ${p.preco.toFixed(2)}</p>
     <small>Restam ${p.estoque}</small>
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
 const el=document.getElementById("itensCarrinho");
 const totalEl=document.getElementById("total");
 const contador=document.getElementById("contador");

 let total=0;
 el.innerHTML="";
 carrinho.forEach(i=>{
   total+=i.preco*i.qtd;
   el.innerHTML+=`<div>${i.nome} x${i.qtd}</div>`;
 });

 totalEl.innerText=`R$ ${total.toFixed(2)}`;
 contador.innerText=carrinho.reduce((s,i)=>s+i.qtd,0);
}

function abrirCarrinho(){
 document.getElementById("carrinho").classList.add("ativo");
}

function fecharCarrinho(){
 document.getElementById("carrinho").classList.remove("ativo");
}

function abrirCheckout(){
 if(!carrinho.length) return alert("Carrinho vazio");
 document.getElementById("checkout").classList.add("ativo");
 mostrarEtapa();
}

function fecharCheckout(){
 document.getElementById("checkout").classList.remove("ativo");
}

function mostrarEtapa(){
 document.querySelectorAll(".etapa").forEach(e=>e.classList.remove("ativa"));
 document.getElementById("etapa-"+etapaAtual).classList.add("ativa");
}

function proximaEtapa(){ etapaAtual++; mostrarEtapa(); }
function voltarEtapa(){ etapaAtual--; mostrarEtapa(); }

function tipoEntrega(tipo){
 const div=document.getElementById("campo-endereco");
 if(tipo==="entrega"){
   div.innerHTML=`<input type="text" id="cliente-endereco" placeholder="Endereço completo">`;
 }else{
   div.innerHTML=`<p>📍 ${CONFIG.loja.endereco}</p>`;
 }
}

function finalizarPedido(){
 const nome=document.getElementById("cliente-nome").value;
 const pagamento=document.getElementById("pagamento").value;
 const entrega=document.querySelector('input[name="entrega"]:checked')?.value;
 const endereco=document.getElementById("cliente-endereco")?.value||"";

 if(!nome||!pagamento||!entrega) return alert("Preencha todos os campos");

 let total=0;
 let msg=`✨ Pedido Odòmáiyà ✨\n\n👤 ${nome}\n\n🛍️ Itens:\n`;

 carrinho.forEach(i=>{
   const sub=i.preco*i.qtd;
   total+=sub;
   msg+=`• ${i.nome} x${i.qtd}\nSubtotal: R$ ${sub.toFixed(2)}\n\n`;
 });

 msg+=`💰 Total: R$ ${total.toFixed(2)}\n🚚 ${entrega}\n`;
 if(entrega==="Entrega"){
   msg+=`📍 ${endereco}\n⚠️ Taxa informada via WhatsApp\n`;
 }
 msg+=`💳 ${pagamento}`;

 const url=`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

 document.getElementById("loader").style.display="flex";
 setTimeout(()=>window.open(url,"_blank"),1500);
}

document.addEventListener("DOMContentLoaded",carregar);
