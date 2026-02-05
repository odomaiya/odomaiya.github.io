const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?output=csv";
const WHATS = "5554996048808";
const CODIGO_ADMIN = "godoy2026";

let produtos = [];
let carrinho = {};
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
let clicks = 0;

/* ADMIN */
document.getElementById("topo").onclick = () => {
  clicks++;
  if (clicks === 10) {
    const c = prompt("Código administrador:");
    if (c === CODIGO_ADMIN) abrirAdmin();
    clicks = 0;
  }
};

async function carregar() {
  const res = await fetch(CSV_URL);
  const txt = await res.text();
  const linhas = txt.split("\n").slice(1);

  produtos = linhas.map(l=>{
    const [id,nome,preco,estoque,categoria,imagem,ativo] = l.split(",");
    return {id,nome,preco:+preco,estoque:+estoque,categoria,imagem,ativo};
  }).filter(p=>p.ativo?.trim()==="sim");

  criarCategorias();
  render(produtos);
}

function criarCategorias() {
  const cats = [...new Set(produtos.map(p=>p.categoria))];
  const area = document.getElementById("categorias");
  area.innerHTML = `<button onclick="render(produtos)">Todos</button>`;
  cats.forEach(c=>{
    area.innerHTML += `<button onclick="filtrar('${c}')">${c}</button>`;
  });
}

function filtrar(cat) {
  render(produtos.filter(p=>p.categoria===cat));
}

function render(lista) {
  const area = document.getElementById("produtos");
  area.innerHTML = "";
  lista.forEach(p=>{
    area.innerHTML += `
    <div class="card">
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      <div class="preco">R$ ${p.preco.toFixed(2)}</div>
      <div class="qtd">
        <button onclick="alterar(${p.id},-1)">-</button>
        <span id="q${p.id}">1</span>
        <button onclick="alterar(${p.id},1)">+</button>
      </div>
      <button class="add" onclick="add(${p.id})">Adicionar</button>
    </div>`;
  });
}

function alterar(id,v){
  const s=document.getElementById("q"+id);
  let n=+s.innerText+v;
  if(n<1)n=1;
  s.innerText=n;
}

function add(id){
  const p = produtos.find(x=>x.id==id);
  const qtd = +document.getElementById("q"+id).innerText;

  if (!carrinho[id]) {
    carrinho[id] = { ...p, qtd: 0 };
  }

  carrinho[id].qtd += qtd;
  atualizar();
}

function atualizar(){
  const total = Object.values(carrinho)
    .reduce((s,i)=>s+i.preco*i.qtd,0);

  document.getElementById("total").innerText =
    "R$ " + total.toFixed(2);
}

function finalizar(){
  let msg="🛍 Pedido Odòmáiyà\n\n";
  let total=0;

  Object.values(carrinho).forEach(i=>{
    msg+=`${i.nome} – ${i.qtd} unidade(s) – R$ ${(i.preco*i.qtd).toFixed(2)}\n`;
    total+=i.preco*i.qtd;
  });

  msg+=`\nTotal: R$ ${total.toFixed(2)}`;

  vendas.push(total);
  localStorage.setItem("vendas",JSON.stringify(vendas));

  window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`);
}

function abrirAdmin(){
  document.getElementById("admin").classList.remove("oculto");
  const total=vendas.reduce((s,v)=>s+v,0);
  document.getElementById("totalVendas").innerText="R$ "+total.toFixed(2);
  new Chart(document.getElementById("grafico"),{
    type:"bar",
    data:{labels:["Vendas"],datasets:[{data:[total]}]}
  });
}

function limparVendas(){
  if(confirm("Apagar histórico?")){
    localStorage.removeItem("vendas");
    location.reload();
  }
}

carregar();
