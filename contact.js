import util from "util";

import chalk from "chalk";

import DB from "./db.js";

export default class Contact {
  #id = 0;
  #name;
  #phone;
  #group;

  constructor(name, phone, group) {
    this.name = name;
    this.phone = phone;
    this.group = group;
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

  get group() {
    return this.#group;
  }

  set group(value) {
    this.#group = value;
  }

  [util.inspect.custom]() {
    return `Contact {
      id: ${chalk.yellowBright(this.#id)},
      name: ${chalk.green(`"${this.#name}"`)},
      phone: ${chalk.blue(this.#phone)},
      group: ${chalk.blue(this.#group)}
    }`;
  }

  save() {
    try {
      DB.saveContact(this.#name, this.#phone, this.#group);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static fetchAll(isObjectFormat = true) {
    const pureList = DB.fetchContactAll(false);
    const filteredList = pureList.map((c) => ({
      name: c?.name,
      phone: c?.phone,
      group: c?.group ?? "-",
      date: `${new Date(c?.creationDate).getMonth() + 1}/${new Date(
        c?.creationDate
      ).getDate()}/${new Date(c?.creationDate).getFullYear()} - ${new Date(
        c?.creationDate
      ).getHours()}:${new Date(c?.creationDate).getMinutes()}`,
    }));

    if (isObjectFormat) {
      return filteredList;
    } else {
      let items = [];
      for (const contact of filteredList) {
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
