const pixel = document.querySelector('.pixel');
pixel.addEventListener('click', function () {

   swal({
      title: " Credits:",
      text: "\nJan Poljšak, 4. Ra\nInspired by the puzzle game Braid\n Teacher: Boštjan Vouk",
      icon: "info",
      buttons: {
         confirm: {
            text: "Okay!",
            className: "swal-button"
         }
      }
   });

   // Add the class "swCredits" to the modal after it's created
   setTimeout(() => {
      let swalModal = document.querySelector(".swal-modal");
      if (swalModal) {
         swalModal.classList.add("swCredits");
      }
   }, 100); // Small delay to ensure the modal exists



});
