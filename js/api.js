const API_URL = "COLE_AQUI_SUA_URL_WEB_APP";

const API = {

async getProdutos(){
const r = await fetch(`${API_URL}?action=getProdutos`);
return await r.json();
},

async registrarVenda(data){
await fetch(API_URL,{
method:"POST",
body:JSON.stringify(data)
});
}

};
