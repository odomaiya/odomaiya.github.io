const CSV =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?output=csv";

const WHATS = "5554996048808";

let produtos = [];
let carrinho = {};

Papa.parse(CSV,{
  download:true,
  header:true,
  complete:(r)=>{
    produtos = r.data.filter(p=>p.ativo==="sim");
    criarCategorias();
    render(produtos);
  }
});

function criarCategorias(){
  const area=document.getElementById("categorias");
  const cats=[...new Set(produtos.map(p=>p.categoria))];
  area.innerHTML=`<button onclick="render(produtos)">Todos</button>`;
  cats.forEach(c=>{
    area.innerHTML+=`<button onclick="render(produtos.filter(p=>p.categoria==='${c}'))">${c}</button>`;
  });
}

function render(lista){
  const area=document.getElementById("produtos");
  area.innerHTML="";
  lista.forEach(p=>{
    area.innerHTML+=`
    <div class="card">
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      <div class="preco">R$ ${Number(p.preco).toFixed(2)}</div>
      <div class="qtd">
        <button onclick="alt('${p.id}',-1)">-</button>
        <span id="q${p.id}">1</span>
        <button onclick="alt('${p.id}',1)">+</button>
      </div>
      <button class="add" onclick="add('${p.id}')">Adicionar</button>
    </div>`;
  });
}

function alt(id,v){
  const s=document.getElementById("q"+id);
  let n=+s.innerText+v;
  if(n<1)n=1;
  s.innerText=n;
}

function add(id){
  const p=produtos.find(x=>x.id===id);
  const q=+document.getElementById("q"+id).innerText;
  if(!carrinho[id]) carrinho[id]={...p,qtd:0};
  carrinho[id].qtd+=q;
  atualizar();
}

function atualizar(){
  let t=0;
  Object.values(carrinho).forEach(i=>t+=i.qtd*i.preco);
  document.getElementById("total").innerText="R$ "+t.toFixed(2);
}

function finalizar(){
  let msg="🛍 Pedido Odòmáiyà\n\n";
  let t=0;
  Object.values(carrinho).forEach(i=>{
    msg+=`${i.nome} – ${i
