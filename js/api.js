const api = "https://script.google.com/macros/s/AKfycbzKW5BVJQBvZAdqV7CVfxgpqJEpp33l-sK-IYphC22AbLxBu04ML8D9l25fB5hktSty/exec"

async function apiRequest(action,data={}){

const res = await fetch(api,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
action,
...data
})
})

return res.json()

}
