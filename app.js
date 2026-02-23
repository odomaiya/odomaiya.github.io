let produtos = [];
let carrinho = [];
let etapaCheckout = 1;

/* =========================
   CARREGAR PRODUTOS CSV
========================= */
async function carregarProdutos() {
  try {
    const res = await fetch(CONFIG.planilhaCSV);
    const texto = await res.text();
    const linhas = texto.split("\n").slice(1);

    produtos = linhas.map(linha => {
      const [nome, preco, categoria, imagem, estoque] = linha.split(",");
      return {
        nome: nome?.trim(),
        preco: parseFloat(preco),
        categoria: categoria?.trim(),
        imagem: imagem?.trim(),
        estoque: parseInt(estoque)
      };
    }).filter(p => p.nome);

    renderCategorias();
    renderProdutos(produtos);

  } catch (e) {
    console.error("Erro ao carregar CSV:", e);
  }
}

/* =========================
   RENDER CATEGORIAS
========================= */
function renderCategorias() {
  const categorias = [...new Set(produtos.map(p => p.categoria))].sort();
  const container = document.getElementById("categorias");
  container.innerHTML = `<button onclick="filtrarCategoria('')">Todos</button>`;

  categorias.forEach(cat => {
    container.innerHTML += `<button onclick="filtrarCategoria('${cat}')">${cat}</button>`;
  });
}

function filtrarCategoria(cat) {
  if (!cat) return renderProdutos(produtos);
  renderProdutos(produtos.filter(p => p.categoria === cat));
}

/* =========================
   RENDER PRODUTOS
========================= */
function renderProdutos(lista) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach((p, index) => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.imagem}" loading="lazy">
        <h3>${p.nome}</h3>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <div class="estoque">
          ${p.estoque > 0 ? `Restam ${p.estoque} unidades` : "Indisponível"}
        </div>
        <div class="controle">
          <button onclick="alterarQtd(${index}, -1)">−</button>
          <span id="qtd-${index}">0</span>
          <button onclick="alterarQtd(${index}, 1)">+</button>
        </div>
      </div>
    `;
  });
}

/* =========================
   ALTERAR QUANTIDADE
========================= */
function alterarQtd(index, valor) {
  const produto = produtos[index];
  let item = carrinho.find(i => i.nome === produto.nome);

  if (!item && valor > 0) {
    carrinho.push({ ...produto, qtd: 1 });
  } else if (item) {
    item.qtd += valor;
    if (item.qtd <= 0) {
      carrinho = carrinho.filter(i => i.nome !== produto.nome);
    }
  }

  atualizarCarrinho();
}

/* =========================
   ATUALIZAR CARRINHO
========================= */
function atualizarCarrinho() {
  const container = document.getElementById("itensCarrinho");
  const totalEl = document.getElementById("totalCarrinho");
  container.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, i) => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;

    container.innerHTML += `
      <div style="margin-bottom:10px">
        <strong>${item.nome}</strong><br>
        ${item.qtd}x R$ ${item.preco.toFixed(2)}
        <button onclick="removerItem(${i})">❌</button>
      </div>
    `;
  });

  totalEl.innerText = `R$ ${total.toFixed(2)}`;
  document.getElementById("contadorCarrinho").innerText = carrinho.reduce((s,i)=>s+i.qtd,0);
}

/* =========================
   REMOVER ITEM
========================= */
function removerItem(i){
  carrinho.splice(i,1);
  atualizarCarrinho();
}

/* =========================
   BUSCA
========================= */
document.getElementById("busca").addEventListener("input", e=>{
  const termo = e.target.value.toLowerCase();
  renderProdutos(produtos.filter(p => p.nome.toLowerCase().includes(termo)));
});

/* =========================
   FILTRO PREÇO
========================= */
document.getElementById("filtroPreco").addEventListener("change", e=>{
  let lista = [...produtos];
  if(e.target.value==="menor") lista.sort((a,b)=>a.preco-b.preco);
  if(e.target.value==="maior") lista.sort((a,b)=>b.preco-a.preco);
  renderProdutos(lista);
});

/* =========================
   CARRINHO UI
========================= */
function abrirCarrinho(){
  document.getElementById("carrinho").style.right="0";
  document.getElementById("overlay").style.display="block";
}

function fecharCarrinho(){
  document.getElementById("carrinho").style.right="-400px";
  document.getElementById("overlay").style.display="none";
}

/* =========================
   CHECKOUT ETAPAS
========================= */
function iniciarCheckout(){
  if(carrinho.length===0) return alert("Adicione produtos ao carrinho.");
  document.getElementById("checkoutOverlay").style.display="block";
  document.getElementById("checkout").style.display="block";
}

function proximaEtapa(){
  document.querySelector(`#etapa${etapaCheckout}`).classList.add("hidden");
  etapaCheckout++;
  document.querySelector(`#etapa${etapaCheckout}`).classList.remove("hidden");
}

function finalizarPedido(){
  document.getElementById("loader").classList.remove("hidden");

  setTimeout(()=>{
    const nome = document.getElementById("nomeCliente").value;
    const tipo = document.getElementById("tipoEntrega").value;
    const pagamento = document.getElementById("pagamento").value;
    const endereco = document.getElementById("endereco").value;

    let total = carrinho.reduce((s,i)=>s+i.preco*i.qtd,0);

    let mensagem = `✨ *Pedido Odòmáiyà* ✨\n\n`;
    mensagem += `👤 Cliente: ${nome}\n\n🛍️ Itens:\n`;

    carrinho.forEach(item=>{
      mensagem += `• ${item.nome}\n   ${item.qtd}x R$ ${item.preco.toFixed(2)}\n`;
    });

    mensagem += `\n💰 Total: R$ ${total.toFixed(2)}\n`;
    mensagem += `🚚 Tipo: ${tipo}\n`;

    if(tipo==="Entrega") mensagem += `📍 Endereço: ${endereco}\n`;
    mensagem += `💳 Pagamento: ${pagamento}\n`;
    mensagem += `📦 Taxa de entrega será informada.\n`;

    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

    document.getElementById("loader").classList.add("hidden");
    document.getElementById("sucesso").classList.remove("hidden");

    soltarConfete();
    tocarSom();

    setTimeout(()=>{
      window.open(url,"_blank");
    },2000);

  },1500);
}

/* =========================
   CONFETE BRANCO
========================= */
function soltarConfete(){
  for(let i=0;i<30;i++){
    let el=document.createElement("div");
    el.style.position="fixed";
    el.style.width="6px";
    el.style.height="6px";
    el.style.background="white";
    el.style.top=Math.random()*100+"%";
    el.style.left=Math.random()*100+"%";
    el.style.borderRadius="50%";
    el.style.opacity="0.8";
    el.style.animation="brilho 2s linear";
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),2000);
  }
}

/* =========================
   SOM SUAVE
========================= */
function tocarSom(){
  const audio=new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_115b9c87b5.mp3");
  audio.volume=0.2;
  audio.play();
}

/* ========================= */
carregarProdutos();
