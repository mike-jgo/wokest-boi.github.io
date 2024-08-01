import { checkEmail, checkPass } from './validators.js';

const form = document.querySelector("form");
const eField = form.querySelector(".email"),
      eInput = eField.querySelector("input"),
      pField = form.querySelector(".password"),
      pInput = pField.querySelector("input");

form.onsubmit = (e) => {
  e.preventDefault(); // preventing form submission

  // if email and password are blank then add shake class else call specified function
  (eInput.value === "") ? eField.classList.add("shake", "error") : validateEmail();
  (pInput.value === "") ? pField.classList.add("shake", "error") : validatePassword();

  setTimeout(() => { // remove shake class after 500ms
    eField.classList.remove("shake");
    pField.classList.remove("shake");
  }, 500);

  eInput.onkeyup = () => { validateEmail(); }; // calling validateEmail function on email input keyup
  pInput.onkeyup = () => { validatePassword(); }; // calling validatePassword function on password input keyup

  function validateEmail() {
    const result = checkEmail(eInput.value);
    const errorTxt = eField.querySelector(".error-txt");
    if (result !== "Valid") {
      eField.classList.add("error");
      eField.classList.remove("valid");
      errorTxt.innerText = result;
    } else {
      eField.classList.remove("error");
      eField.classList.add("valid");
    }
  }

  function validatePassword() {
    const result = checkPass(pInput.value);
    if (result !== "Valid") {
      pField.classList.add("error");
      pField.classList.remove("valid");
    } else {
      pField.classList.remove("error");
      pField.classList.add("valid");
    }
  }

  // if eField and pField don't contain error class, user filled details properly
  if (!eField.classList.contains("error") && !pField.classList.contains("error")) {
    window.location.href = form.getAttribute("action"); // redirect user to specified URL in form action attribute
  }
}
