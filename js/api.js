const api = "https://script.google.com/macros/s/AKfycbzKW5BVJQBvZAdqV7CVfxgpqJEpp33l-sK-IYphC22AbLxBu04ML8D9l25fB5hktSty/exec"

async function listarProdutos(){

const res = await fetch(API_URL+"?action=produtos")

return await res.json()

}

async function salvarProduto(produto){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"salvar",
produto:produto
})
})

}

function enviarWhatsApp(produto){

const numero="5599999999999"

const mensagem =
`Olá! Tenho interesse no produto:

${produto.nome}

Valor: R$ ${produto.preco}`

window.open(
`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
"_blank"
)

}
