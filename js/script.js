alert("SCRIPT CARREGADO");
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfMSS4eNDSyxy558PIJ3SbMeGWolSWa3hi5yzomDK6XYALEcdPM6s-toS0SFaZL-e-QC7jQvJVVcxW/pub?gid=0&single=true&output=csv";

fetch(csvUrl)
  .then(r => r.text())
  .then(csv => {
    const linhas = csv.trim().split("\n").slice(1);
    const produtos = document.getElementById("produtos");

    let categorias = {};

    linhas.forEach(linha => {
      const [
        id,
        nome,
        categoria,
        preco,
        desconto,
        estoque,
        imagem,
        destaque
      ] = linha.split(",");

      if (!nome) return;

      if (!categorias[categoria]) {
        categorias[categoria] = [];
      }

      categorias[categoria].push({
        nome,
        categoria,
        preco: Number(preco),
        desconto: Number(desconto),
        estoque,
        imagem,
        destaque
      });
    });

    Object.keys(categorias).forEach(cat => {
      const sec = document.createElement("section");
      sec.className = "categoria";

      sec.innerHTML = <h2>${cat}</h2><div class="grid"></div>;
      const grid = sec.querySelector(".grid");

      categorias[cat].forEach(p => {
        const precoFinal = p.desconto > 0
          ? (p.preco - p.desconto).toFixed(2)
          : p.preco.toFixed(2);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          ${p.destaque === "sim" ? <span class="promo">Promoção</span> : ""}
          <img src="${p.imagem}" alt="${p.nome}">
          <h3>${p.nome}</h3>
          <p class="preco">
            ${p.desconto > 0 ? <del>R$ ${p.preco.toFixed(2)}</del> : ""}
            <strong>R$ ${precoFinal}</strong>
          </p>
        `;

        grid.appendChild(card);
      });

      produtos.appendChild(sec);
    });
  })
  .catch(err => {
    document.getElementById("produtos").innerHTML =
      "<p>Erro ao carregar produtos</p>";
    console.error(err);
  });
