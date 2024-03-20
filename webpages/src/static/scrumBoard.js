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
        Handlebars.registerHelper('checkIfEmptyAssigned', function (val, options) {
            if (val) {
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
        var template = Handlebars.compile(source);
        var task = document.getElementById('add-task');

        $("#add-task").on("click", function (e) {
            e.preventDefault();
            $("#add-task-modal").removeClass("hide");
            $(".content").addClass("hide");

            $('#add-task-modal').find('form').on('submit', function (e) {
                e.preventDefault();
                var obj = {};
                var params = $(this).serialize();
                var splitParams = params.split('&');

                for (var i = 0, l = splitParams.length; i < l; i++) {
                    var keyVal = splitParams[i].split('=');
                    obj[keyVal[0]] = unescape(keyVal[1]);
                }

                // TODO: Add validations
                if (obj.description === '' || obj.title === '') {
                    return;
                }

                var iid = LocalStorage.get('taskCounter');
                obj.id = ++iid;
                obj.status = 'pending';
                LocalStorage.set('task-' + obj.id, JSON.stringify(obj));
                LocalStorage.set('taskCounter', iid);

                var newCard = template([obj]);
                $('#dashboard #' + obj.status).append(newCard);
                draggable();

                $('.close-modal').trigger('click');

                //Clear form fields after submit
                $(this).find('input[type=text], textarea').val('');
            });

        });
    }

    function closeModal() {
        $('.close-modal').on('click', function () {
            $('.modal').addClass('hide');
        });
    }

    function draggable() {
        $(".card").draggable({
            handle: 'h5',
            revert: false,
            helper: function (e) {
                var original = $(e.target).hasClass("ui-draggable") ? $(e.target) : $(e.target).closest(".ui-draggable");
                return original.clone().css({
                    width: original.width()
                });
            },
            scroll: false,
            cursor: "move",
            start: function (event, ui) {},
            stop: function(event, ui) {}
        });
    }
}

