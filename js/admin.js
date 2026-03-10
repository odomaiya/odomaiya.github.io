const API="https://script.google.com/macros/s/AKfycby-ZwdotFx3i40iMY_K3bWDYIPOLWtSS-t8rHUsELZ4AS9uoI8Pzey__In3PCspdFFD/exec"

/* carregar dashboard */

async function carregar(){

const res=await fetch(API,{
method:"POST",
body:JSON.stringify({action:"listarProdutos"})
})

const data=await res.json()

totalProdutos.innerText=data.length

let baixo=0

data.forEach(p=>{
if(p.estoque<5) baixo++
})

estoqueBaixo.innerText=baixo

}

/* drag drop */

const drop=document.getElementById("drop")

drop.ondragover=e=>e.preventDefault()

drop.ondrop=e=>{

e.preventDefault()

const file=e.dataTransfer.files[0]

upload(file)

}

function upload(file){

const reader=new FileReader()

reader.onload=async ()=>{

const base64=reader.result.split(",")[1]

const res=await fetch(API,{
method:"POST",
body:JSON.stringify({
action:"uploadImagem",
image:base64
})
})

const data=await res.json()

mostrarFormulario(data)

}

reader.readAsDataURL(file)

}

function mostrarFormulario(data){

form.innerHTML=`

<h3>${data.analise.nome}</h3>

<input id="nome" value="${data.analise.nome}">
<input id="categoria" value="${data.analise.categoria}">
<textarea id="descricao">${data.analise.descricao}</textarea>

<button onclick="salvar()">Salvar</button>

`

}

async function salvar(){

const produto={

nome:nome.value,
categoria:categoria.value,
descricao:descricao.value,
preco:0,
estoque:10

}

await fetch(API,{
method:"POST",
body:JSON.stringify({
action:"salvarProduto",
produto:produto
})
})

alert("produto salvo")

}

carregar()
