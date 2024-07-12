const STORAGE_KEY = "contacts";

/**
 * Seed initial contacts if not already present in localStorage.
 */
const seedContacts = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialContacts = [
      {
        id: 1,
        name: "Zacky Achmad",
        phone: "085123456789",
        email: "hi@zacky.id",
        company: "Bearmentor Community",
        address: "Bandung, Indonesia",
      },
      {
        id: 2,
        name: "Anita Susanti",
        phone: "081234567890",
        email: "anita.susanti@example.com",
        company: "Teknikindo Solutions",
        address: "Jakarta, Indonesia",
      },
      {
        id: 3,
        name: "Budi Setiawan",
        phone: "087654321098",
        email: "budi.setiawan@example.com",
        company: "Mitra Sejahtera",
        address: "Surabaya, Indonesia",
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContacts));
  }
};

/**
 * Retrieves the list of contacts from local storage.
 *
 * @return {Array} An array of contact objects, or an empty array if no contacts are found.
 */
const getContacts = (sort = false) => {
  let contacts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (sort) {
    contacts.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  return contacts;
};

/**
 * Retrieves a contact from the list of contacts based on the provided ID.
 *
 * @param {string} id - The ID of the contact to retrieve.
 * @return {Object|undefined} The contact object with the matching ID, or undefined if not found.
 */
const getContactById = (id) => {
  const contacts = getContacts();
  return contacts.find((contact) => contact.id === id);
};

/**
 * Filters the list of contacts based on the search text.
 *
 * @param {string} searchText - The search text to filter the contacts by.
 * @return {Array} An array of contact objects that match the search text.
 */
const searchContacts = (contacts, searchText) => {
  const lowerCaseSearchText = searchText.toLowerCase();
  return contacts.filter((contact) => {
    const properties = ["name", "phone", "email", "company", "address"];
    return properties.some((prop) => {
      return (
        contact[prop] &&
        contact[prop].toLowerCase().includes(lowerCaseSearchText)
      );
    });
  });
};

/**
 * Saves a new contact with the provided data.
 *
 * @param {Object} data - The data of the new contact.
 * @return {Promise<void>} A Promise that resolves once the contact is successfully saved, or rejects with an error if the contact with the same name or phone number already exists, or if there was an error saving the contact.
 */
const saveContact = (data) => {
  return new Promise((resolve, reject) => {
    try {
      let savedContacts = getContacts();

      if (
        savedContacts.some(
          (contact) =>
            contact.name === data.name || contact.phone === data.phone
        )
      ) {
        throw new Error(
          "Contact with the same name or phone number already exists."
        );
      }

      savedContacts.push(data);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContacts));

      resolve();
    } catch (error) {
      reject(new Error(error || "Failed to save contact. Please try again!"));
    }
  });
};

/**
 * Updates a contact with the provided data based on the contact ID.
 *
 * @param {Object} data - The new data for the contact.
 * @param {string} id - The ID of the contact to update.
 * @return {Promise<void>} A Promise that resolves once the contact is successfully updated, or rejects with an error if the contact with the provided ID is not found.
 */
const updateContact = (data, id) => {
  return new Promise((resolve, reject) => {
    let savedContacts = getContacts();

    if (!savedContacts.some((contact) => contact.id === id)) {
      reject(new Error(`Contact with id ${id} not found.`));
    }

    savedContacts.forEach((contact) => {
      if (contact.id === id) {
        contact.name = data.name;
        contact.phone = data.phone;
        contact.email = data.email;
        contact.company = data.company;
        contact.address = data.address;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContacts));
    resolve();
  });
};

/**
 * Deletes a contact from the list of saved contacts based on the provided ID.
 *
 * @param {string} id - The ID of the contact to delete.
 * @throws {Error} If there was an issue deleting the contact. Please try again.
 * @return {Promise<void>} A Promise that resolves once the contact is successfully deleted, or rejects with an error if the contact with the provided ID is not found.
 */
const deleteContact = async (id) => {
  return new Promise((resolve, reject) => {
    let savedContacts = getContacts();

    if (!savedContacts.some((contact) => contact.id === id)) {
      reject(new Error(`Contact with id ${id} not found.`));
    }

    savedContacts = savedContacts.filter((contact) => contact.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContacts));

    resolve("Contact deleted successfully.");
  });
};
