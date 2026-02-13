const emailEl = document.getElmemetById("email");
const pwEl = document.getElementById("password");

document.getElementById("loginBtn").addEventListener("click", (e) => { e.preventDefault();

  if(!emailEl.checkValidity()){
    emailEl.reportValidity();
    return;
  }

  if(!pwEl.checkValidity()) {
    pwEl.reportValidity();
    return;
  }

  window.location.href = "home.html";
});

document.getElementById("guestBtn").addEventListener("click", () => {
  window.location.href = "home.html?guest=true";
});

document.getElementById("signupBtn").addEventListener("click", () => {
  window.location.href = "signup.html";
});

document.getElementById("forgotBtn").addEventListener("click", () => {
  window.location.href = "forgot.html";
});