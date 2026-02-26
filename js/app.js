/* ======================================================
   ODÒMÁIYÀ — JS PREMIUM COMPLETO
====================================================== */

const API_URL="https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos=[];
let carrinho={};
let categoriaAtual="Todos";
let etapaAtual=1;

/* ================= UTIL ================= */

function money(v){
  return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

/* ================= CARREGAR PRODUTOS ================= */

async function carregar(){
  try{
    const r=await fetch(API_URL+"?acao=produtos",{cache:"no-store"});
    produtos=await r.json();

    produtos.sort((a,b)=>
      (b.promocao>0)-(a.promocao>0) ||
      a.nome.localeCompare(b.nome)
    );

    aplicarFiltro();
  }catch(e){
    console.error("Erro ao carregar produtos",e);
  }
}

/* ================= RENDER ================= */

function aplicarFiltro(){
  render(produtos);
}

function render(lista){
  const grid=document.getElementById("produtos");
  grid.innerHTML="";

  lista.forEach(p=>{

    const preco=p.promocao>0?p.promocao:p.preco;
    const estoqueBaixo=p.estoque>0 && p.estoque<10;
    const semEstoque=p.estoque<=0;

    const card=document.createElement("div");
    card.className="produto"
      +(p.promocao>0?" promo":"")
      +(estoqueBaixo?" quase-esgotado":"");

    let html="";

    if(estoqueBaixo){
      html+=`<div class="badge-estoque">Poucas unidades</div>`;
    }

    html+=`<h3>${p.nome}</h3>`;
    html+=`<p>${money(preco)}</p>`;

    if(semEstoque){
      html+=`<p style="color:#e53935;font-weight:600;">Sem estoque</p>`;
    }else{
      html+=`
      <div class="contador">
        <button onclick="alterar('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome]||0}</span>
        <button onclick="alterar('${p.nome}',1)">+</button>
      </div>
      `;
    }

    card.innerHTML=html;
    grid.appendChild(card);
  });

  atualizarCarrinho();
}

/* ================= ALTERAR ================= */

function alterar(nome,v){
  const produto=produtos.find(p=>p.nome===nome);
  if(!produto) return;

  if(!carrinho[nome]) carrinho[nome]=0;

  if(v>0 && carrinho[nome]>=produto.estoque){
    alert("Quantidade máxima disponível em estoque.");
    return;
  }

  carrinho[nome]+=v;
  if(carrinho[nome]<0) carrinho[nome]=0;

  aplicarFiltro();
}

/* ================= CARRINHO ================= */

function atualizarCarrinho(){
  let total=0;
  let html="";

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const produto=produtos.find(p=>p.nome===nome);
      if(!produto) return;

      const preco=produto.promocao>0?produto.promocao:produto.preco;
      const subtotal=preco*carrinho[nome];
      total+=subtotal;

      html+=`
        <div style="margin-bottom:15px;">
          <strong>${nome}</strong><br>
          ${carrinho[nome]}x ${money(preco)}<br>
          Subtotal: ${money(subtotal)}
        </div>
      `;
    }
  });

  if(total===0){
    html="<p>Seu carrinho está vazio.</p>";
  }

  document.getElementById("itensCarrinho").innerHTML=html;
  document.getElementById("valorTotal").innerText=money(total);
  document.getElementById("contadorCarrinho").innerText=
    Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("ativo");
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("ativo");
}

/* ================= CHECKOUT 3 ETAPAS ================= */

function abrirCheckout(){
  etapaAtual=1;
  document.getElementById("modalCheckout").style.display="flex";
  renderEtapa();
}

function renderEtapa(){
  const box=document.getElementById("checkoutConteudo");

  let progresso=`
  <div style="display:flex;gap:10px;margin-bottom:25px;">
    <div style="flex:1;height:6px;border-radius:10px;background:${etapaAtual>=1?'#0077cc':'#e0e6ef'};"></div>
    <div style="flex:1;height:6px;border-radius:10px;background:${etapaAtual>=2?'#0077cc':'#e0e6ef'};"></div>
    <div style="flex:1;height:6px;border-radius:10px;background:${etapaAtual>=3?'#0077cc':'#e0e6ef'};"></div>
  </div>
  `;

  if(etapaAtual===1){
    box.innerHTML=progresso+`
      <h3>Seus Dados</h3>
      <input type="text" id="cliente" placeholder="Nome completo">
      <button onclick="proximaEtapa()">Continuar</button>
    `;
  }

  if(etapaAtual===2){
    box.innerHTML=progresso+`
      <h3>Entrega</h3>
      <select id="tipo">
        <option value="retirada">Retirada na loja</option>
        <option value="entrega">Entrega</option>
      </select>

      <div id="areaEntrega" style="display:none;margin-top:15px;">
        <input type="text" id="cep" placeholder="CEP">
        <input type="text" id="rua" placeholder="Rua">
        <input type="text" id="numero" placeholder="Número">
        <input type="text" id="cidade" placeholder="Cidade">
      </div>

      <button onclick="etapaAtual=1;renderEtapa()">Voltar</button>
      <button onclick="proximaEtapa()">Continuar</button>
    `;

    setTimeout(()=>{
      const tipo=document.getElementById("tipo");
      const area=document.getElementById("areaEntrega");
      tipo.addEventListener("change",()=>{
        area.style.display=tipo.value==="entrega"?"block":"none";
      });

      const cepInput=document.getElementById("cep");
      cepInput.addEventListener("input",async ()=>{
        let cep=cepInput.value.replace(/\D/g,'');
        if(cep.length===8){
          const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const d=await r.json();
          if(!d.erro){
            document.getElementById("rua").value=d.logradouro||"";
            document.getElementById("cidade").value=d.localidade||"";
          }
        }
      });
    },100);
  }

  if(etapaAtual===3){

    const sugestaoHTML=gerarSugestao();

    box.innerHTML=progresso+`
      <h3>Pagamento</h3>
      <select id="pagamento">
        <option value="Pix">Pix</option>
        <option value="Cartão">Cartão</option>
        <option value="Dinheiro">Dinheiro</option>
      </select>

      ${sugestaoHTML}

      <button onclick="etapaAtual=2;renderEtapa()">Voltar</button>
      <button onclick="finalizar()">Enviar Pedido</button>
    `;
  }
}

function proximaEtapa(){
  if(etapaAtual===1){
    const nome=document.getElementById("cliente").value.trim();
    if(!nome){
      alert("Informe seu nome.");
      return;
    }
  }
  etapaAtual++;
  renderEtapa();
}

/* ================= SUGESTÃO ELEGANTE ================= */

function gerarSugestao(){
  const itens=Object.keys(carrinho).filter(n=>carrinho[n]>0);
  if(itens.length===0) return "";

  const sugestao=produtos.find(p=>
    !itens.includes(p.nome) &&
    p.estoque>0 &&
    (p.promocao>0 || p.estoque>=8)
  );

  if(!sugestao) return "";

  return `
  <div style="background:#f3f7ff;padding:15px;border-radius:15px;margin:20px 0;border:1px solid #dbe6f3;">
    ✨ Você pode incluir também:<br>
    <strong>${sugestao.nome}</strong><br>
    ${money(sugestao.promocao>0?sugestao.promocao:sugestao.preco)}
  </div>
  `;
}

/* ================= FINALIZAR ================= */

async function finalizar(){

  let total=0;
  let msg="✨ *Novo Pedido Odòmáiyà* ✨\n\n";
  msg+="👤 Cliente: "+document.getElementById("cliente").value+"\n";
  msg+="📦 Tipo: "+document.getElementById("tipo").value+"\n";
  msg+="💳 Pagamento: "+document.getElementById("pagamento").value+"\n\n";

  if(document.getElementById("tipo").value==="entrega"){
    msg+=`\n📍 Endereço: ${document.getElementById("rua").value}, ${document.getElementById("numero").value}, ${document.getElementById("cidade").value}`;
  }else{
    msg+=`\n📍 Retirada na loja`;
  }

  msg+="\n\n🛍️ Itens:\n";

  Object.keys(carrinho).forEach(n=>{
    if(carrinho[n]>0){
      const p=produtos.find(x=>x.nome===n);
      const preco=p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[n];
      msg+=`• ${n} x${carrinho[n]} — ${money(preco)}\n`;
    }
  });

  msg+=`\n💰 Total: ${money(total)}\n`;

  /* envia para planilha */
  await fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({
      cliente:document.getElementById("cliente").value,
      tipo:document.getElementById("tipo").value,
      pagamento:document.getElementById("pagamento").value,
      itens:carrinho,
      total:total
    })
  });

  window.open("https://wa.me/555496048808?text="+encodeURIComponent(msg));
  location.reload();
}

document.addEventListener("DOMContentLoaded",carregar);
