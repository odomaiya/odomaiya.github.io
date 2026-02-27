/* ===========================================
   ODÒMÁIYÀ - LUXO ESPIRITUAL ABSOLUTO
=========================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};
let etapaAtual = 1;

/* ===========================================
   UTIL
=========================================== */

function money(v){
  return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

/* ===========================================
   CARREGAR PRODUTOS
=========================================== */

async function carregar(){
  try{
    const r = await fetch(API_URL+"?acao=produtos",{cache:"no-store"});
    produtos = await r.json();

    produtos.sort((a,b)=>
      (b.promocao>0)-(a.promocao>0) ||
      a.nome.localeCompare(b.nome)
    );

    render(produtos);
   carregarCategorias();
  }catch(e){
    console.error("Erro ao carregar produtos",e);
  }
}

/* ===========================================
   RENDER PRODUTOS
=========================================== */
let categoriaAtual = "Todos";

function criarCategorias(){
  const area = document.getElementById("categorias");
  area.innerHTML = "";

  const categorias = ["Todos"];

  produtos.forEach(p=>{
    if(p.categoria && !categorias.includes(p.categoria)){
      categorias.push(p.categoria);
    }
  });

  categorias.forEach(cat=>{
    const btn = document.createElement("button");
    btn.className="categoria-btn"+(cat===categoriaAtual?" ativa":"");
    btn.innerText = cat;

    btn.onclick = ()=>{
      categoriaAtual = cat;
      criarCategorias();
      aplicarFiltro();
    };

    area.appendChild(btn);
  });
}

function aplicarFiltro(){
  if(categoriaAtual==="Todos"){
    render(produtos);
  }else{
    render(produtos.filter(p=>p.categoria===categoriaAtual));
  }
}

let categoriaAtual = "Todos";

function criarCategorias(){
  const area = document.getElementById("categorias");
  area.innerHTML = "";

  const categorias = ["Todos"];

  produtos.forEach(p=>{
    if(p.categoria && !categorias.includes(p.categoria)){
      categorias.push(p.categoria);
    }
  });

  categorias.forEach(cat=>{
    const btn = document.createElement("button");
    btn.className="categoria-btn"+(cat===categoriaAtual?" ativa":"");
    btn.innerText = cat;

    btn.onclick = ()=>{
      categoriaAtual = cat;
      criarCategorias();
      aplicarFiltro();
    };

    area.appendChild(btn);
  });
}

function aplicarFiltro(){
  if(categoriaAtual==="Todos"){
    render(produtos);
  }else{
    render(produtos.filter(p=>p.categoria===categoriaAtual));
  }
}

criarCategorias();
aplicarFiltro();

/* ===========================================
   ALTERAR QUANTIDADE
=========================================== */

function alterar(nome,valor){
  const produto = produtos.find(p=>p.nome===nome);
  if(!produto) return;

  if(!carrinho[nome]) carrinho[nome]=0;

  if(valor>0 && carrinho[nome]>=produto.estoque){
    alert("Quantidade máxima disponível.");
    return;
  }

  carrinho[nome]+=valor;
  if(carrinho[nome]<0) carrinho[nome]=0;

  render(produtos);
}

/* ===========================================
   CARRINHO DRAWER
=========================================== */

function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("ativo");
  document.getElementById("overlay").classList.add("ativo");
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("ativo");
  document.getElementById("overlay").classList.remove("ativo");
}

document.getElementById("overlay").addEventListener("click",fecharCarrinho);

function atualizarCarrinho(){
  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contadorCarrinho");

  let total = 0;
  let html = "";

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const p = produtos.find(x=>x.nome===nome);
      const preco = p.promocao>0?p.promocao:p.preco;
      const subtotal = preco*carrinho[nome];
      total+=subtotal;

      html+=`
        <div style="margin-bottom:12px;">
          <strong>${nome}</strong><br>
          ${carrinho[nome]}x ${money(preco)}
        </div>
      `;
    }
  });

  if(!html) html="<p>Seu carrinho está vazio</p>";

  area.innerHTML = html;
  document.getElementById("valorTotal").innerText = money(total);
  contador.innerText = Object.values(carrinho).reduce((a,b)=>a+b,0);
}

/* ===========================================
   CHECKOUT ETAPAS
=========================================== */

function abrirCheckout(){
  fecharCarrinho();
  document.getElementById("modalCheckout").style.display="flex";
  atualizarSugestao();
}

function proximaEtapa(n){
  if(n===2){
    if(!document.getElementById("cliente").value.trim()){
      alert("Informe seu nome.");
      return;
    }
  }

  document.getElementById("etapa"+etapaAtual).classList.remove("ativa");
  document.getElementById("step"+etapaAtual).classList.remove("active");

  etapaAtual = n;

  document.getElementById("etapa"+etapaAtual).classList.add("ativa");
  document.getElementById("step"+etapaAtual).classList.add("active");
}

function voltarEtapa(n){
  proximaEtapa(n);
}

/* ===========================================
   CEP AUTOMÁTICO AO DIGITAR 8 NÚMEROS
=========================================== */

document.addEventListener("input",async e=>{
  if(e.target.id==="cep"){
    const cep = e.target.value.replace(/\D/g,"");
    if(cep.length===8){
      try{
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await r.json();
        if(!data.erro){
          document.getElementById("rua").value=data.logradouro||"";
          document.getElementById("cidade").value=data.localidade||"";
        }
      }catch{}
    }
  }

  if(e.target.id==="tipo"){
    document.getElementById("enderecoArea").style.display=
      e.target.value==="entrega"?"block":"none";
  }
});

/* ===========================================
   SUGESTÃO PREMIUM COM CONTADOR
=========================================== */

function atualizarSugestao(){

  const area = document.getElementById("sugestaoArea");
  area.innerHTML="";

  const itens = Object.keys(carrinho).filter(n=>carrinho[n]>0);
  if(itens.length===0) return;

  const categoriasSelecionadas = itens.map(n=>{
    const p = produtos.find(x=>x.nome===n);
    return p?.categoria;
  });

  let sugestoes = produtos.filter(p=>
    !itens.includes(p.nome) &&
    p.estoque>0 &&
    (
      categoriasSelecionadas.includes(p.categoria) ||
      p.promocao>0 ||
      p.estoque>=8
    )
  );

  sugestoes.sort((a,b)=>
    (b.promocao>0)-(a.promocao>0) ||
    ((a.promocao||a.preco)-(b.promocao||b.preco))
  );

  if(!sugestoes.length) return;

  const s = sugestoes[0];
  const preco = s.promocao>0?s.promocao:s.preco;

  area.innerHTML = `
    <div style="
      margin-top:25px;
      padding:20px;
      border-radius:20px;
      background:linear-gradient(135deg,#f6f9fc,#eef4fb);
      box-shadow:0 15px 35px rgba(0,0,0,0.08);
    ">
      <h3 style="margin-bottom:15px;">✨ Você também pode gostar</h3>
      <img src="${s.imagem}" style="width:100%;border-radius:15px;margin-bottom:10px;">
      <strong>${s.nome}</strong>
      <div class="preco" style="margin:8px 0;">${money(preco)}</div>

      <button onclick="adicionarSugestao('${s.nome}')" style="
        width:100%;
        padding:12px;
        border:none;
        border-radius:30px;
        background:#0d4f8b;
        color:white;
        font-weight:600;
        cursor:pointer;
      ">
        Adicionar ao Carrinho
      </button>
    </div>
  `;
}

function adicionarSugestao(nome){
  if(!carrinho[nome]) carrinho[nome]=0;
  carrinho[nome]++;
  render(produtos);
  atualizarSugestao();
}
/* ===========================================
   FINALIZAR
   ENVIA API -> ABRE WHATSAPP
=========================================== */

async function finalizar(){

  let total=0;
  let msg="🛍️ *NOVO PEDIDO - ODÒMÁIYÀ* 🛍️\n";
  msg+="━━━━━━━━━━━━━━━━━━\n\n";

  const nome = cliente.value;
  const telefone = telefoneInput = document.getElementById("telefone").value;
  const tipo = tipoSelect = document.getElementById("tipo").value;
  const pagamento = document.getElementById("pagamento").value;

  msg+="👤 Cliente: "+nome+"\n";
  msg+="📦 Tipo: "+(tipo==="entrega"?"Entrega":"Retirada")+"\n";
  msg+="💳 Pagamento: "+pagamento+"\n\n";

  if(tipo==="entrega"){
    msg+="📍 Endereço:\n";
    msg+=rua.value+", "+numero.value+"\n";
    msg+=cidade.value+"\n\n";
  }

  msg+="🛒 ITENS DO PEDIDO\n";
  msg+="━━━━━━━━━━━━━━━━━━\n";

  Object.keys(carrinho).forEach(n=>{
    if(carrinho[n]>0){
      const p = produtos.find(x=>x.nome===n);
      const preco = p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[n];

      msg+=`${carrinho[n]}x ${n}\n`;
      msg+=`   ${money(preco)} cada\n\n`;
    }
  });

  msg+="━━━━━━━━━━━━━━━━━━\n";
  msg+="💰 TOTAL: "+money(total)+"\n";
  msg+="━━━━━━━━━━━━━━━━━━\n\n";
  msg+="🙏 Aguardando confirmação.";

  try{
    await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({
        cliente:nome,
        tipo:tipo,
        pagamento:pagamento,
        itens:carrinho,
        total:total
      })
    });

    window.open("https://wa.me/555496048808?text="+encodeURIComponent(msg));
    location.reload();

  }catch{
    alert("Erro ao enviar pedido.");
  }
}
/* ===========================================
   INIT
=========================================== */

document.addEventListener("DOMContentLoaded",carregar);
