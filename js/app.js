const CSV_URL = "COLE_AQUI_SEU_LINK_CSV";

let produtos = [];
let carrinho = {};

const area = document.getElementById("produtos");
const totalEl = document.getElementById("total");
const categoriaSelect = document.getElementById("categoria");

Papa.parse(CSV_URL, {
  download: true,
  header: true,
  complete: res => {
    produtos = res.data
      .filter(p => p.nome && p.preco)
      .map(p => ({
        ...p,
        preco: Number(String(p.preco).replace(",", ".")),
        categoria: p.categoria || "Outros"
      }));

    montarCategorias();
    render(produtos);
  }
});

function montarCategorias() {
  const cats = ["todos", ...new Set(produtos.map(p => p.categoria))];
  categoriaSelect.innerHTML = cats.map(c =>
    `<option value="${c}">${c}</option>`
  ).join("");
}

function render(lista) {
  area.innerHTML = "";
  lista.forEach(p => {
    area.innerHTML += `
      <div class="card">
        <img src="${p.imagem}">
        <h4>${p.nome}</h4>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>

        <div class="quantidade">
          <button onclick="alterar('${p.nome}', -1)">-</button>
          <span>${carrinho[p.nome]?.qtd || 0}</span>
          <button onclick="alterar('${p.nome}', 1)">+</button>
        </div>
      </div>
    `;
  });
}

function alterar(nome, delta) {
  if (!carrinho[nome]) carrinho[nome] = { qtd: 0, preco: produtos.find(p=>p.nome===nome).preco };
  carrinho[nome].qtd += delta;
  if (carrinho[nome].qtd <= 0) delete carrinho[nome];
  atualizar();
}

function atualizar() {
  let total = 0;
  Object.values(carrinho).forEach(i => total += i.qtd * i.preco);
  totalEl.innerText = "R$ " + total.toFixed(2);
  render(filtrar());
}

function filtrar() {
  let lista = [...produtos];

  if (categoriaSelect.value !== "todos") {
    lista = lista.filter(p => p.categoria === categoriaSelect.value);
  }

  const ord = document.getElementById("ordenar").value;
  if (ord === "menor") lista.sort((a,b)=>a.preco-b.preco);
  if (ord === "maior") lista.sort((a,b)=>b.preco-a.preco);

  return lista;
}

document.getElementById("ordenar").addEventListener("change", atualizar);
categoriaSelect.addEventListener("change", atualizar);

document.getElementById("finalizar").onclick = () => {
  let msg = "Olá! Gostaria de fazer o pedido:%0A";
  let total = 0;

  for (let nome in carrinho) {
    const i = carrinho[nome];
    msg += `- ${nome}: ${i.qtd} un.%0A`;
    total += i.qtd * i.preco;
  }

  msg += `%0ATotal: R$ ${total.toFixed(2)}`;
  window.open(`https://wa.me/5554996048808?text=${msg}`);
};
