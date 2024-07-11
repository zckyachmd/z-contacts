const renderContacts = (data) => {
  const contactList = document.getElementById("contact-list");
  contactList.innerHTML = "";

  if (data.length === 0) {
    contactList.innerHTML =
      '<div class="text-center"><p class="bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 p-4 rounded-md mb-4 font-semibold">No contact found!</p></div>';
    return;
  }

  data.forEach((contact) => {
    const { id, name, company } = contact;

    const contactItem = document.createElement("a");
    contactItem.href = `/detail.html?id=${id}`;
    contactItem.classList.add(
      "bg-gray-100",
      "dark:bg-gray-800",
      "dark:border",
      "dark:border-gray-700",
      "p-4",
      "rounded-md",
      "mb-4",
      "flex",
      "items-center",
      "justify-between",
      "transition-all",
      "duration-300",
      "hover:shadow-md",
      "hover:bg-gray-200",
      "dark:hover:bg-gray-700",
      "hover:shadow-lg"
    );

    contactItem.innerHTML = `
        <div>
          <h3 class="font-semibold">${name}</h3>
          <p class="italic text-sm text-gray-500">${
            company ? company : "Jobless"
          }</p>
        </div>
        <i data-feather="chevron-right" class="w-5 h-5 text-gray-400"></i>
      `;
    contactList.appendChild(contactItem);
  });

  feather.replace();
};

const toggleResetButton = (isVisible) => {
  const resetButton = document.getElementById("reset-search");
  if (isVisible) {
    resetButton.classList.remove("hidden");
  } else {
    resetButton.classList.add("hidden");
    const contacts = getContacts(true);
    renderContacts(contacts);
  }
};

const handleSearchSubmit = (e) => {
  e.preventDefault();

  const searchText = e.target.elements["search"].value.trim();
  if (!searchText) {
    return;
  }

  const filteredContacts = searchContacts(getContacts(true), searchText);

  toggleResetButton(true);
  renderContacts(filteredContacts);
};

document.addEventListener("DOMContentLoaded", () => {
  seedContacts();

  const contacts = getContacts(true);
  renderContacts(contacts);

  const formSearch = document.getElementById("form-search");
  formSearch.addEventListener("submit", handleSearchSubmit);

  const resetButton = document.getElementById("reset-search");
  resetButton.addEventListener("click", () => {
    toggleResetButton(false);
  });
});
