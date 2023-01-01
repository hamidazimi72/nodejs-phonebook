import fs from "fs";

import "dotenv/config";

const db_filename = process.env.DB_FILE;

export default class DB {
  static existsDB() {
    if (fs.existsSync(db_filename)) {
      return true;
    } else {
      return false;
    }
  }

  static resetDB() {
    if (this.existsDB()) {
      try {
        fs.writeFileSync(db_filename, "[]", "utf-8");
        return true;
      } catch (err) {
        throw new Error(`Sorry! can not write this file`);
      }
    } else {
      throw new Error(`Sorry! ${db_filename} is not found!`);
    }
  }

  static createDB() {
    if (this.existsDB()) {
      console.log(`Sorry! ${db_filename} is exists in directory.`);
      return false;
    }

    try {
      fs.writeFileSync(db_filename, "[]", "utf-8");
      return true;
    } catch (err) {
      throw new Error(`Sorry! can not write this file`);
    }
  }

  static fetchContactAll() {
    if (this.existsDB) {
      try {
        const data = fs.readFileSync(db_filename, "utf-8");
        return JSON.parse(data);
      } catch (err) {
        throw new Error(`Sorry! can not read ${db_filename} file.`);
      }
    } else {
      throw new Error(`Sorry! ${db_filename} is not found!`);
    }
  }

  static fetchContactById(id = null) {
    let list;

    try {
      list = this.fetchContactAll();
    } catch (err) {
      throw new Error(err.message);
    }

    const contact = list.find((c) => c.id === id);

    return contact ? contact : false;
  }

  static fetchContactByName(name = null) {
    let list;

    try {
      list = this.fetchContactAll();
    } catch (err) {
      throw new Error(err.message);
    }

    const contact = list.find((c) => c.name === name);

    return contact ? contact : false;
  }

  static fetchContactByPhone(phone = null) {
    let list;

    try {
      list = this.fetchContactAll();
    } catch (err) {
      throw new Error(err.message);
    }

    const contact = list.find((c) => c.phone === phone);

    return contact ? contact : false;
  }

  static saveContact(name = null, phone = null) {
    if (!name || !phone) return;

    const list = this.fetchContactAll();
    let id = list.length ? list[list.length - 1].id + 1 : 1;
    list.push({ id, name, phone });
    list.sort((a, b) => a.id - b.id);

    try {
      fs.writeFileSync(db_filename, JSON.stringify(list, null, "  "), "utf-8");
    } catch (err) {
      throw new Error("Sorry! can not save this contact.");
    }
  }

  static updateContact(id = null, name = null, phone = null) {
    if (!id) return;

    const list = this.fetchContactAll();
    const item = this.fetchContactById(id);

    if (item) {
      let newList = list.filter((c) => c.id !== id);
      let newItem = {
        id,
        name: name ? name : item?.name,
        phone: phone ? phone : item?.phone,
      };
      newList.push(newItem);
      newList.sort((a, b) => a.id - b.id);

      try {
        fs.writeFileSync(db_filename, JSON.stringify(newList), "utf-8");
      } catch (err) {
        throw new Error("Sorry! can not update this contact.");
      }
    } else {
      return false;
    }
  }

  static deleteContact(id) {
    if (!id) return;

    const list = this.fetchContactAll();
    const item = this.fetchContactById(id);

    if (item) {
      let newList = list.filter((c) => c.id !== id);

      try {
        fs.writeFileSync(db_filename, JSON.stringify(newList), "utf-8");
      } catch (err) {
        throw new Error("Sorry! can not delete this contact.");
      }
    } else {
      return false;
    }
  }
}
