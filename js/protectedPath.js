document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  
  if (!isLoggedIn) {
      window.location.href = "login.html";
  } else {
      const username = localStorage.getItem("username");
      if (username) {
          document.getElementById("displayUsername").textContent = `Cliente: ${username}`;
      }
  }
});
