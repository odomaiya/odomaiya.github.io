function gerarRecomendacoes(produtos){

let embaralhado=[...produtos].sort(()=>0.5-Math.random())

return embaralhado.slice(0,4)

}
