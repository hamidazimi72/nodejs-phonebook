import inquirer from "inquirer";

import Contact from "./contact.js";
import DB from "./db.js";

export default class Actions {
  static list = async () => {
    const list = await Contact.fetchAll();

    if (list.length) {
      console.table(list);
    } else {
      console.log("Contact list is empty!");
    }
  };

  static add = async () => {
    let answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter name:",
        validate: (value) => {
          if (typeof value !== "string" || value.length < 3) {
            throw new Error("name must is number and contain at 11 char!");
          }
          return true;
        },
      },
      {
        type: "input",
        name: "phone",
        message: "Enter phone number:",
        validate: (value) => {
          if (!/^[0-9]{11}$/.test(value)) {
            throw new Error("phone number must equal to 11 number!");
          }
          return true;
        },
      },
    ]);

    try {
      let contact = new Contact(answers?.name, answers?.phone);
      if (contact.save()) console.log("Contact added is successfully!");
    } catch (err) {
      throw new Error(err.message);
    }
  };

  static edit = async () => {
    const list = Contact.fetchAll();
    const choices = list.map((c) => c.name);

    let selectedItem = await inquirer.prompt({
      type: "list",
      name: "contact",
      message: "Select contact:",
      choices,
    });

    let item = await Contact.fetchByName(selectedItem?.contact);
    console.log(item);

    let answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter name:",
        default: item?.name,
        validate: (value) => {
          if (typeof value !== "string" || value.length < 3) {
            throw new Error("name must is number and contain at 11 char!");
          }
          return true;
        },
      },
      {
        type: "input",
        name: "phone",
        message: "Enter phone number:",
        default: item?.phone,
        validate: (value) => {
          if (!/^[0-9]{11}$/.test(value)) {
            throw new Error("phone number must equal to 11 number!");
          }
          return true;
        },
      },
    ]);
    try {
      let contact = new Contact(answers?.name, answers?.phone);
      if (contact.save()) console.log("Contact updated is successfully!");
    } catch (err) {
      throw new Error(err.message);
    }
  };
  static remove = () => {};
  static removeAll = () => {};
  static exportFile = () => {};
  static importFile = () => {};
}
