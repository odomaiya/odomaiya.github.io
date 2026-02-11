const url = "COLE_AQUI_SEU_LINK_CSV";

let produtos = [];
let carrinho = [];

async function carregarProdutos() {
  const res = await fetch(url);
  const text = await res.text();
  const linhas = text.split("\n").slice(1);

  produtos = linhas.map(l => {
    const c = l.split(",");
    return {
      nome: c[0],
      preco: parseFloat(c[1]),
      categoria: c[2],
      imagens: c.slice(3).filter(i => i)
    };
  });

  popularCategorias();
  mostrarProdutos(produtos);
}

function mostrarProdutos(lista) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <div class="slider">
          ${p.imagens.map(img => 
            `<img src="${img}" onclick="abrirModal('${img}')">`
          ).join("")}
        </div>
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco.toFixed(2)}</p>
        <button onclick="adicionar('${p.nome}', ${p.preco})">Adicionar</button>
      </div>
    `;
  });
}

function buscarProduto() {
  const termo = document.getElementById("busca").value.toLowerCase();
  const filtrado = produtos.filter(p => 
    p.nome.toLowerCase().includes(termo)
  );
  mostrarProdutos(filtrado);
}

function popularCategorias() {
  const select = document.getElementById("categoriaFiltro");
  const categorias = [...new Set(produtos.map(p => p.categoria))];

  categorias.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function filtrarCategoria() {
  const valor = document.getElementById("categoriaFiltro").value;
  if (valor === "todos") return mostrarProdutos(produtos);
  const filtrado = produtos.filter(p => p.categoria === valor);
  mostrarProdutos(filtrado);
}

function ordenarProdutos() {
  const valor = document.getElementById("ordenar").value;
  let lista = [...produtos];

  if (valor === "menor") lista.sort((a,b)=>a.preco-b.preco);
  if (valor === "maior") lista.sort((a,b)=>b.preco-a.preco);

  mostrarProdutos(lista);
}

function adicionar(nome, preco) {
  const item = carrinho.find(p=>p.nome===nome);
  if(item) item.qtd++;
  else carrinho.push({nome,preco,qtd:1});
  atualizarCarrinho();
}

function atualizarCarrinho(){
  const container = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contador");
  const totalEl = document.getElementById("total");

  container.innerHTML="";
  let total=0, qtdTotal=0;

  carrinho.forEach(i=>{
    const sub=i.preco*i.qtd;
    total+=sub;
    qtdTotal+=i.qtd;

    container.innerHTML+=`
      <p>${i.nome} (${i.qtd}) - R$ ${sub.toFixed(2)}</p>
    `;
  });

  contador.innerText=qtdTotal;
  totalEl.innerText="Total: R$ "+total.toFixed(2);
}

function toggleCarrinho(){
  document.getElementById("carrinho").classList.toggle("ativo");
}

function abrirModal(img){
  document.getElementById("modalImg").src=img;
  document.getElementById("modal").classList.add("ativo");
}

function fecharModal(){
  document.getElementById("modal").classList.remove("ativo");
}

function scrollToProdutos(){
  document.getElementById("produtos").scrollIntoView({behavior:"smooth"});
}

carregarProdutos();
