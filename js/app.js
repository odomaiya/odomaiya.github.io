const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv";

let produtos = [];
let carrinho = {};

const area = document.getElementById("produtos");
const totalEl = document.getElementById("total");
const categoriaEl = document.getElementById("categoria");
const loading = document.getElementById("loading");

Papa.parse(CSV_URL, {
  download: true,
  header: true,
  complete: res => {
    produtos = res.data
      .filter(p => p.nome && p.preco)
      .map(p => ({
        nome: p.nome,
        preco: Number(String(p.preco).replace(",", ".")),
        imagem: p.imagem,
        categoria: p.categoria || "Outros"
      }));

    montarCategorias();
    render(produtos);
    loading.remove();
  }
});

function montarCategorias() {
  const cats = ["Todos", ...new Set(produtos.map(p => p.categoria))];
  categoriaEl.innerHTML = cats.map(c =>
    `<option value="${c}">${c}</option>`
  ).join("");
}

function render(lista) {
  area.innerHTML = "";
  lista.forEach(p => {
    const qtd = carrinho[p.nome]?.qtd || 0;
    area.innerHTML += `
      <div class="card">
        <img src="${p.imagem}">
        <h4>${p.nome}</h4>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <div class="qtd">
          <button onclick="alterar('${p.nome}',-1)">-</button>
          <span>${qtd}</span>
          <button onclick="alterar('${p.nome}',1)">+</button>
        </div>
      </div>
    `;
  });
}

function alterar(nome, delta) {
  const prod = produtos.find(p => p.nome === nome);
  if (!carrinho[nome]) carrinho[nome] = { qtd: 0, preco: prod.preco };
  carrinho[nome].qtd += delta;
  if (carrinho[nome].qtd <= 0) delete carrinho[nome];
  atualizar();
}

function atualizar() {
  let total = 0;
  Object.values(carrinho).forEach(i => total += i.qtd * i.preco);
  totalEl.innerText = "R$ " + total.toFixed(2);
  aplicarFiltros();
}

function aplicarFiltros() {
  let lista = [...produtos];

  if (categoriaEl.value !== "Todos") {
    lista = lista.filter(p => p.categoria === categoriaEl.value);
  }

  const ord = document.getElementById("ordenar").value;
  if (ord === "menor") lista.sort((a,b)=>a.preco-b.preco);
  if (ord === "maior") lista.sort((a,b)=>b.preco-a.preco);

  render(lista);
}

categoriaEl.onchange = aplicarFiltros;
document.getElementById("ordenar").onchange = aplicarFiltros;

document.getElementById("finalizar").onclick = () => {
  let msg = "Olá! Gostaria de fazer o pedido:%0A";
  let total = 0;

  for (let n in carrinho) {
    msg += `- ${n}: ${carrinho[n].qtd} un.%0A`;
    total += carrinho[n].qtd * carrinho[n].preco;
  }

  msg += `%0ATotal: R$ ${total.toFixed(2)}`;
  window.open(`https://wa.me/5554996048808?text=${msg}`);
};
