var LocalStorage = function () {
    function set(key, val) {
        localStorage.setItem(key, val);
    }

    function get(key) {
        return localStorage.getItem(key);
    }

    function remove(key) {
        localStorage.removeItem(key);
    }

    return {
        set: set,
        get: get,
        remove: remove
    }
}();

var Helper = function () {
    function init() {
        checkIfEmptyAssigned();
    }

    function checkAssigned() {
        Handlebars.registerHelper('checkIfEmptyAssigned', function(val, options) {
            if(val) {
                return val;
            } else {
                return "Unassigned";
            }
        });
    }

    return {
        init: init
    }
}();

Helper.init();

var App = function () {
    function init() {
        draggable();
        droppable();
        openCard();
        createTask();
        closeModal();
        printNotes();
    }

    function createTask() {
        var source = $("#task-card-template").html();
        
    }
}