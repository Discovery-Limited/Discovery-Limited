document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

const draggables = document.querySelectorAll(".task");
const columns = document.querySelectorAll(".column");

draggables.forEach((task) => {
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });
});

columns.forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    const curTask = document.querySelector(".is-dragging");
    const status = column.id;
    const taskId = curTask.querySelector("input[name='task_id']").value;

    updateTaskStatus(taskId, status);
    column.appendChild(curTask);
  });
});

function updateTaskStatus(taskId_, status_) {
  fetch("scrumboardTasks_update.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskId: taskId_,
      status: status_,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
      } else {
        console.error("Error updating task status:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error updating task status:", error);
    });
}

const form = document.getElementById("add-task-form");
const taskInput = document.getElementById("task");
const descriptionInput = document.getElementById("description");
const assigneeInput = document.getElementById("assignee");
const deadlineInput = document.getElementById("deadline");
const scrumboard_ID = document.getElementById("scrumboard_ID");
const statusVAL = document.getElementById("status_VALUE");
const tagInput = document.getElementById("tagColorSelector");
const tagNameInput = document.getElementById("tagNameInput");
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
  const scrumboard_id = scrumboard_ID.value;
  const statusValue = statusVAL.value;
  const tagName = tagNameInput.value;
  const tagColor = tagInput.value;

  if (!value) return;

  const formData = new FormData();
  formData.append("task_name", value);
  formData.append("deadline", deadlineValue);
  formData.append("description", descriptionValue);
  formData.append("scrumboard_id", scrumboard_id);
  formData.append("status", statusValue);
  formData.append("tag", tagName);
  formData.append("tag_color", tagColor);

  fetch("scrumboardTasks_add.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const task_id = data.task_id;
        const newTask = document.createElement("p");
        newTask.classList.add("task");
        newTask.setAttribute("draggable", "true");
        newTask.innerHTML = `
        <input type="hidden" name="task_id" value="${task_id}">
        <div class="task-nav">
            <p class="task-title">${value}</p>
            <div class="task-settings">
                <i class="fa-solid fa-gear"></i>
            </div>
        </div>
        <div class="additional-details expanded">
            <p>Description: ${descriptionValue}</p>
            <p>Assignee: ${assigneeValue}</p>
            <div class="task-footer">
                <p class="task-date">${deadlineValue}</p>
                <div class="task-tag ${tagColor}">${tagName}</div>
            </div>
        </div>
        <button class="expand-details-btn">
            <i class="fas fa-caret-up"></i>
        </button>`;

        newTask.addEventListener("dragstart", () => {
          newTask.classList.add("is-dragging");
        });

        newTask.addEventListener("dragend", () => {
          newTask.classList.remove("is-dragging");
        });

        backlogLane.appendChild(newTask);
        taskInput.value = "";
        window.location.href = "#";
      } else {
        console.error("Error adding task:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error adding task:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const taskSettingsButtons = document.querySelectorAll(".task-settings");

  taskSettingsButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const taskContainer = event.target.closest(".task");
      const taskId = taskContainer.querySelector("input[name='task_id']").value;
      const taskTitle = taskContainer.querySelector(".task-title").textContent;
      const taskDescription = taskContainer.querySelector(
        ".additional-details p:first-child"
      ).textContent;
      const taskDeadline =
        taskContainer.querySelector(".task-date").textContent;
      const taskTag = taskContainer.querySelector(".task-tag").textContent;
      const taskTagColor =
        taskContainer.querySelector(".task-tag").classList[1];

      populateForm(
        taskId,
        taskTitle,
        taskDescription,
        taskDeadline,
        taskTag,
        taskTagColor
      );

      displayForm();
    });
  });

  function populateForm(
    taskId,
    taskTitle,
    taskDescription,
    taskDeadline,
    taskTag,
    taskTagColor
  ) {
    const form = document.getElementById("modify-task-form");
    form.querySelector("#modify-task-id").value = taskId;
    form.querySelector("#modify-task-title").value = taskTitle;
    form.querySelector("#modify-task-description").value = taskDescription;
    form.querySelector("#modify-task-deadline").value = taskDeadline;
    form.querySelector("#modify-task-tag").value = taskTag; // Added
    form.querySelector("#modify-task-tag-color").value = taskTagColor; // Added
  }

  function displayForm() {
    const formContainer = document.getElementById("modify-task-form-container");
    formContainer.classList.remove("hide");
  }

  const modifyForm = document.getElementById("modify-task-form");
  modifyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(modifyForm);

    fetch("scrumboardTasks_modify.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          updateTaskFrontend(formData);
          const formContainer = document.getElementById(
            "modify-task-form-container"
          );
          formContainer.classList.add("hide");
        } else {
          console.error("Error updating task details:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error updating task details:", error);
      });
  });

  function updateTaskFrontend(formData) {
    const taskId = formData.get("task_id");
    const taskTitle = formData.get("task_title");
    const taskDescription = formData.get("description");
    const taskDeadline = formData.get("deadline");
    const taskTag = formData.get("tag");
    const taskTagColor = formData.get("tag_color");

    const taskContainer = document
      .querySelector(`.task input[value="${taskId}"]`)
      .closest(".task");
    taskContainer.querySelector(".task-title").textContent = taskTitle;
    taskContainer.querySelector(
      ".additional-details p:first-child"
    ).textContent = taskDescription;
    taskContainer.querySelector(".task-date").textContent = taskDeadline;
    const taskTagElement = taskContainer.querySelector(".task-tag");
    taskTagElement.textContent = taskTag;
    taskTagElement.classList = `task-tag ${taskTagColor}`;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var closeButton = document.getElementById("modify-task-form-close");

  closeButton.addEventListener("click", function () {
    var formContainer = document.getElementById("modify-task-form-container");

    formContainer.classList.add("hide");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskInput = document.getElementById("task");

  taskInput.addEventListener("keyup", checkTaskInput);

  function checkTaskInput() {
    if (taskInput.value.length == 0) {
      addTaskBtn.style.cursor = "not-allowed";
      addTaskBtn.style.opacity = 0.4;
    } else if (taskInput.value <= "") {
      addTaskBtn.style.cursor = "not-allowed";
      addTaskBtn.style.opacity = 0.4;
    } else {
      addTaskBtn.style.cursor = "pointer";
      addTaskBtn.style.opacity = 1;
    }
  }
});

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

  function omitData(data) {
    const data_to_send = { message: data };
    window.parent.postMessage(data_to_send, "*");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var deleteButton = document.getElementById("modify-task-form-delete");

  deleteButton.addEventListener("click", function () {
    var taskId = document.getElementById("modify-task-id").value;

    fetch("scrumboardTasks_delete.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: taskId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const taskSelector = `[data-task-id="${taskId}"]`;
          const taskElement = document.querySelector(taskSelector);
          taskElement.remove();
          var formContainer = document.getElementById("modify-task-form-container");
          formContainer.classList.add("hide"); 
        } else {
          console.error("Error deleting task:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  });
});
