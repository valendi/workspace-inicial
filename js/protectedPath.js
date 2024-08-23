//En este archivo se chequea en todas las paginas protegidas si el usuario esta logueado

const isUserLogged = sessionStorage.getItem("loggedIn") === "true"; //Chequea si hay usuario logueado
const onLoginPage = window.location.href.endsWith("login.html"); //Chequea si estas en la pagina que termina con login.html

if (!isUserLogged && !onLoginPage) {
  //Si no hay usuario logueado ni estas en la pagina de login
  window.location.href = "login.html"; //Redirige al login
}
