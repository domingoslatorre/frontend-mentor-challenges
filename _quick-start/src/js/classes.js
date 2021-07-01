class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  get data() {
    return `${this.name} is ${this.age} years old`;
  }
}

export { Person };
