const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let carrinho = {};

function abrirCarrinho(){
  document.getElementById("carrinho-lateral").classList.add("ativo");
  document.getElementById("overlay").style.display="block";
}

function fecharCarrinho(){
  document.getElementById("carrinho-lateral").classList.remove("ativo");
  document.getElementById("overlay").style.display="none";
}

function atualizarCarrinhoUI(){
  const container = document.getElementById("carrinho-itens");
  const contador = document.getElementById("contador-carrinho");
  const totalEl = document.getElementById("carrinho-total");

  container.innerHTML="";
  let total=0;
  let quantidadeTotal=0;

  Object.keys(carrinho).forEach(nome=>{
    const item = carrinho[nome];
    total += item.qtd * item.preco;
    quantidadeTotal += item.qtd;

    container.innerHTML += `
      <p>${nome} (${item.qtd}x)<br>
      R$ ${(item.qtd * item.preco).toFixed(2).replace('.',',')}</p>
    `;
  });

  totalEl.innerText="R$ "+total.toFixed(2).replace('.',',');
  contador.innerText=quantidadeTotal;
}

function adicionar(nome, preco){
  if(!carrinho[nome]){
    carrinho[nome]={qtd:0, preco:preco};
  }
  carrinho[nome].qtd++;
  atualizarCarrinhoUI();
}

function remover(nome){
  if(carrinho[nome]){
    carrinho[nome].qtd--;
    if(carrinho[nome].qtd<=0){
      delete carrinho[nome];
    }
  }
  atualizarCarrinhoUI();
}

/* CHECKOUT 3 ETAPAS */

function abrirCheckout(){
  fecharCarrinho();

  const modal = document.createElement("div");
  modal.className="modal";
  modal.innerHTML=`
    <div class="modal-content">
      <div class="progresso">
        <span class="ativo">Dados</span>
        <span>Entrega</span>
        <span>Pagamento</span>
      </div>

      <div class="checkout-etapa ativa" id="etapa1">
        <input type="text" id="nome" placeholder="Nome completo">
        <button onclick="proximaEtapa(2)">Continuar</button>
      </div>

      <div class="checkout-etapa" id="etapa2">
        <input type="text" id="cep" placeholder="CEP">
        <input type="text" id="numero" placeholder="Número">
        <button onclick="proximaEtapa(3)">Continuar</button>
      </div>

      <div class="checkout-etapa" id="etapa3">
        <select id="pagamento">
          <option>Cartão</option>
          <option>Pix</option>
          <option>Dinheiro</option>
        </select>
        <button onclick="finalizarPedido()">Finalizar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function proximaEtapa(n){
  document.querySelectorAll(".checkout-etapa").forEach(e=>e.classList.remove("ativa"));
  document.getElementById("etapa"+n).classList.add("ativa");

  const progresso = document.querySelectorAll(".progresso span");
  progresso.forEach(p=>p.classList.remove("ativo"));
  progresso[n-1].classList.add("ativo");
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

  const endereco = `${dadosCEP.logradouro}, ${numero} - ${dadosCEP.bairro}, ${dadosCEP.localidade} - ${dadosCEP.uf}`;

  let msg = `✨ *Novo Pedido Odòmàiyá* ✨\n\n`;
  msg += `👤 Cliente: ${nome}\n`;
  msg += `📦 Entrega: ${endereco}\n`;
  msg += `💳 Pagamento: ${pagamento}\n\n`;
  msg += `🛍️ Itens:\n`;

  let total=0;

  Object.keys(carrinho).forEach(nomeProduto=>{
    const item = carrinho[nomeProduto];
    msg += `• ${nomeProduto} (${item.qtd}x)\n`;
    total+=item.qtd*item.preco;
  });

  msg+=`\n💰 Total: R$ ${total.toFixed(2).replace('.',',')}`;

  window.open(`https://wa.me/555496048808?text=${encodeURIComponent(msg)}`, "_blank");

  carrinho={};
  atualizarCarrinhoUI();
  location.reload();
}
