const fs = require("fs/promises");
const path = require("path");
const ObjectID = require("bson-objectid");

const contactsPath = path.join(__dirname, "db/contacts.json");
async function updateContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (err) {
    console.error(err);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const currentContact = contacts.find((contact) => contact.id === contactId);
    if (!currentContact) {
      return null;
    }
    return currentContact;
  } catch (err) {
    console.error(err);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const idx = contacts.findIndex(({ id }) => id === contactId);
    if (idx === -1) {
      return null;
    }
    const [removeContact] = contacts.splice(idx, 1);
    updateContacts(contacts);
    return removeContact;
  } catch (err) {
    console.error(err);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: ObjectID(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    updateContacts(contacts);
    return newContact;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
