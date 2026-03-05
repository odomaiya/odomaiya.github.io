async function carregarAdmin(){

let produtos=await fetchProdutos()

const tabela=document.getElementById("tabela")

tabela.innerHTML=""

produtos.forEach(p=>{

tabela.innerHTML+=`

<tr>

<td>${p.id}</td>
<td>${p.nome}</td>
<td>${p.preco}</td>
<td>${p.estoque}</td>

</tr>

`

})

}

carregarAdmin()
