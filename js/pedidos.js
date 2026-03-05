function salvarPedido(pedido){

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

pedidos.push(pedido)

localStorage.setItem("pedidos",JSON.stringify(pedidos))

}

function carregarPedidos(){

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

const lista = document.getElementById("lista-pedidos")

if(!lista) return

lista.innerHTML=""

pedidos.reverse().forEach(p=>{

lista.innerHTML += `

<tr>
<td>${p.data}</td>
<td>${p.total}</td>
<td>${p.endereco}</td>
</tr>

`

})

}
