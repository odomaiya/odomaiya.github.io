const API_URL="https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos=[];
let carrinho={};
let etapa=1;

function formatar(v){
 return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

async function carregarProdutos(){
 const res=await fetch(API_URL+"?acao=produtos&t="+Date.now(),{cache:"no-store"});
 const dados=await res.json();

 produtos=dados.sort((a,b)=>{
   if(a.promocao>0&&b.promocao==0)return -1;
   if(a.promocao==0&&b.promocao>0)return 1;
   return a.nome.localeCompare(b.nome);
 });

 criarFiltros();
 renderizar(produtos);
}

function criarFiltros(){
 const area=document.getElementById("filtros");
 const categorias=["Todos",...new Set(produtos.map(p=>p.categoria))];
 area.innerHTML="";
 categorias.forEach(cat=>{
   const btn=document.createElement("button");
   btn.innerText=cat;
   btn.onclick=()=>filtrar(cat);
   area.appendChild(btn);
 });
}

function filtrar(cat){
 if(cat==="Todos")renderizar(produtos);
 else renderizar(produtos.filter(p=>p.categoria===cat));
}

function renderizar(lista){
 const grid=document.getElementById("produtos");
 grid.innerHTML="";
 lista.forEach(p=>{
   const precoFinal=p.promocao>0?p.promocao:p.preco;
   const card=document.createElement("div");
   card.className="produto-card";
   if(p.promocao>0)card.classList.add("promo");

   card.innerHTML=`
   <img src="${p.imagem}">
   <h4>${p.nome}</h4>
   ${p.promocao>0?`<div class="preco-antigo">${formatar(p.preco)}</div>`:""}
   <div class="preco">${formatar(precoFinal)}</div>
   <div class="contador">
     <button onclick="alterar('${p.nome}',-1)">-</button>
     <span>${carrinho[p.nome]||0}</span>
     <button onclick="alterar('${p.nome}',1)">+</button>
   </div>
   `;
   grid.appendChild(card);
 });
 atualizarContador();
}

function alterar(nome,valor){
 if(!carrinho[nome])carrinho[nome]=0;
 carrinho[nome]+=valor;
 if(carrinho[nome]<0)carrinho[nome]=0;
 renderizar(produtos);
}

function atualizarContador(){
 document.getElementById("contadorCarrinho").innerText=
 Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
 atualizarCarrinho();
 document.getElementById("modalCarrinho").style.display="flex";
}

function fecharCarrinho(){
 document.getElementById("modalCarrinho").style.display="none";
}

function atualizarCarrinho(){
 const div=document.getElementById("itensCarrinho");
 div.innerHTML="";
 let total=0;

 Object.keys(carrinho).forEach(nome=>{
   if(carrinho[nome]>0){
     const p=produtos.find(x=>x.nome===nome);
     const preco=p.promocao>0?p.promocao:p.preco;
     total+=preco*carrinho[nome];
     div.innerHTML+=`<p>${nome} x${carrinho[nome]} - ${formatar(preco*carrinho[nome])}</p>`;
   }
 });

 document.getElementById("valorTotal").innerText=formatar(total);
}

function abrirCheckout(){
 etapa=1;
 mostrarEtapa();
 document.getElementById("modalCheckout").style.display="flex";
}

function mostrarEtapa(){
 const div=document.getElementById("conteudoCheckout");

 if(etapa===1){
   div.innerHTML=`
   <h3>Seus Dados</h3>
   <input id="nome" placeholder="Nome completo">
   <input id="cep" placeholder="CEP" onblur="buscarCEP()">
   <input id="rua" placeholder="Rua">
   <input id="numero" placeholder="Número">
   <input id="cidade" placeholder="Cidade">
   <button class="btn-primario" onclick="etapa=2;mostrarEtapa()">Continuar</button>
   `;
 }

 if(etapa===2){
   div.innerHTML=`
   <h3>Pagamento</h3>
   <select id="pagamento">
     <option>Cartão</option>
     <option>Pix</option>
     <option>Dinheiro</option>
   </select>
   <button class="btn-primario" onclick="finalizarPedido()">Finalizar</button>
   `;
 }
}

async function buscarCEP(cep){
  const limpa = cep.replace(/\D/g,'');
  const res = await fetch(`https://viacep.com.br/ws/${limpa}/json/`);
  return await res.json();
}

async function finalizarPedido(){
  const nome = document.getElementById("nome").value;
  const cep = document.getElementById("cep").value;
  const numero = document.getElementById("numero").value;
  const pagamento = document.getElementById("pagamento").value;

  const dadosCEP = await buscarCEP(cep);

  const enderecoCompleto = `${dadosCEP.logradouro}, ${numero} - ${dadosCEP.bairro}, ${dadosCEP.localidade} - ${dadosCEP.uf}`;

  let mensagem = `✨ *Novo Pedido Odòmàiyá* ✨\n\n`;
  mensagem += `👤 Cliente: ${nome}\n`;
  mensagem += `📦 Entrega: ${enderecoCompleto}\n`;
  mensagem += `💳 Pagamento: ${pagamento}\n\n`;
  mensagem += `🛍️ Itens:\n`;

  let total = 0;

  Object.keys(carrinho).forEach(nomeProduto=>{
    const item = carrinho[nomeProduto];
    mensagem += `• ${nomeProduto} (${item.qtd}x) - R$ ${(item.preco * item.qtd).toFixed(2).replace('.',',')}\n`;
    total += item.preco * item.qtd;
  });

  mensagem += `\n💰 Total: R$ ${total.toFixed(2).replace('.',',')}`;

  const url = `https://wa.me/555496048808?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}
