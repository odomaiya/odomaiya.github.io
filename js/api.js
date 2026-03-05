async function fetchProdutos(){

const res=await fetch(API_URL)

const data=await res.json()

return data

}
