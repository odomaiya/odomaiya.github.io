const API = "https://script.google.com/macros/s/AKfycbzKW5BVJQBvZAdqV7CVfxgpqJEpp33l-sK-IYphC22AbLxBu04ML8D9l25fB5hktSty/exec"
/************************************************
 LISTAR PRODUTOS
************************************************/

async function carregarProdutos(){

const res = await fetch(API,{
method:"POST",
body:JSON.stringify({
action:"listarProdutos"
})
})

const data = await res.json()

const tabela = document.getElementById("listaProdutos")

tabela.innerHTML=""

data.forEach(p=>{

const tr = document.createElement("tr")

tr.innerHTML=`

<td>
<img src="${p[4]}" width="60">
</td>

<td>${p[0]}</td>

<td>${p[3]}</td>

<td>${p[1]}</td>

<td>${p[5]}</td>

`

tabela.appendChild(tr)

})

document.getElementById("totalProdutos").innerText = data.length

}

carregarProdutos()



/************************************************
 DRAG DROP
************************************************/

const dropzone = document.getElementById("dropzone")

dropzone.addEventListener("dragover",e=>{
e.preventDefault()
})

dropzone.addEventListener("drop",async e=>{

e.preventDefault()

const file = e.dataTransfer.files[0]

const reader = new FileReader()

reader.onload = async function(){

const base64 = reader.result.split(",")[1]

const res = await fetch(API,{
method:"POST",
body:JSON.stringify({

action:"uploadImagem",
image:base64

})
})

const produto = await res.json()

criarProduto(produto)

}

reader.readAsDataURL(file)

})



/************************************************
 SALVAR PRODUTO
************************************************/

async function criarProduto(produto){

produto.preco = 0
produto.estoque = 10
produto.destaque = "nao"

await fetch(API,{
method:"POST",
body:JSON.stringify({
action:"salvarProduto",
produto:produto
})
})

carregarProdutos()

}



/************************************************
 IMPORTAR DRIVE
************************************************/

async function importarDrive(){

await fetch(API,{
method:"POST",
body:JSON.stringify({
action:"importarDrive"
})
})

alert("Importação concluída")

carregarProdutos()

}



/************************************************
 GERAR BANNER IA
************************************************/

async function gerarBanner(){

const prompt = document.getElementById("promptBanner").value

const res = await fetch(API,{
method:"POST",
body:JSON.stringify({

action:"gerarBanner",
prompt:prompt

})
})

const data = await res.json()

const img = data.data[0].url

document.getElementById("banner").innerHTML = `
<img src="${img}" width="100%">
`

}alert("produto salvo")

}

carregar()
