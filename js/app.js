const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};
let categoriaAtual = "Todos";

/* ============================= */
/* CARREGAR PRODUTOS RÁPIDO */
/* ============================= */

async function carregarProdutos(){
  try{
    const res = await fetch(API_URL+"?acao=produtos");
    const data = await res.json();

    produtos = data.map(p=>({
      nome: p.nome,
      preco: Number(String(p.preco).replace(",", ".")) || 0,
      promocao: Number(String(p.promocao).replace(",", ".")) || 0,
      categoria: p.categoria,
      imagem: p.imagem,
      estoque: Number(p.estoque) || 0
    }));

    // Promoções primeiro
    produtos.sort((a,b)=> (b.promocao>0)-(a.promocao>0));

    criarFiltros();
    renderizar(produtos);

  }catch(e){
    console.error("Erro ao carregar produtos",e);
  }
}

/* ============================= */

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

/* ============================= */

function renderizar(lista){
  const grid=document.getElementById("produtos");
  grid.innerHTML="";
  const fragment=document.createDocumentFragment();

  lista.forEach((p,index)=>{

    const precoFinal = p.promocao>0?p.promocao:p.preco;
    const temPromo = p.promocao>0;

    const card=document.createElement("div");
    card.className="produto-card";
    card.style.animationDelay=`${index*40}ms`;

    if(temPromo){
      card.classList.add("promo-card");
    }

    card.innerHTML=`
      ${temPromo?`<div class="badge">🔥 OFERTA</div>`:""}
      <img src="${p.imagem}" loading="lazy">
      <h3>${p.nome}</h3>
      ${temPromo?
      `<div>
        <span class="antigo">R$ ${p.preco.toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>
        <span class="promo">R$ ${p.promocao.toLocaleString("pt-BR",{minimumFractionDigits:2})}</span>
      </div>`:
      `<div>R$ ${p.preco.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>`}
      <small>Estoque: ${p.estoque}</small>
      <div class="contador">
        <button onclick="alterar('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome]||0}</span>
        <button onclick="alterar('${p.nome}',1)">+</button>
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  atualizarCarrinho();
}

/* ============================= */

function alterar(nome,valor){
  const produto=produtos.find(p=>p.nome===nome);
  if(!carrinho[nome]) carrinho[nome]=0;

  if(valor>0 && carrinho[nome]>=produto.estoque) return;

  carrinho[nome]+=valor;
  if(carrinho[nome]<0) carrinho[nome]=0;

  filtrar(categoriaAtual);
}

/* ============================= */

function atualizarCarrinho(){
  const area=document.getElementById("itensCarrinho");
  area.innerHTML="";
  let total=0;

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const p=produtos.find(x=>x.nome===nome);
      const preco=p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[nome];

      area.innerHTML+=`
        <div>
          ${nome} x${carrinho[nome]}<br>
          <small>R$ ${(preco*carrinho[nome]).toLocaleString("pt-BR",{minimumFractionDigits:2})}</small>
        </div>`;
    }
  });

  document.getElementById("valorTotal").innerText=
  "R$ "+total.toLocaleString("pt-BR",{minimumFractionDigits:2});
}

/* ============================= */
/* CHECKOUT FUNCIONANDO */
/* ============================= */

function abrirCheckout(){
  if(Object.values(carrinho).every(q=>q===0)){
    alert("Adicione produtos ao carrinho.");
    return;
  }

  document.getElementById("modalCheckout").style.display="flex";

  document.getElementById("checkoutConteudo").innerHTML=`
    <h2>Finalizar Pedido</h2>
    <input type="text" id="nomeCliente" placeholder="Seu nome" required>

    <select id="formaPagamento">
      <option value="">Forma de pagamento</option>
      <option>Pix</option>
      <option>Cartão</option>
      <option>Dinheiro</option>
    </select>

    <select id="tipoEntrega" onchange="mostrarEndereco()">
      <option value="">Entrega ou Retirada?</option>
      <option value="Entrega">Entrega</option>
      <option value="Retirada">Retirada</option>
    </select>

    <div id="areaEndereco"></div>

    <button onclick="enviarPedido()">Enviar pelo WhatsApp</button>
  `;
}

function mostrarEndereco(){
  const tipo=document.getElementById("tipoEntrega").value;
  const area=document.getElementById("areaEndereco");

  if(tipo==="Entrega"){
    area.innerHTML=`
      <input id="cep" placeholder="CEP" onblur="buscarCEP()">
      <input id="rua" placeholder="Rua">
      <input id="numero" placeholder="Número">
      <input id="cidade" placeholder="Cidade">
    `;
  }else{
    area.innerHTML=`
      <p><b>Retirada em:</b><br>
      R. Sete de Agosto, 28 - Centro<br>
      Passo Fundo - RS<br>
      99025-030</p>
    `;
  }
}

async function buscarCEP(){
  const cep=document.getElementById("cep").value.replace(/\D/g,"");
  if(cep.length!==8) return;

  const res=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data=await res.json();

  document.getElementById("rua").value=data.logradouro;
  document.getElementById("cidade").value=data.localidade;
}

/* ============================= */

function enviarPedido(){
  const nome=document.getElementById("nomeCliente").value;
  const pagamento=document.getElementById("formaPagamento").value;
  const tipo=document.getElementById("tipoEntrega").value;

  if(!nome || !pagamento || !tipo){
    alert("Preencha todos os campos.");
    return;
  }

  let total=0;
  let mensagem=`✨ *Pedido Odòmàiyá* ✨\n\n`;
  mensagem+=`👤 Cliente: ${nome}\n`;
  mensagem+=`💳 Pagamento: ${pagamento}\n`;
  mensagem+=`🚚 Tipo: ${tipo}\n\n`;
  mensagem+=`🛍️ *Itens:*\n`;

  Object.keys(carrinho).forEach(nomeProd=>{
    if(carrinho[nomeProd]>0){
      const p=produtos.find(x=>x.nome===nomeProd);
      const preco=p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[nomeProd];

      mensagem+=`• ${nomeProd}\n`;
      mensagem+=`   Qtde: ${carrinho[nomeProd]}\n`;
      mensagem+=`   Valor: R$ ${(preco*carrinho[nomeProd]).toLocaleString("pt-BR",{minimumFractionDigits:2})}\n\n`;
    }
  });

  mensagem+=`💰 *Total: R$ ${total.toLocaleString("pt-BR",{minimumFractionDigits:2})}*\n\n`;

  if(tipo==="Entrega"){
    const rua=document.getElementById("rua").value;
    const numero=document.getElementById("numero").value;
    const cidade=document.getElementById("cidade").value;
    const cep=document.getElementById("cep").value;

    mensagem+=`📍 *Endereço:*\n${rua}, ${numero}\n${cidade}\nCEP: ${cep}\n`;
  }else{
    mensagem+=`📍 Retirada em loja\nR. Sete de Agosto, 28 - Centro\nPasso Fundo - RS\n99025-030\n`;
  }

  const url=`https://wa.me/555496048808?text=${encodeURIComponent(mensagem)}`;
  window.open(url,"_blank");
}

carregarProdutos();
