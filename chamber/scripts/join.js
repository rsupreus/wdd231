const timestamp = document.querySelector("#timestamp");
timestamp.value = new Date().toISOString();

const modalButtons = document.querySelectorAll("[data-modal]");
const closeButtons = document.querySelectorAll(".modal-close");
const dialogs = document.querySelectorAll(".membership-modal");

modalButtons.forEach((button) => {
button.addEventListener("click", () => {
   const dialog = document.querySelector(`#${button.dataset.modal}`);

    if (dialog) {
    dialog.showModal();
       }
         });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            button.closest("dialog").close();
        });
    });

    dialogs.forEach((dialog) => {
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    });

    document.querySelector(".join-form").addEventListener("submit", () => {
    document.querySelector("#timestamp").value = new Date().toISOString();
});
