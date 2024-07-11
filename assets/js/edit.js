const getContactIdFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

const formEditContact = document.getElementById("form-edit-contact");

const renderEditContact = (contact) => {
  const { name, phone, email, company, address } = contact;
  formEditContact.name.value = name;
  formEditContact.phone.value = phone;
  formEditContact.email.value = email;
  formEditContact.company.value = company;
  formEditContact.address.value = address;
  document.title = `Edit ${name} / ZContacts`;
};

const handleFormSubmit = async (formData, contactId) => {
  try {
    const contact = Object.fromEntries(formData.entries());
    await updateContact(contact, contactId);
    showSuccess(
      "Contact updated successfully!",
      "./detail.html?id=" + contactId
    );
  } catch (error) {
    showError(error.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const contactId = getContactIdFromURL();

  if (!/^\d+$/.test(contactId)) {
    showError("Invalid contact ID!", "./");
    return;
  }

  const contact = getContactById(contactId);
  if (!contact) {
    showError("Contact not found!", "./");
    return;
  }

  renderEditContact(contact);

  formEditContact.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formEditContact);
    await handleFormSubmit(formData, contactId);
  });
});
