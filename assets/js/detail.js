const getContactIdFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

const initMap = (lat, lng, address) => {
  const map = L.map("map").setView([lat, lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lng]).addTo(map).bindPopup(address).openPopup();
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
  const { name, phone, email, company, address } = contact;

  // Set avatar
  const avatar = document.querySelector("#avatar");
  avatar.src = `https://ui-avatars.com/api/name=${encodeURIComponent(
    name
  )}&size=128&bold=true&rounded=true&format=svg`;
  avatar.alt = name;

  // Set contact details
  document.querySelector("#name").textContent = name;
  document.querySelector("#phone").textContent = phone;
  document.querySelector("#email").textContent = email || "-";
  document.querySelector("#address").textContent = address || "-";
  document.querySelector("#company").innerHTML = `<p class="italic">${
    company || "Jobless"
  }</p>`;
  document.title = `${name} / ZContacts`;

  // Map contact location if address exists
  if (address.trim() !== "") {
    const geocoder = new L.Control.Geocoder.Nominatim();
    await geocoder.geocode(address, (result) => {
      if (result.length > 0) {
        const { lat, lng } = result[0].center;
        initMap(lat, lng, `${name}, ${address}`);
      }
    });
  }

  // Edit contact button
  const editBtn = document.getElementById("btn-edit");
  editBtn.addEventListener("click", () => {
    console.log(contactId);
    window.location.href = `./edit.html?id=${contactId}`;
  });

  // Delete contact button
  const deleteBtn = document.getElementById("btn-delete");
  deleteBtn.addEventListener("click", () => handleDelete(contactId, name));
});
