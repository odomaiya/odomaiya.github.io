async function carregarAdmin(){

const produtos = await apiRequest("listarProdutos")

const tabela = document.getElementById("admin_produtos")

tabela.innerHTML=""

produtos.forEach((p,i)=>{

const tr=document.createElement("tr")

tr.innerHTML=`

<td>${p[0]}</td>
<td>${p[1]}</td>
<td>${p[5]}</td>

<td>

<button onclick="editar(${i})">
Editar
</button>

<button onclick="remover(${i+2})">
Excluir
</button>

</td>

`

tabela.appendChild(tr)

})

}

async function remover(row){

if(!confirm("Excluir produto?"))return

await apiRequest("excluirProduto",{row})

carregarAdmin()

}

async function salvarProduto(){

const produto={

nome:document.getElementById("nome").value,
preco:Number(document.getElementById("preco").value),
estoque:Number(document.getElementById("estoque").value),
categoria:document.getElementById("categoria").value,
descricao:document.getElementById("descricao").value,
tags:"",
imagem:"",
promocao:"",
destaque:"nao"

}

await apiRequest("salvarProduto",{produto})

alert("Produto salvo")

carregarAdmin()

}

async function gerarDescricao(){

const nome=document.getElementById("nome").value

const res = await apiRequest("sugerirRelacionados",{produto:nome})

document.getElementById("descricao").value =
JSON.stringify(res)

}

async function gerarImagem(){

const nome=document.getElementById("nome").value

const img = await apiRequest("gerarImagemProduto",{prompt:nome})

alert("Imagem gerada no servidor")

}

carregarAdmin()
