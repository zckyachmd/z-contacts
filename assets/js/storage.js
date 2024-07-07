const STORAGE_KEY = "contacts";

/**
 * Formats the given contact data into a structured format.
 *
 * @param {Object} data - The contact data to be formatted.
 * @return {Object} The formatted contact data.
 */
const formatContactData = (data) => {
  let phones = [];
  if (data.phone && data.phoneLabel) {
    phones.push({
      number: data.phone,
      label: data.phoneLabel,
    });
  }

  let emails = [];
  if (data.email && data.emailLabel) {
    emails.push({
      address: data.email,
      label: data.emailLabel,
    });
  }

  const formattedData = {
    name: {
      first: data.firstName || "",
      middle: data.middleName || "",
      last: data.lastName || "",
    },
    company: {
      name: data.company || "",
      jobTitle: data.jobTitle || "",
    },
    email: emails,
    phone: phones,
    address: {
      country: data.country || "",
      streetAddress: data.streetAddress || "",
      city: data.city || "",
      postalCode: data.postalCode || "",
    },
    notes: data.notes || "",
  };

  return formattedData;
};

/**
 * Generates a unique contact ID by retrieving the saved contacts and incrementing the length by 1.
 *
 * @return {number} The generated contact ID.
 */
const generateContactId = () => {
  const savedContacts = getContacts();
  return savedContacts.length > 0 ? savedContacts.length + 1 : 1;
};

/**
 * Saves a contact to local storage.
 *
 * @param {Object} data - The contact data to be saved.
 * @return {Promise<void>} A Promise that resolves when the contact is saved successfully, or rejects with an error if there was an issue.
 */
const saveContact = (data) => {
  try {
    const formattedData = formatContactData(data);

    const id = generateContactId();
    formattedData.id = id.toString();

    let savedContacts = getContacts();
    savedContacts.push(formattedData);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContacts));

    return { id: id.toString() };
  } catch (error) {
    console.error("Error saving contact:", error);
    throw new Error("Failed to save contact. Please try again.");
  }
};

/**
 * Retrieves the list of contacts from local storage.
 *
 * @return {Array} An array of contact objects, or an empty array if no contacts are found.
 */
const getContacts = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
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
 * Updates a contact in the list of contacts with the provided ID and new data.
 *
 * @param {string} id - The ID of the contact to update.
 * @param {Object} newData - The new data to update the contact with.
 * @return {Promise<void>} A Promise that resolves when the contact is updated successfully, or rejects with an error if there was an issue.
 * @throws {Error} If the contact with the provided ID is not found.
 * @throws {Error} If there was an issue updating the contact. Please try again.
 */
const updateContact = (id, newData) => {
  let savedContacts = getContacts();

  // Cari index kontak berdasarkan ID
  const index = savedContacts.findIndex((contact) => contact.id === id);

  if (index !== -1) {
    // Update data kontak dengan newData
    savedContacts[index] = {
      id: id.toString(),
      name: {
        first: newData.firstName || "",
        middle: newData.middleName || "",
        last: newData.lastName || "",
      },
      company: {
        name: newData.company || "",
        jobTitle: newData.jobTitle || "",
      },
      email: newData.email || [],
      phone: newData.phone || [],
      address: {
        country: newData.country || "",
        streetAddress: newData.streetAddress || "",
        city: newData.city || "",
        postalCode: newData.postalCode || "",
      },
      notes: newData.notes || "",
    };

    // Simpan kembali ke localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContacts));
  } else {
    throw new Error(`Contact with id ${id} not found.`);
  }
};

/**
 * Deletes a contact from the list of saved contacts based on the provided ID.
 *
 * @param {string} id - The ID of the contact to delete.
 * @throws {Error} If there was an issue deleting the contact. Please try again.
 */
const deleteContact = (id) => {
  try {
    let savedContacts = getContacts();

    // Cek apakah ada kontak yang ID-nya sesuai
    if (!savedContacts.some((contact) => contact.id === id)) {
      throw new Error(`Contact with id ${id} not found.`);
    }

    // Filter kontak yang ID-nya tidak sesuai dengan yang akan dihapus
    savedContacts = savedContacts.filter((contact) => contact.id !== id);

    // Simpan kembali ke localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContacts));
  } catch (error) {
    console.error(`Error deleting contact with id ${id}:`, error);
    throw new Error("Failed to delete contact. Please try again.");
  }
};