document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

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

remove.addEventListener("drop", () => {
  const curTask = document.querySelector(".is-dragging");
  document.getElementById("remove").style.width = "50px";
  curTask.remove();
});

remove.addEventListener("dragleave", () => {
  document.getElementById("remove").style.width = "30px";
});

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
  newTask.innerHTML = `
        <p class="task-title">${value}</p>
        <div class="additional-details expanded">
            <p>Description: ${descriptionValue}</p>
            <p>Assignee: ${assigneeValue}</p>
            <p>Deadline: ${deadlineValue}</p>
        </div>
        <button class="expand-details-btn">
            <i class="fas fa-caret-down"></i> <!-- Initially shown as caret-down -->
        </button>
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

document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskInput = document.getElementById("task");

    taskInput.addEventListener('keyup', checkTaskInput);

    function checkTaskInput() {
        if (taskInput.value.length == 0) {
            addTaskBtn.style.cursor = 'not-allowed';
            addTaskBtn.style.opacity = (0.4);
        } else if (taskInput.value <= '') {
            addTaskBtn.style.cursor = 'not-allowed';
            addTaskBtn.style.opacity = (0.4);
        } else {
            addTaskBtn.style.cursor = 'pointer';
            addTaskBtn.style.opacity = (1);
        }
    }
})
document.addEventListener("click", (e) => {
  const expandButton = e.target.closest(".expand-details-btn");
  if (expandButton) {
    const cardContent = expandButton
      .closest(".task")
      .querySelector(".additional-details");
    const arrowIcon = expandButton.querySelector("i");

    cardContent.classList.toggle("expanded");
    if (cardContent.classList.contains("expanded")) {
      arrowIcon.classList.remove("fa-caret-down");
      arrowIcon.classList.add("fa-caret-up");
    } else {
      arrowIcon.classList.remove("fa-caret-up");
      arrowIcon.classList.add("fa-caret-down");
    }
  }
});
