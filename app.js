const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

async function carregarProdutos() {
  try {
    const response = await fetch(urlCSV);
    const texto = await response.text();

    const linhas = texto.trim().split("\n");
    const cabecalho = linhas.shift().split(",");

    produtos = linhas.map(linha => {
      const colunas = linha.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

      return {
        nome: colunas[1]?.replace(/"/g, "") || "",
        preco: parseFloat(colunas[2]) || 0,
        categoria: colunas[3]?.replace(/"/g, "") || "Geral",
        imagem: colunas[4]?.replace(/"/g, "") || ""
      };
    });

    renderizar(produtos);
    criarCategorias();

  } catch (erro) {
    document.getElementById("produtos").innerHTML =
      "<p style='padding:20px'>Erro ao carregar produtos. Verifique a planilha.</p>";
    console.error(erro);
  }
}

carregarProdutos();
