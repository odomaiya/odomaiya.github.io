const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

fetch(urlCSV)
.then(res => res.text())
.then(text => {
  const linhas = text.split("\n").slice(1);
  produtos = linhas.map(linha => {
    const col = linha.split(",");
    return {
      nome: col[1],
      preco: parseFloat(col[2]),
      categoria: col[3],
      imagem: col[4]
    };
  });
  renderizar(produtos);
  criarCategorias();
});

function renderizar(lista){
  const area = document.getElementById("produtos");
  area.innerHTML = "";

  lista.forEach(p=>{
    area.innerHTML += `
      <div class="card">
        <img src="${p.imagem}">
        <h4>${p.nome}</h4>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <div class="controle">
          <button onclick="alterarQtd('${p.nome}',-1)">-</button>
          <span>${quantidadeNoCarrinho(p.nome)}</span>
          <button onclick="alterarQtd('${p.nome}',1)">+</button>
        </div>
      </div>
    `;
  });
}

function alterarQtd(nome,valor){
  const item = carrinho.find(i=>i.nome===nome);
  if(item){
    item.qtd += valor;
    if(item.qtd<=0) carrinho = carrinho.filter(i=>i.nome!==nome);
  } else if(valor>0){
    const prod = produtos.find(p=>p.nome===nome);
    carrinho.push({...prod,qtd:1});
  }
  atualizarCarrinho();
  renderizar(produtos);
}

function quantidadeNoCarrinho(nome){
  const item = carrinho.find(i=>i.nome===nome);
  return item ? item.qtd : 0;
}

function atualizarCarrinho(){
  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contador");
  area.innerHTML = "";
  let total=0;
  let itensTotal=0;

  carrinho.forEach(i=>{
    const subtotal = i.preco*i.qtd;
    total+=subtotal;
    itensTotal+=i.qtd;

    area.innerHTML+=`
      <p>${i.nome}<br>
      ${i.qtd}x R$ ${i.preco.toFixed(2)}<br>
      Subtotal: R$ ${subtotal.toFixed(2)}</p>
    `;
  });

  contador.innerText=itensTotal;
  document.getElementById("total").innerText=`Total: R$ ${total.toFixed(2)}`;
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("ativo");
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("ativo");
}

function finalizarPedido(){
  let mensagem="✨ Pedido Odòmáiyà ✨\n\n🛍️ Itens:\n\n";
  let total=0;

  carrinho.forEach(i=>{
    const subtotal=i.preco*i.qtd;
    total+=subtotal;

    mensagem+=`• ${i.nome}\nQuantidade: ${i.qtd}\nValor unitário: R$ ${i.preco.toFixed(2)}\nSubtotal: R$ ${subtotal.toFixed(2)}\n\n`;
  });

  mensagem+=`💰 Total do Pedido: R$ ${total.toFixed(2)}\n\nAguardo confirmação e forma de pagamento.`;

  window.open(`https://wa.me/5554996048808?text=${encodeURIComponent(mensagem)}`);
}

function criarCategorias(){
  const categorias = [...new Set(produtos.map(p=>p.categoria))];
  const area = document.getElementById("categorias");

  categorias.forEach(cat=>{
    area.innerHTML+=`<button onclick="filtrarCategoria('${cat}')">${cat}</button>`;
  });
}

function filtrarCategoria(cat){
  renderizar(produtos.filter(p=>p.categoria===cat));
}

document.getElementById("ordenar").onchange = e=>{
  if(e.target.value==="menor"){
    renderizar([...produtos].sort((a,b)=>a.preco-b.preco));
  }
  if(e.target.value==="maior"){
    renderizar([...produtos].sort((a,b)=>b.preco-a.preco));
  }
};

document.getElementById("busca").oninput = e=>{
  const termo=e.target.value.toLowerCase();
  renderizar(produtos.filter(p=>p.nome.toLowerCase().includes(termo)));
};
