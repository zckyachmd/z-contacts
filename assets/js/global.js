/**
 * Displays an error message using Swal with a timer.
 *
 * @param {string} message - The error message to display.
 * @param {string} redirect - The URL to redirect to after the timer expires.
 * @return {void} This function does not return anything.
 */
const showError = (message, redirect) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    willClose: () => {
      if (redirect) {
        window.location.href = redirect;
      }
    },
  });
};

/**
 * Displays a success message using Swal with a timer.
 *
 * @param {string} message - The success message to display.
 * @param {string} redirect - The URL to redirect to after the timer expires.
 * @return {void} This function does not return anything.
 */
const showSuccess = (message, redirect) => {
  Swal.fire({
    title: "Success!",
    text: message,
    icon: "success",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    willClose: () => {
      if (redirect) {
        window.location.href = redirect;
      }
    },
  });
};

/**
 * Feathers init.
 * Replaces all feather icons in the document with SVG icons
 */
feather.replace();
