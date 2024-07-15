const getContactIdFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("id"));
};

const initMap = (lat, lng, address) => {
  const map = L.map("map").setView([lat, lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([lat, lng]).addTo(map).bindPopup(address).openPopup();
};

const renderContactLocation = async (name, address) => {
  const geocoder = new L.Control.Geocoder.Nominatim();
  await geocoder.geocode(address, (result) => {
    if (result.length > 0) {
      const { lat, lng } = result[0].center;
      initMap(lat, lng, `${name}, ${address}`);
    }
  });
};

const renderContactDetails = ({ name, phone, email, company, address }) => {
  // Avatar
  const avatar = document.querySelector("#avatar");
  avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=128&bold=true&rounded=true&format=svg`;
  avatar.alt = name;

  // Name
  document.querySelector("#name").textContent = name;

  // Phone element
  const phoneElement = document.querySelector("#phone");
  phoneElement.textContent = "";
  const phoneLink = document.createElement("a");
  phoneLink.href = `tel:${phone}`;
  phoneLink.textContent = phone;
  phoneLink.className =
    "text-blue-500 hover:underline hover:text-blue-600 dark:hover:text-blue-400 dark:text-blue-500";
  phoneElement.appendChild(phoneLink);

  // Email element
  const emailElement = document.querySelector("#email");
  emailElement.textContent = email.trim().length > 0 ? "" : "-";

  if (email.trim().length > 0) {
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${email}`;
    emailLink.textContent = email;
    emailLink.className =
      "text-blue-500 hover:underline hover:text-blue-600 dark:hover:text-blue-400 dark:text-blue-500";
    emailElement.appendChild(emailLink);
  }

  // Address element
  document.querySelector("#address").textContent = address || "-";
  if (address.trim().length > 0) {
    renderContactLocation(name, address);
  }

  // Company
  const companyElement = document.querySelector("#company");
  companyElement.textContent = "Jobless";
  if (company.trim().length > 0) {
    const companyText = document.createElement("p");
    companyText.className = "italic";
    companyText.textContent = company;
    companyElement.appendChild(companyText);
  }

  // Title of the page
  document.title = `${name} / ZContacts`;
};

const handleDelete = async (contactId, name) => {
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: `Delete contact '${name}'. This action cannot be undone!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#E02424",
    cancelButtonColor: "#1C64F2",
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmation.isConfirmed) {
    try {
      await deleteContact(contactId);
      Swal.fire({
        title: "Deleted!",
        text: `Contact '${name}' has been deleted.`,
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          window.location.href = "/";
        },
      });
    } catch (error) {
      showError("Failed to delete contact!");
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve contact ID from URL
  const contactId = getContactIdFromURL();
  if (!/^\d+$/.test(contactId)) {
    showError("Invalid contact ID!", "/");
    return;
  }

  // Retrieve contact details
  const contact = getContactById(contactId);
  if (!contact) {
    showError("Contact not found!", "/");
    return;
  }
  renderContactDetails(contact);

  // Edit contact button
  const editBtn = document.getElementById("btn-edit");
  editBtn.addEventListener("click", () => {
    window.location.href = `./edit.html?id=${contactId}`;
  });

  // Delete contact button
  const deleteBtn = document.getElementById("btn-delete");
  deleteBtn.addEventListener("click", () =>
    handleDelete(contactId, contact.name)
  );
});
