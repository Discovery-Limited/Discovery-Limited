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

    class Deadline {      
        constructor(data) {
            this.data = data;
            this.node = null;
        }
      
        render() {
            const template = document.querySelector('#deadline-item');
            const content = template.content.cloneNode(true);
            this.node = document.importNode(content, true).firstElementChild;
            document.querySelector("#deadlines").appendChild(this.node);
        }
    }

    fetch('fetch_deadline.php')
    .then(response => response.json()) 
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            const newDeadline = new Deadline();
            newDeadline.render();
        }
    })
    .catch(error => console.error('Error fetching projects:', error));

});

