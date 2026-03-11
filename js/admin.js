async function salvar(){

const produto={

nome:document.getElementById("nome").value,
preco:document.getElementById("preco").value,
categoria:document.getElementById("categoria").value,
imagem:document.getElementById("imagem").value,
estoque:document.getElementById("estoque").value,
descricao:document.getElementById("descricao").value

}

await salvarProduto(produto)

alert("Produto salvo com sucesso!")

limpar()

}

function limpar(){

document.querySelectorAll("input, textarea")
.forEach(el=>el.value="")

}
