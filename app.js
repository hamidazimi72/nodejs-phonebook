import "dotenv/config";
import inquirer from "inquirer";

import Actions from "./actions.js";

console.clear();

const choices = [
  "list",
  "add",
  "edit",
  "delete",
  "delete-all",
  "export",
  "import",
];

inquirer
  .prompt({
    type: "list",
    name: "title",
    message: "Select once action:",
    choices,
  })
  .then((answer) => {
    switch (answer.title) {
      case "list":
        Actions.list();
        break;
      case "add":
        Actions.add();
        break;
      case "edit":
        Actions.edit();
        break;

      default:
        break;
    }
  });
