document.addEventListener("DOMContentLoaded", function () {
  const emailEl = document.getElementById("email");
  const pwEl = document.getElementById("password");

  const loginBtn = document.getElementById("loginBtn");
  const guestBtn = document.getElementById("guestBtn");
  const signupBtn = document.getElementById("signupBtn");
  const forgotBtn = document.getElementById("forgotBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const emailValid = emailEl && emailEl.checkValidity();
      const pwValid = pwEl && pwEl.checkValidity();

      if (emailValid === true && pwValid === true) {
        window.location.href = "home.html";
        return;
      }

      if (emailValid === false && emailEl) {
        emailEl.reportValidity();
      }
      if (pwValid === false && pwEl) {
        pwEl.reportValidity();
      }
    });
  }

  if (guestBtn) {
    guestBtn.addEventListener("click", function () {
      window.location.href = "home.html?guest=true";
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", function () {
      window.location.href = "signup.html";
    });
  }

  if (forgotBtn) {
    forgotBtn.addEventListener("click", function () {
      window.location.href = "forgot.html";
    });
  }
});