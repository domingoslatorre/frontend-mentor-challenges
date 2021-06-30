class FormGroup {
  constructor(name, input, validations) {
    this._name = name;
    this._input = input;
    this._validations = validations;
    this._errors = [];
  }

  get name() {
    return this._name;
  }

  get input() {
    return this._input;
  }

  get validations() {
    return this._validations;
  }

  get errors() {
    return this._errors;
  }

  get value() {
    return this._input.value.trim();
  }

  get parent() {
    return this._input.parentNode;
  }

  addError(error) {
    this._errors.push(error);
  }

  removeErrors() {
    this._errors = [];
  }
}

const querySelector = document.querySelector.bind(document);

class Form {
  constructor() {
    this._formGroups = [
      new FormGroup("First Name", querySelector("#firstname"), ["not-empty"]),
      new FormGroup("Last Name", querySelector("#lastname"), ["not-empty"]),
      new FormGroup("Email", querySelector("#email"), ["not-empty", "valid-email"]),
      new FormGroup("Password", querySelector("#password"), ["not-empty"]),
    ];
  }

  get formGroups() {
    return this._formGroups;
  }

  get errors() {
    return this._formGroups.map((formGroup) => formGroup.errors).flat();
  }

  validate() {
    this._clearErrors();
    this._formGroups.forEach((formGroup) => {
      formGroup.validations.forEach((validation) => {
        if (validation === "not-empty") this._notEmptyValidation(formGroup);
        if (validation === "valid-email") this._validEmailValidation(formGroup);
      });
    });
  }

  removeInvalidState(input) {
    const formGroup = this._formGroups.find((formGroup) => formGroup.input == input);
    formGroup.removeErrors();
  }

  _clearErrors() {
    this._formGroups.forEach((formGroup) => formGroup.removeErrors());
  }

  _notEmptyValidation(formGroup) {
    if (formGroup.value === "") {
      formGroup.addError({
        formGroup: formGroup,
        message: `${formGroup.name} cannot be empty`,
      });
    }
  }

  _validEmailValidation(formGroup) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(formGroup.value)) {
      formGroup.addError({
        formGroup: formGroup,
        message: "Looks like this is not an email",
      });
    }
  }
}

class FormView {
  constructor(form) {
    this._form = form;
  }

  get invalidFormGroupClass() {
    return "page__form-group--invalid";
  }

  get invalidFormFeedbackClass() {
    return "page__invalid-feedback";
  }

  update() {
    this._clear();
    this._form.errors.map(({ formGroup, message }) => {
      formGroup.parent.classList.add(this.invalidFormGroupClass);
      formGroup.parent.insertBefore(this._createFeedbackElement(message), formGroup.input.nextSibling);
    });
  }

  _clear() {
    this._form.formGroups.forEach((formGroup) => {
      formGroup.parent.querySelectorAll(`.${this.invalidFormFeedbackClass}`).forEach((node) => node.remove());
      formGroup.parent.classList.remove(this.invalidFormGroupClass);
    });
  }

  _createFeedbackElement(message) {
    const element = document.createElement("p");
    element.appendChild(document.createTextNode(message));
    element.classList.add(this.invalidFormFeedbackClass);
    return element;
  }
}

class FormController {
  constructor(form) {
    this._form = form;
    this._formView = new FormView(form);
  }

  submit(event) {
    event.preventDefault();
    this._form.validate();
    this._formView.update();
  }

  input(event) {
    this._form.removeInvalidState(event.target);
    this._formView.update();
  }
}

const formController = new FormController(new Form());
document.querySelector(".page__form").addEventListener("submit", formController.submit.bind(formController));
document
  .querySelectorAll(".page__input")
  .forEach((input) => input.addEventListener("input", formController.input.bind(formController)));

// -> Get job done! Without Object Oriented :)
// const invalidFormGroup = "page__form-group--invalid";
// const firstNameInput = document.getElementById("firstname");
// const lastNameInput = document.getElementById("lastname");
// const emailInput = document.getElementById("email");
// const passwordInput = document.getElementById("password");

// document
//   .querySelectorAll(".page__input")
//   .forEach((input) => input.addEventListener("input", removeInvalidState));

// document
//   .querySelector(".page__form")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();
//     validateNotEmpty(firstNameInput, "First Name");
//     validateNotEmpty(lastNameInput, "Last Name");
//     validateNotEmpty(emailInput, "Email");
//     validateNotEmpty(passwordInput, "Password");
//     validateMinMax(passwordInput, "Password", 6, 12);
//   });

// function validateNotEmpty(input, name) {
//   if (input.value.trim() === "") {
//     invalidateInput(input, `${name} cannot be empty`);
//   }
// }

// function validateMinMax(input, name, min, max) {
//   const value = input.value;
//   if (value.length < min || value.length > max) {
//     invalidateInput(
//       input,
//       `${name} must contain min of ${min} and max ${max} characters`
//     );
//   }
// }

// function invalidateInput(input, message) {
//   const formGroup = input.parentNode;
//   if (!formGroup.classList.contains(invalidFormGroup)) {
//     formGroup.classList.add(invalidFormGroup);
//     formGroup.insertBefore(createFeedbackNode(message), input.nextSibling);
//   }
// }

// function createFeedbackNode(message) {
//   const node = document.createElement("p");
//   node.appendChild(document.createTextNode(message));
//   node.classList.add("page__invalid-feedback");
//   return node;
// }

// function removeInvalidState(event) {
//   const formGroup = event.target.parentNode;
//   if (formGroup.classList.contains(invalidFormGroup)) {
//     formGroup.querySelector(".page__invalid-feedback").remove();
//     formGroup.classList.remove(invalidFormGroup);
//   }
// }
