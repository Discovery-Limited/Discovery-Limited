document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskInput = document.getElementById("task");
  
    taskInput.addEventListener("keyup", checkTaskInput);
  
    function checkTaskInput() {
      if (taskInput.value.length == 0) {
        addTaskBtn.style.cursor = 'not-allowed';
        addTaskBtn.style.opacity = 0.4;
      } else if (taskInput.value <= "") {
        addTaskBtn.style.cursor = 'not-allowed';
        addTaskBtn.style.opacity = 0.4;
      } else {
        addTaskBtn.style.cursor = 'pointer';
        addTaskBtn.style.opacity = 1;
      }
    }
  });