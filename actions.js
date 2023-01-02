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
    const choices = ["Family", "Friend", "Work", "Other"];

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
      {
        type: "list",
        name: "group",
        message: "Select group:",
        choices,
      },
    ]);

    try {
      let contact = new Contact(answers?.name, answers?.phone, answers?.group);
      contact.save();
      console.log("Contact added is successfully!");
    } catch (err) {
      console.log(err.message);
    }
  };

  static edit = async () => {
    const list = Contact.fetchAll();
    const choices = list.map((c) => `${c.name} - ${c.phone}`);

    let selectedItem = await inquirer.prompt({
      type: "list",
      name: "contact",
      message: "Select contact:",
      choices,
    });

    let item = Contact.fetchByPhone(selectedItem?.contact.split("-")[1].trim());

    if (item) {
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
        DB.updateContact(item?.id, answers?.name, answers?.phone);
        console.log("Contact edited is successfully!");
      } catch (err) {
        console.log(err.message);
      }
    } else {
      console.log("Sorry! can not found and edit this contact.");
    }
  };

  static remove = async () => {
    const list = Contact.fetchAll();
    const choices = list.map((c) => `${c.name} - ${c.phone}`);

    let selectedItem = await inquirer.prompt({
      type: "list",
      name: "contact",
      message: "Select contact:",
      choices,
    });

    let item = Contact.fetchByPhone(selectedItem?.contact.split("-")[1].trim());

    if (item) {
      try {
        DB.deleteContact(item?.id);
        console.log("Contact deleted is successfully!");
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      throw new Error("Sorry! can not found and delete this contact.");
    }
  };

  static removeAll = async () => {
    let answer = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: "Are you sure remove all contacts?",
      default: true,
    });

    if (answer?.confirm) {
      try {
        DB.resetDB();
        console.log("Contacts remove all is successfully!");
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      return;
    }
  };

  static exportFile = () => {};

  static importFile = () => {};
}
