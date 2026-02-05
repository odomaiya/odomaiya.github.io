const numeroWhats = "5554996048808";

const produtos = [
  {
    nome: "Guia de Oxum",
    preco: 45,
    imagem: "https://via.placeholder.com/400x300"
  },
  {
    nome: "Colar de Exu",
    preco: 60,
    imagem: "https://via.placeholder.com/400x300"
  }
];

const area = document.getElementById("produtos");

function renderizar(lista) {
  area.innerHTML = "";
  lista.forEach(p => {
    area.innerHTML += `
      <div class="card">
        <img src="${p.imagem}" alt="${p.nome}">
        <h4>${p.nome}</h4>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <button onclick="comprar('${p.nome}')">Comprar pelo WhatsApp</button>
      </div>
    `;
  });
}

function comprar(nome) {
  const msg = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${nome}`
  );
  window.open(`https://wa.me/${numeroWhats}?text=${msg}`, "_blank");
}

document.getElementById("ordenar").addEventListener("change", e => {
  if (e.target.value === "menor") {
    renderizar([...produtos].sort((a,b)=>a.preco-b.preco));
  }
  if (e.target.value === "maior") {
    renderizar([...produtos].sort((a,b)=>b.preco-a.preco));
  }
});

renderizar(produtos);
