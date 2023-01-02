import fs from "fs";

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

  static fetchContactAll(isPure = true, group = null) {
    if (this.existsDB) {
      try {
        const pureData = fs.readFileSync(db_filename, "utf-8");
        const parsedData = JSON.parse(pureData);
        const filteredData = isPure
          ? parsedData
          : parsedData.filter((c) => !c.deletedDate);
        const filteredDataByGroup = group
          ? filteredData.filter((c) => c.group === group)
          : filteredData;
        return filteredDataByGroup;
      } catch (err) {
        throw new Error(`Sorry! can not read databasae file.`);
      }
    } else {
      throw new Error(`Sorry! databasae is not found!`);
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

  static saveContact(name = null, phone = null, group = null) {
    if (!name || !phone || !group) return;

    const list = this.fetchContactAll();
    const isConatctExists = this.fetchContactByPhone(phone);

    if (!isConatctExists) {
      let id = list.length ? list[list.length - 1].id + 1 : 1;
      list.push({
        id,
        name,
        phone,
        group,
        creationDate: new Date(),
        deletedDate: null,
      });
      list.sort((a, b) => a.id - b.id);

      try {
        fs.writeFileSync(
          db_filename,
          JSON.stringify(list, null, "  "),
          "utf-8"
        );
      } catch (err) {
        throw new Error("Sorry! can not save this contact.");
      }
    } else {
      throw new Error("Sorry! phone number is exist in Database file.");
    }
  }

  static updateContact(
    id = null,
    name = null,
    phone = null,
    deletedDate = null
  ) {
    if (!id) return;

    const list = this.fetchContactAll();
    const isConatctExists = this.fetchContactByPhone(phone);

    if (!isConatctExists) {
      const item = this.fetchContactById(id);

      if (item) {
        let newList = list.filter((c) => c.id !== id);
        let newItem = {
          ...item,
          name: name ? name : item?.name,
          phone: phone ? phone : item?.phone,
          deletedDate: deletedDate ? deletedDate : item?.deletedDate,
        };
        newList.push(newItem);
        newList.sort((a, b) => a.id - b.id);

        try {
          fs.writeFileSync(
            db_filename,
            JSON.stringify(newList, null, "  "),
            "utf-8"
          );
        } catch (err) {
          throw new Error("Sorry! can not update this contact.");
        }
      } else {
        return false;
      }
    } else {
      throw new Error("Sorry! phone number is exist in Database file.");
    }
  }

  static deleteContact(id) {
    if (!id) return;

    const item = this.fetchContactById(id);

    if (item) {
      try {
        this.updateContact(id, null, null, new Date());
      } catch (err) {
        throw new Error("Sorry! can not delete this contact.");
      }
    } else {
      return false;
    }
  }
}
