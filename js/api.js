const API_URL = "https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec";

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
