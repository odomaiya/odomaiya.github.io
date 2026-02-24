const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};
let categoriaAtual = "Todos";

async function carregarProdutos(){
  const res = await fetch(API_URL+"?acao=produtos");
  produtos = await res.json();

  produtos.sort((a,b)=>{
    const promoA = a.promocao && a.promocao > 0 ? 1 : 0;
    const promoB = b.promocao && b.promocao > 0 ? 1 : 0;
    return promoB - promoA;
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
  categoriaAtual=cat;
  if(cat==="Todos") renderizar(produtos);
  else renderizar(produtos.filter(p=>p.categoria===cat));
}

function renderizar(lista){
  const grid=document.getElementById("produtos");
  grid.innerHTML="";

  lista.forEach(p=>{
    const precoFinal=p.promocao&&p.promocao>0?p.promocao:p.preco;
    const temPromo=p.promocao&&p.promocao>0;

    const card=document.createElement("div");
    card.className="produto-card";

    card.innerHTML=`
      ${temPromo?`<div class="badge">PROMOÇÃO</div>`:""}
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      ${temPromo?
      `<div><span class="antigo">R$ ${p.preco}</span> 
       <span class="promo">R$ ${p.promocao}</span></div>`:
      `<div>R$ ${p.preco}</div>`}
      <small>Estoque: ${p.estoque}</small>
      <div class="contador">
        <button onclick="alterar('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome]||0}</span>
        <button onclick="alterar('${p.nome}',1)">+</button>
      </div>
    `;

    grid.appendChild(card);
  });

  atualizarCarrinho();
}

function alterar(nome,valor){
  const produto=produtos.find(p=>p.nome===nome);
  if(!carrinho[nome]) carrinho[nome]=0;
  if(valor>0 && carrinho[nome]>=produto.estoque) return;
  carrinho[nome]+=valor;
  if(carrinho[nome]<0) carrinho[nome]=0;
  filtrar(categoriaAtual);
}

function atualizarCarrinho(){
  const area=document.getElementById("itensCarrinho");
  area.innerHTML="";
  let total=0;
  let contador=0;

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const p=produtos.find(x=>x.nome===nome);
      const preco=p.promocao&&p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[nome];
      contador+=carrinho[nome];

      area.innerHTML+=`
      <div>
        <strong>${nome}</strong><br>
        Qtd: ${carrinho[nome]}<br>
        R$ ${(preco*carrinho[nome]).toFixed(2)}
        <hr>
      </div>`;
    }
  });

  document.getElementById("valorTotal").innerText="R$ "+total.toFixed(2);
  document.getElementById("contadorCarrinho").innerText=contador;
}

function abrirCarrinho(){
  document.getElementById("drawerCarrinho").style.display="flex";
}

function fecharCarrinho(){
  document.getElementById("drawerCarrinho").style.display="none";
}

function abrirCheckout(){
  fecharCarrinho();

  const modal=document.getElementById("modalCheckout");
  const conteudo=document.getElementById("checkoutConteudo");

  conteudo.innerHTML=`
  <h3>Finalizar Pedido</h3>
  <input id="nomeCliente" placeholder="Seu Nome">
  <select id="pagamento">
    <option>Cartão</option>
    <option>Dinheiro</option>
    <option>Pix</option>
  </select>
  <select id="tipoEntrega" onchange="mostrarEndereco()">
    <option value="retirada">Retirada</option>
    <option value="entrega">Entrega</option>
  </select>
  <div id="enderecoArea"></div>
  <button onclick="enviarWhatsApp()" class="btn-finalizar">
    Enviar Pedido
  </button>
  `;

  modal.style.display="flex";
}

function mostrarEndereco(){
  const area=document.getElementById("enderecoArea");
  area.innerHTML=`
    <input id="cep" placeholder="CEP" onblur="buscarCEP()">
    <input id="rua" placeholder="Rua">
    <input id="numero" placeholder="Número">
    <input id="cidade" placeholder="Cidade">
  `;
}

async function buscarCEP(){
  const cep=document.getElementById("cep").value;
  if(cep.length<8) return;
  const res=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data=await res.json();
  document.getElementById("rua").value=data.logradouro;
  document.getElementById("cidade").value=data.localidade;
}

function enviarWhatsApp(){
  const nome=document.getElementById("nomeCliente").value;
  const pagamento=document.getElementById("pagamento").value;
  const tipo=document.getElementById("tipoEntrega").value;

  let enderecoTexto="";

  if(tipo==="entrega"){
    enderecoTexto=`
📍 *Endereço de Entrega:*
🏠 ${document.getElementById("rua").value}, ${document.getElementById("numero").value}
🏙️ ${document.getElementById("cidade").value}
📮 CEP: ${document.getElementById("cep").value}
`;
  }else{
    enderecoTexto=`
🏪 *Retirada na Loja*
`;
  }

  let mensagem=`✨🛍️ *Novo Pedido - Odòmàiyá* 🛍️✨\n\n`;
  mensagem+=`👤 *Cliente:* ${nome}\n`;
  mensagem+=`💳 *Pagamento:* ${pagamento}\n`;
  mensagem+=`🚚 *Tipo:* ${tipo}\n`;
  mensagem+=enderecoTexto;
  mensagem+=`\n📦 *Itens do Pedido:*\n`;

  let total=0;

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const p=produtos.find(x=>x.nome===nome);
      const preco=p.promocao&&p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[nome];

      mensagem+=`
🔹 *${nome}*
   🔢 Qtd: ${carrinho[nome]}
   💰 R$ ${(preco*carrinho[nome]).toFixed(2)}
`;
    }
  });

  mensagem+=`\n━━━━━━━━━━━━━━━`;
  mensagem+=`\n💎 *TOTAL: R$ ${total.toFixed(2)}*`;
  mensagem+=`\n━━━━━━━━━━━━━━━`;
  mensagem+=`\n🙏 Aguardando confirmação do pedido.`;

  const url=`https://wa.me/555496048808?text=${encodeURIComponent(mensagem)}`;
  window.open(url,"_blank");
}
}

carregarProdutos();
