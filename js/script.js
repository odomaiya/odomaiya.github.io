const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfMSS4eNDSyxy558PIJ3SbMeGWolSWa3hi5yzomDK6XYALEcdPM6s-toS0SFaZL-e-QC7jQvJVVcxW/pub?output=csv";

fetch(csvUrl)
  .then(res => res.text())
  .then(csv => montarLoja(csv));

function montarLoja(csv) {
  const linhas = csv.split("\n").slice(1);
  const produtos = [];
  const categorias = new Set();

  linhas.forEach(l => {
    const [
      id, nome, categoria, preco, desconto,
      estoque, imagem, destaque
    ] = l.split(",");

    if (!nome) return;

    categorias.add(categoria);

    produtos.push({
      nome,
      categoria,
      preco: Number(preco),
      desconto: Number(desconto),
      imagem,
      destaque
    });
  });

  criarFiltros([...categorias], produtos);
  renderizar(produtos);
}

function criarFiltros(categorias, produtos) {
  const filtros = document.getElementById("filtros");
  filtros.innerHTML = "";

  ["Todos", ...categorias].forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => {
      document.querySelectorAll("#filtros button").forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");

      const lista = cat === "Todos"
        ? produtos
        : produtos.filter(p => p.categoria === cat);

      renderizar(lista);
    };
    filtros.appendChild(btn);
  });
}

function renderizar(lista) {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "";

  const grupos = {};
  lista.forEach(p => {
    if (!grupos[p.categoria]) grupos[p.categoria] = [];
    grupos[p.categoria].push(p);
  });

  Object.keys(grupos).forEach(cat => {
    const sec = document.createElement("section");
    sec.className = "categoria";

    sec.innerHTML = <h2>${cat}</h2><div class="grid"></div>;
    const grid = sec.querySelector(".grid");

    grupos[cat].forEach(p => {
      const precoFinal = p.desconto > 0 ? p.preco - p.desconto : p.preco;

      grid.innerHTML += `
        <div class="card">
          ${p.destaque === "sim" ? '<div class="badge">Promoção</div>' : ''}
          <img src="${p.imagem}">
          <h3>${p.nome}</h3>
          <div class="preco">
            ${p.desconto > 0 ? <del>R$ ${p.preco}</del> : ""}
            <strong>R$ ${precoFinal.toFixed(2)}</strong>
          </div>
        </div>
      `;
    });

    conteudo.appendChild(sec);
  });
}
