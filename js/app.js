const API = "https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec";

let produtos = [];
let carrinho = [];

document.addEventListener("DOMContentLoaded", ()=>{
  carregarProdutos();
  document.getElementById("btnCarrinho").onclick = abrirCarrinho;
  document.getElementById("buscar").oninput = buscarProduto;
});

async function carregarProdutos(){
  const res = await fetch(API);
  produtos = await res.json();
  renderProdutos(produtos);
}

function renderProdutos(lista){
  const grid = document.getElementById("produtos");

  grid.innerHTML = lista.map(p=>`
    <div class="card">
      <img src="${p.imagem}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <div class="preco">R$ ${Number(p.preco).toFixed(2)}</div>
      <div>${p.estoque > 0 ? "Disponível" : "Sem estoque"}</div>
      <button ${p.estoque<=0?"disabled":""}
        onclick="adicionar('${p.nome}')">
        Adicionar
      </button>
    </div>
  `).join("");
}

function adicionar(nome){
  const produto = produtos.find(p=>p.nome===nome);
  const item = carrinho.find(i=>i.nome===nome);

  if(item){
    item.qtd++;
  } else {
    carrinho.push({...produto, qtd:1});
  }

  atualizarCarrinho();
}

function atualizarCarrinho(){
  const container = document.getElementById("carrinhoItens");
  let total = 0;

  container.innerHTML = carrinho.map(item=>{
    total += item.preco * item.qtd;
    return `
      <div class="item">
        <span>${item.nome} x${item.qtd}</span>
        <span>R$ ${(item.preco*item.qtd).toFixed(2)}</span>
      </div>
    `;
  }).join("");

  document.getElementById("total").innerText =
    "Total: R$ " + total.toFixed(2);
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("ativo");
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("ativo");
}

function buscarProduto(e){
  const termo = e.target.value.toLowerCase();
  const filtrado = produtos.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );
  renderProdutos(filtrado);
}

function finalizarPedido(){
  if(carrinho.length === 0){
    alert("Carrinho vazio!");
    return;
  }

  const nome = document.getElementById("nomeCliente").value;
  const pagamento = document.getElementById("pagamento").value;

  if(!nome){
    alert("Digite seu nome");
    return;
  }

  let mensagem = `Pedido - Odòmáiyà\nCliente: ${nome}\nPagamento: ${pagamento}\n\n`;

  carrinho.forEach(item=>{
    mensagem += `${item.nome} x${item.qtd}\n`;
  });

  const total = carrinho.reduce((s,i)=>s+i.preco*i.qtd,0);
  mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/55SEUNUMEROAQUI?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}
