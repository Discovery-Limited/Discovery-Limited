// var LocalStorage = function () {
//     function set(key, val) {
//         localStorage.setItem(key, val);
//     }

//     function get(key) {
//         return localStorage.getItem(key);
//     }

//     function remove(key) {
//         localStorage.removeItem(key);
//     }

//     return {
//         set: set,
//         get: get,
//         remove: remove
//     }
// }();

// var Helper = function () {
//     function init() {
//         checkIfEmptyAssigned();
//     }

//     function checkAssigned() {
//         Handlebars.registerHelper('checkIfEmptyAssigned', function (val, options) {
//             if (val) {
//                 return val;
//             } else {
//                 return "Unassigned";
//             }
//         });
//     }

//     return {
//         init: init
//     }
// }();

// Helper.init();



// var App = function () {
//     function init() {
//         draggable();
//         droppable();
//         openCard();
//         createTask();
//         closeModal();
//         printNotes();
//     }

//     function createTask() {
//         var source = $("#task-card-template").html();
//         var template = Handlebars.compile(source);
//         var task = document.getElementById('add-task');

//         $("#add-task").on("click", function (e) {
//             e.preventDefault();
//             $("#add-task-modal").removeClass("hide");
//             $(".content").addClass("hide");

//             $('#add-task-modal').find('form').on('submit', function (e) {
//                 e.preventDefault();
//                 var obj = {};
//                 var params = $(this).serialize();
//                 var splitParams = params.split('&');

//                 for (var i = 0, l = splitParams.length; i < l; i++) {
//                     var keyVal = splitParams[i].split('=');
//                     obj[keyVal[0]] = unescape(keyVal[1]);
//                 }

//                 // TODO: Add validations
//                 if (obj.description === '' || obj.title === '') {
//                     return;
//                 }

//                 var iid = LocalStorage.get('taskCounter');
//                 obj.id = ++iid;
//                 obj.status = 'pending';
//                 LocalStorage.set('task-' + obj.id, JSON.stringify(obj));
//                 LocalStorage.set('taskCounter', iid);

//                 var newCard = template([obj]);
//                 $('#dashboard #' + obj.status).append(newCard);
//                 draggable();

//                 $('.close-modal').trigger('click');

//                 //Clear form fields after submit
//                 $(this).find('input[type=text], textarea').val('');
//             });

//         });
//     }

//     function closeModal() {
//         $('.close-modal').on('click', function () {
//             $('.modal').addClass('hide');
//         });
//     }

//     function draggable() {
//         $(".card").draggable({
//             handle: 'h5',
//             revert: false,
//             helper: function (e) {
//                 var original = $(e.target).hasClass("ui-draggable") ? $(e.target) : $(e.target).closest(".ui-draggable");
//                 return original.clone().css({
//                     width: original.width()
//                 });
//             },
//             scroll: false,
//             cursor: "move",
//             start: function (event, ui) {},
//             stop: function(event, ui) {}
//         });
//     }
// }


// ---------- Drag Tasks ----------
const draggables = document.querySelectorAll(".task");
const droppables = document.querySelectorAll(".column");
const backlog = document.getElementById("backlog");
const toDo = document.getElementById("toDo");
const inProgress = document.getElementById("inProgress");
const done = document.getElementById("done");

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
        } else if (curTask == 'remove') {
            curTask.remove();
        }
        
        else {
            zone.insertBefore(curTask, bottomTask);
        }
    });
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

