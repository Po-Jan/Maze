const rules= document.querySelector('.rules');
   rules.addEventListener('click', function() {
                swal({
                    title: "📜 Rules:",
                    text: "\n- Arrow keys for movement\n- Press 'H' for help\n\n Objective: Reach the red cell!",
                    icon: "info",
                    buttons: {
                        confirm: {
                            text: "Got it!",
                            className: "swal-button"
                        }
                    }
                });
            
                // Add the class "swRules" to the modal after it's created
                setTimeout(() => {
                    let swalModal = document.querySelector(".swal-modal");
                    if (swalModal) {
                        swalModal.classList.add("swRules");
                    }
                }, 100);

});
