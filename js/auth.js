"use strict";

const ADMIN_USER="adm"
const ADMIN_PASS="99861309"

function login(){

const user=document.getElementById("user").value
const pass=document.getElementById("pass").value

if(user===ADMIN_USER && pass===ADMIN_PASS){

localStorage.setItem("adminAuth","true")

window.location="admin.html"

}else{

alert("Login inválido")

}

}

function verificarAuth(){

const auth=localStorage.getItem("adminAuth")

if(auth!=="true"){

window.location="admin.html?login"

}

}

function logout(){

localStorage.removeItem("adminAuth")

window.location="/"

}
