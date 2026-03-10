const API="https://script.google.com/macros/s/AKfycbzKW5BVJQBvZAdqV7CVfxgpqJEpp33l-sK-IYphC22AbLxBu04ML8D9l25fB5hktSty/exec"

async function api(action,data){

const res=await fetch(API,{
method:"POST",
body:JSON.stringify({
action,
data
})
})

return await res.json()

}
