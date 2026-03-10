const API="SEU_URL_APPS_SCRIPT"

function login(){

const u=document.getElementById("user").value
const p=document.getElementById("pass").value

if(u==="adm" && p==="99861309"){

document.getElementById("login").style.display="none"
document.getElementById("panel").style.display="block"

}else{
alert("login inválido")
}

}

const drop=document.getElementById("dropArea")
const fileInput=document.getElementById("fileInput")

drop.onclick=()=>fileInput.click()

fileInput.onchange=(e)=>handleFiles(e.target.files)

drop.ondrop=(e)=>{

e.preventDefault()
handleFiles(e.dataTransfer.files)

}

drop.ondragover=(e)=>e.preventDefault()


async function handleFiles(files){

for(const file of files){

if(file.size>10*1024*1024){

alert("imagem muito grande")
continue

}

const compressed=await compressImage(file)

uploadImage(compressed)

}

}

function compressImage(file){

return new Promise(resolve=>{

const img=new Image()
const canvas=document.createElement("canvas")
const ctx=canvas.getContext("2d")

img.onload=function(){

const max=800

let w=img.width
let h=img.height

if(w>max){

h=h*(max/w)
w=max

}

canvas.width=w
canvas.height=h

ctx.drawImage(img,0,0,w,h)

canvas.toBlob(blob=>resolve(blob),"image/jpeg",0.8)

}

img.src=URL.createObjectURL(file)

})

}

async function uploadImage(blob){

const form=new FormData()
form.append("action","uploadImagem")
form.append("file",blob)

const res=await fetch(API,{
method:"POST",
body:form
})

const data=await res.json()

gerarFormulario(data)

}

function gerarFormulario(data){

const area=document.getElementById("formArea")

area.innerHTML+=`

<div class="formProduto">

<img src="${data.imagem}" width="150">

<input id="nome" value="${data.nome}">
<input id="categoria" value="${data.categoria}">

<textarea id="descricao">${data.descricao}</textarea>

<input id="tags" value="${data.tags}">

<input id="preco" placeholder="Preço">

<input id="estoque" value="0">

<select id="promocao">
<option value="false">Sem promoção</option>
<option value="true">Promoção</option>
</select>

<button onclick="salvarProduto()">Salvar Produto</button>

</div>

`

}

async function salvarProduto(){

const produto={

nome:document.getElementById("nome").value,
preco:document.getElementById("preco").value,
promocao:document.getElementById("promocao").value,
categoria:document.getElementById("categoria").value,
imagem:document.querySelector(".formProduto img").src,
estoque:document.getElementById("estoque").value,
descricao:document.getElementById("descricao").value,
tags:document.getElementById("tags").value

}

await fetch(API,{
method:"POST",
body:JSON.stringify({
action:"salvarProduto",
produto:produto
})
})

alert("Produto criado!")

}
