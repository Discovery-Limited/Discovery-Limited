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
    
            content.querySelector(".task-name").textContent = this.data.task_name;
            content.querySelector(".task-date").textContent = this.data.deadline;   
    
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const deadlineTime = new Date(this.data.deadline);
            deadlineTime.setHours(0, 0, 0, 0);  
            const timeDiff = deadlineTime - today;
            let daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            if (daysLeft < 0) daysLeft = 0;
            content.querySelector(".days-left").textContent = `${daysLeft} days left`;
    
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
            const tasks = data.tasks;
            tasks.forEach((task) => {
                const newDeadline = new Deadline(task);
                newDeadline.render();
            });
        }
    })
    .catch(error => console.error('Error fetching projects:', error));
    
});

function omitData(data) {
    const data_to_send = { message: data };
    window.parent.postMessage(data_to_send, "*");
}

