window.addEventListener("DOMContentLoaded", () => {

    const popupButtons = document.querySelectorAll(".deadline-details-btn");
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const closeButton = document.getElementById("close-popup");
    const details = document.querySelector("#deadline-details-popup");

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
            this.taskUsers = data.users;
            this.node = null;
            this.detailsBtn = null;
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
            this.detailsBtn = this.node.querySelector(".deadline-details-btn");
            this.node.setAttribute("data-task-id", this.data.task_id);
            this.detailsEvent();
        }

        detailsEvent() {
            this.detailsBtn.addEventListener(("click"), () => {
                const detailWrapper = details.querySelector("#deadline-details-wrapper");
                detailWrapper.querySelector("h2").textContent = this.data.task_name;
                detailWrapper.querySelector("#deadline").textContent = "Deadline: "+ this.data.deadline;
                details.querySelector("#description").textContent = "Description: " + this.data.description;
                details.setAttribute("data-id", this.data.task_id);
                const userList = details.querySelector("#deadline-details-assignees");
        
                Array.from(userList.childNodes).forEach(child => {
                    child.remove();
                });
        
                this.taskUsers.forEach((user) => {
                    const anchor = document.createElement("a");
                    anchor.textContent = user.email;
                    userList.appendChild(anchor);
                });
                details.classList.remove("hide");
            });
        }
    }

    document.querySelector("#deadline-details-close").addEventListener(("click"), () => {
        details.classList.add("hide");
      });
    
    document.querySelector("#leave").addEventListener("click", function() {
        const taskID = details.getAttribute("data-id");
        if (taskID) {
            fetch("deadline_leave.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ task_id: taskID })
            })
            .then(response => response.json())
            .then(data => {
            if (data.success) {
                const taskSelector = `[data-task-id="${taskID}"]`;
                const taskElem = document.querySelector(taskSelector);
                if (taskElem) {
                taskElem.remove();
                }
                details.classList.add("hide");
            } else {
                console.error("Error deleting project:", data.error);
            }
            })
            .catch(error => {
            console.error("Error processing request:", error);
            });
        } else {
            console.error("Project ID not found on 'details' element.");
        }
    });
    
    document.querySelector("#complete").addEventListener(("click"), () => {
        const taskID = details.getAttribute("data-id");

        if (taskID) {
            fetch("deadline_finish.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ task_id: taskID })
            })
            .then(response => response.json())
            .then(data => {
            if (data.success) {
                const taskSelector = `[data-task-id="${taskID}"]`;
                const taskElem = document.querySelector(taskSelector);
                if (taskElem) {
                taskElem.remove();
                }
                details.classList.add("hide");
                omitData({ task_id: taskID });
            } else {
                console.error("Error leaving project:", data.error);
            }
            })
            .catch(error => {
            console.error("Error processing request:", error);
            });
        } else {
            console.error("Project ID not found on 'details' element.");
        }
    });

    fetch('fetch_deadline.php')
    .then(response => response.json()) 
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            data.tasks.forEach((task) => {
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

