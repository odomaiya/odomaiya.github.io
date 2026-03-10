async function carregar(){

const data=await api("listar")

const tabela=document.getElementById("tabela")

tabela.innerHTML=""

data.forEach(p=>{

tabela.innerHTML+=`

<tr>

<td>${p.nome}</td>

<td>R$ ${p.preco}</td>

<td>${p.estoque}</td>

<td>

<button onclick="editar('${p.id}')">

Editar

</button>

</td>

</tr>

`

})

}

function novoProduto(){

const nome=prompt("Nome produto")

api("criar",{nome})

carregar()

}

carregar()
