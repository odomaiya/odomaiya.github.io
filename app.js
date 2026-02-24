const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv";

let produtos = [];
let carrinho = {};

async function carregarProdutos(){
    const res = await fetch(CSV_URL);
    const texto = await res.text();

    const linhas = texto.split("\n").slice(1);

    produtos = linhas.map(linha => {
        const col = linha.split(",");

        return {
            nome: col[0]?.trim(),
            preco: parseFloat(col[1]?.replace("R$","").replace(",",".").trim()) || 0,
            categoria: col[2]?.trim(),
            imagem: col[3]?.trim(),
            estoque: parseInt(col[4]) || 0
        };
    });

    renderizarProdutos(produtos);
}

function renderizarProdutos(lista){
    const container = document.getElementById("produtos");
    container.innerHTML = "";

    lista.forEach((p,i)=>{
        const div = document.createElement("div");
        div.className = "produto-card";

        div.innerHTML = `
            <img src="${p.imagem}" width="100%" height="150" style="object-fit:cover;border-radius:12px">
            <h3>${p.nome}</h3>
            <div class="preco">R$ ${p.preco.toFixed(2)}</div>
            <div>Restam ${p.estoque}</div>
            <div class="contador">
                <button onclick="alterarQtd(${i}, -1)">-</button>
                <span id="qtd-${i}">0</span>
                <button onclick="alterarQtd(${i}, 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function alterarQtd(index, valor){
    const produto = produtos[index];
    if(!carrinho[index]) carrinho[index]=0;

    carrinho[index]+=valor;

    if(carrinho[index]<0) carrinho[index]=0;
    if(carrinho[index]>produto.estoque) carrinho[index]=produto.estoque;

    document.getElementById(`qtd-${index}`).innerText = carrinho[index];
}

function finalizarPedido(){

    const nome = prompt("Digite seu nome:");
    if(!nome){
        alert("Nome é obrigatório.");
        return;
    }

    const tipo = prompt("Digite 1 para Retirada ou 2 para Entrega:");
    if(tipo!=="1" && tipo!=="2"){
        alert("Escolha válida obrigatória.");
        return;
    }

    let endereco="";
    if(tipo==="2"){
        endereco = prompt("Digite seu endereço completo:");
        if(!endereco){
            alert("Endereço obrigatório para entrega.");
            return;
        }
    }

    const pagamento = prompt("Forma de pagamento (Crédito, Débito, Dinheiro ou Pix):");
    if(!pagamento){
        alert("Informe a forma de pagamento.");
        return;
    }

    let mensagem = `*Pedido - Odòmáiyà Artigos Religiosos*%0A`;
    mensagem += `Cliente: ${nome}%0A`;

    if(tipo==="1"){
        mensagem += "Retirada na loja%0A";
    }else{
        mensagem += `Entrega: ${endereco}%0A`;
        mensagem += "Taxa de entrega será informada.%0A";
    }

    mensagem += `Pagamento: ${pagamento}%0A%0A`;
    mensagem += "*Itens:*%0A";

    let total=0;

    Object.keys(carrinho).forEach(i=>{
        if(carrinho[i]>0){
            const p = produtos[i];
            mensagem += `${p.nome} x${carrinho[i]}%0A`;
            total += p.preco * carrinho[i];
        }
    });

    mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

    if(total===0){
        alert("Seu carrinho está vazio.");
        return;
    }

    const telefone = "555496048808";
    window.open(`https://wa.me/${telefone}?text=${mensagem}`,"_blank");

    mostrarSucesso();
}

carregarProdutos();
