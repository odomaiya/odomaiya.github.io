const numeroWhats = "5554996048808";
const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv";

let produtos = [];
let carrinho = [];

fetch(csvURL)
.then(res => res.text())
.then(text => {
  const linhas = text.split("\n").slice(1);
  produtos = linhas.map(l => {
    const c = l.split(",");
    return {
      id: c[0],
      nome: c[1],
      preco: parseFloat(c[2]),
      estoque: parseInt(c[3]),
      imagem: c[4]
    };
  });
  renderizar(produtos);
});

function renderizar(lista){
  const area = document.getElementById("produtos");
  area.innerHTML = "";

  lista.forEach(p => {
    area.innerHTML += `
      <div class="card">
        <img src="${p.imagem}">
        <h4>${p.nome}</h4>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <div class="estoque">Estoque: ${p.estoque}</div>
        <button onclick="adicionar('${p.id}')">Adicionar</button>
      </div>
    `;
  });
}

function adicionar(id){
  const produto = produtos.find(p => p.id == id);
  const item = carrinho.find(i => i.id == id);

  if(item){
    item.qtd++;
  } else {
    carrinho.push({...produto, qtd:1});
  }

  atualizarCarrinho();
}

function atualizarCarrinho(){
  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contador");
  area.innerHTML = "";

  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach(i => {
    const subtotal = i.qtd * i.preco;
    total += subtotal;
    quantidadeTotal += i.qtd;

    area.innerHTML += `
      <p><strong>${i.nome}</strong><br>
      Quantidade: ${i.qtd}<br>
      Subtotal: R$ ${subtotal.toFixed(2)}</p>
      <hr>
    `;
  });

  contador.innerText = quantidadeTotal;
  document.getElementById("total").innerText = 
    "Total: R$ " + total.toFixed(2);
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.toggle("ativo");
}

function finalizarPedido(){
  if(carrinho.length === 0){
    alert("Seu carrinho está vazio.");
    return;
  }

  let total = 0;
  let mensagem = "✨ Pedido Odòmáiyà ✨\n\n🛍️ Itens:\n\n";

  carrinho.forEach(i => {
    const subtotal = i.qtd * i.preco;
    total += subtotal;

    mensagem += `• ${i.nome}\n`;
    mensagem += `   Quantidade: ${i.qtd}\n`;
    mensagem += `   Valor unitário: R$ ${i.preco.toFixed(2)}\n`;
    mensagem += `   Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
  });

  mensagem += `💰 Total do Pedido: R$ ${total.toFixed(2)}\n\n`;
  mensagem += "Aguardo confirmação e forma de pagamento.";

  const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}
