const generateContactId = () => {
  const savedContacts = getContacts();
  return savedContacts.length + 1;
};

const handleSubmit = async (formData) => {
  try {
    const contact = Object.fromEntries(formData.entries());
    const id = (contact.id = generateContactId());

    await saveContact(contact);
    showSuccess("Contact saved successfully!", "./detail.html?id=" + id);
  } catch (error) {
    showError(error.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Save Contact
  const formContact = document.getElementById("form-new-contact");
  formContact.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formContact);
    await handleSubmit(formData);
  });
});
