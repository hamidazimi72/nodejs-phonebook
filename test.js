import DB from "./db.js";
import Contact from "./contact.js";

console.clear();

// DB.resetDB();
// DB.saveContact("hamid", "09212108871");
// DB.delete(2);

// let user = new Contact("hamid", "09371150398");
// console.log(user);
console.log(Contact.fetchByPhone("09371150396"));
