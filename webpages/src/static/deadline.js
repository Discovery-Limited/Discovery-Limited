window.addEventListener("DOMContentLoaded", () => {

    const popupButtons = document.querySelectorAll(".deadline-details-btn");
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const closeButton = document.getElementById("close-popup");
    
    function openPopup() {
        popup.style.scale = "1";
        overlay.style.display = "flex";
    }
    
    popupButtons.forEach(function (button) {
        button.addEventListener("click", openPopup);
    });
    
    overlay.addEventListener("click", function () {
        popup.style.scale = "0";
        overlay.style.display = "none";
    });
    closeButton.addEventListener("click", function () {
        popup.style.scale = "0";
        overlay.style.display = "none";
    });

    fetch('user_view.php')
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            document.querySelector(".username").textContent = data.username;
        }
    })
    .catch(error => console.error('Error fetching projects:', error));
});
