// ---------- Drag Tasks ----------
const draggables = document.querySelectorAll(".task");
const droppables = document.querySelectorAll(".column");
const backlog = document.getElementById("backlog");
const toDo = document.getElementById("toDo");
const inProgress = document.getElementById("inProgress");
const done = document.getElementById("done");
const remove = document.getElementById("remove");
const curTask = document.querySelector(".is-dragging");
const drop = document.querySelector(".drop");

draggables.forEach((task) => {
    task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
    });
});

droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();

        const bottomTask = insertAboveTask(zone, e.clientY);
        const curTask = document.querySelector(".is-dragging");

        if (!bottomTask) {
            zone.appendChild(curTask);
        } else {
            zone.insertBefore(curTask, bottomTask);
        }
    });
});


remove.addEventListener("dragover", () => {
    document.getElementById("remove").style.width = "50px";
    curTask.remove();
})

remove.addEventListener("dragleave", () => {
    document.getElementById("remove").style.width = "30px";
})


const insertAboveTask = (zone, mouseY) => {
    const els = zone.querySelectorAll(".task:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
        const { top } = task.getBoundingClientRect();

        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });

    return closestTask;
};

// ---------- Add Task ---------- 
const form = document.getElementById("add-task-form");
const taskInput = document.getElementById("task");
const descriptionInput = document.getElementById("description");
const assigneeInput = document.getElementById("assignee");
const deadlineInput = document.getElementById("deadline");
const todoLane = document.getElementById("toDo");
const backlogLane = document.getElementById("backlog");
const addTaskModal = document.getElementById("add-task-modal");
const addTaskBtn = document.getElementById("add-task");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTaskModal.classList.remove("hide");
    const value = taskInput.value;
    const descriptionValue = descriptionInput.value;
    const assigneeValue = assigneeInput.value;
    const deadlineValue = deadlineInput.value;

    if (!value) return;

    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    // newTask.innerText = value;
    newTask.innerText = `
        Task: ${value}
        Description: ${descriptionValue}
        Assignee: ${assigneeValue}
        Deadline: ${deadlineValue}
    `;

    newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
    });

    // todoLane.appendChild(newTask);
    backlogLane.appendChild(newTask);
    taskInput.value = "";
    // addTaskModal.classList.add("hide");
    window.location.href = "#";

});

