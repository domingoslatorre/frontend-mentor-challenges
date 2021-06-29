const invalidFormGroup = "page__form-group--invalid";

const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

document
  .querySelectorAll(".page__input")
  .forEach((input) => input.addEventListener("input", removeInvalidState));

document
  .getElementById("sign-up-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    validateNotEmpty(nameInput, "First Name");
    validateNotEmpty(lastNameInput, "Last Name");
    validateNotEmpty(emailInput, "Email");
    validateNotEmpty(passwordInput, "Password");
    validateMinMax(passwordInput, "Password", 6, 12);
  });

function validateNotEmpty(input, name) {
  if (input.value.trim() === "") {
    invalidateInput(input, `${name} cannot be empty`);
  }
}

function validateMinMax(input, name, min, max) {
  const value = input.value;
  if (value.length < min || value.length > max) {
    invalidateInput(
      input,
      `${name} must contain min of ${min} and max ${max} characters`
    );
  }
}

function invalidateInput(input, message) {
  const formGroup = input.parentNode;
  if (!formGroup.classList.contains(invalidFormGroup)) {
    formGroup.classList.add(invalidFormGroup);
    formGroup.insertBefore(createFeedbackNode(message), input.nextSibling);
  }
}

function createFeedbackNode(message) {
  const node = document.createElement("p");
  node.appendChild(document.createTextNode(message));
  node.classList.add("page__invalid-feedback");
  return node;
}

function removeInvalidState(event) {
  const formGroup = event.target.parentNode;
  if (formGroup.classList.contains(invalidFormGroup)) {
    formGroup.querySelector(".page__invalid-feedback").remove();
    formGroup.classList.remove(invalidFormGroup);
  }
}
