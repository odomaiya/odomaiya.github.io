const API="https://script.google.com/macros/s/AKfycby-ZwdotFx3i40iMY_K3bWDYIPOLWtSS-t8rHUsELZ4AS9uoI8Pzey__In3PCspdFFD/exec"

function login(){

if(
document.getElementById("user").value=="adm" &&
document.getElementById("pass").value=="99861309"
){

login.style.display="none"
panel.style.display="block"

}else{
alert("Login inválido")
}

}

const drop=document.getElementById("dropArea")
const fileInput=document.getElementById("fileInput")

drop.onclick=()=>fileInput.click()

fileInput.onchange=e=>handleFiles(e.target.files)

drop.ondragover=e=>e.preventDefault()

drop.ondrop=e=>{
e.preventDefault()
handleFiles(e.dataTransfer.files)
}

async function handleFiles(files){

for(const file of files){

if(file.size>10*1024*1024){
alert("Imagem maior que 10MB")
continue
}

progress.innerHTML="Comprimindo imagem..."

const blob=await compressImage(file)

const base64=await toBase64(blob)

upload(base64)

}

}

function compressImage(file){

return new Promise(resolve=>{

const img=new Image()
const canvas=document.createElement("canvas")
const ctx=canvas.getContext("2d")

img.onload=()=>{

let w=img.width
let h=img.height

if(w>800){
h=h*(800/w)
w=800
}

canvas.width=w
canvas.height=h

ctx.drawImage(img,0,0,w,h)

canvas.toBlob(b=>resolve(b),"image/jpeg",0.8)

}

img.src=URL.createObjectURL(file)

})

}

function toBase64(blob){

return new Promise(resolve=>{

const reader=new FileReader()

reader.onloadend=()=>resolve(reader.result.split(",")[1])

reader.readAsDataURL(blob)

})

}

async function upload(base64){

progress.innerHTML="Enviando imagem..."

const res=await fetch(API,{
method:"POST",
body:JSON.stringify({
action:"uploadImagem",
image:base64
})
})

const data=await res.json()

progress.innerHTML="IA analisou o produto ✔"

criarFormulario(data)

}

function criarFormulario(data){

formArea.innerHTML+=`

<div class="produtoBox">

<img src="${data.imagem}" width="200">

<label>Nome</label>
<input class="nome" value="${data.nome}">

<label>Categoria</label>
<input class="categoria" value="${data.categoria}">

<label>Descrição</label>
<textarea class="descricao">${data.descricao}</textarea>

<label>Tags SEO</label>
<input class="tags" value="${data.tags}">

<label>Preço</label>
<input class="preco">

<label>Estoque</label>
<input class="estoque" value="0">

<select class="promocao">
<option value="false">Sem promoção</option>
<option value="true">Promoção</option>
</select>

<button onclick="salvarProduto(this)">
Salvar Produto
</button>

</div>
`

}

async function salvarProduto(btn){

const box=btn.closest(".produtoBox")

const produto={

nome:box.querySelector(".nome").value,
categoria:box.querySelector(".categoria").value,
descricao:box.querySelector(".descricao").value,
tags:box.querySelector(".tags").value,
preco:box.querySelector(".preco").value,
estoque:box.querySelector(".estoque").value,
promocao:box.querySelector(".promocao").value,
imagem:box.querySelector("img").src,
destaque:false

}

await fetch(API,{
method:"POST",
body:JSON.stringify({
action:"salvarProduto",
produto:produto
})
})

alert("Produto cadastrado!")

}
