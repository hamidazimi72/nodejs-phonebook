import util from "util";

import chalk from "chalk";

import DB from "./db.js";

export default class Contact {
  #id = 0;
  #name;
  #phone;

  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    if (typeof value !== "string" && value.length < 3) {
      throw new Error("name must contain at least 3 letters!");
    }
    this.#name = value;
  }

  get phone() {
    return this.#phone;
  }

  set phone(value) {
    if (!/^[0-9]{11}$/.test(value)) {
      throw new Error("phone must is number and contain at 11 char!");
    }
    this.#phone = value;
  }

  [util.inspect.custom]() {
    return `Contact {
      id: ${chalk.yellowBright(this.#id)},
      name: ${chalk.green(`"${this.#name}"`)},
      phone: ${chalk.blue(this.#phone)}
    }`;
  }

  save() {
    try {
      DB.saveContact(this.#name, this.#phone);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static fetchAll(isPureObject = true) {
    const list = DB.fetchContactAll();

    if (isPureObject) {
      return list;
    } else {
      let items = [];
      for (const contact of list) {
        let item = new Contact(contact?.name, contact?.phone);
        item.#id = contact?.id;
        items.push(item);
      }
      return items;
    }
  }

  static fetchById(id) {
    const item = DB.fetchContactById(id);

    if (item) {
      let contact = new Contact(item?.name, item?.phone);
      contact.#id = id;
      return contact;
    } else {
      return false;
    }
  }

  static fetchByName(name) {
    const item = DB.fetchContactByName(name);

    if (item) {
      let contact = new Contact(name, item?.phone);
      contact.#id = item?.id;
      return contact;
    } else {
      return false;
    }
  }

  static fetchByPhone(phone) {
    const item = DB.fetchContactByPhone(phone);

    if (item) {
      let contact = new Contact(item?.name, phone);
      contact.#id = item?.id;
      return contact;
    } else {
      return false;
    }
  }
}
