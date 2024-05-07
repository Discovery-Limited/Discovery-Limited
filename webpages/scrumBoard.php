<?php
session_start();

$currentUserId = $_SESSION['user_id'];
$currentProjectId = $_SESSION['project_id'];
$config = require 'config.php';

try {
    $pdo = new PDO(
        "mysql:host={$config['db']['host']};dbname={$config['db']['dbname']};charset={$config['db']['charset']}",
        $config['db']['user'],
        $config['db']['pass'],
        $config['options']
    );
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

$stmt = $pdo->prepare("
    SELECT t.* 
    FROM task t
    JOIN user_task ut ON t.task_id = ut.task_id
    WHERE ut.user_id = :user_id AND t.project_id = :project_id
");
$stmt->execute(['user_id' => $currentUserId, 'project_id' => $currentProjectId]);
$tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

$backlogTasks = [];
$toDoTasks = [];
$inProgressTasks = [];
$doneTasks = [];

foreach ($tasks as $task) {
    switch ($task['status']) {
        case 'backlog':
            $backlogTasks[] = $task;
            break;
        case 'toDo':
            $toDoTasks[] = $task;
            break;
        case 'inProgress':
            $inProgressTasks[] = $task;
            break;
        case 'done':
            $doneTasks[] = $task;
            break;
        default:
            break;
    }
}
?>


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- <script src="./src/static/handlebar.js"></script> -->
    <!-- <script type="module" defer src="./src/static/scrumBoard.js?=1"></script> -->
    <!-- <script src="scrumBoard.js"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="./src/static/handlebar.js"></script>
    <script src="./src/static/scrumBoard.js?=25" defer></script>
    <link rel="stylesheet" href="./src/css/scrumBoard.css?=19" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
    />
    <title>Scrum Board</title>
  </head>
  <body>
    <div class="topbar">
      <div class="page-name">
        <button onclick="omitData('undefined')"><i class="fa-solid fa-house"></i>Home</button>
      </div>
    </div>

    <div class="dashboard">
      <div class="container">
        <div id="backlog" class="backlog column drop">
          <div class="title">Backlog</div>

            <?php foreach ($backlogTasks as $task): ?>
            <div class="task" draggable="true" data-task-id="<?php echo $task['task_id']; ?>">
                <input type="hidden" name="task_id" value="<?php echo $task['task_id']; ?>">
                <div class="task-nav">
                  <p class="task-title"><?php echo $task['task_name']; ?></p>
                  <button class="task-settings">
                    <i class="fa-solid fa-gear"></i>
                  </button>
                </div>
                
                <div class="additional-details expanded">
                  <p><?php echo $task['description']; ?></p>
                  <div class="task-footer">
                    <p class="task-date"><?php echo $task['deadline']; ?></p>
                    <div class="task-tag <?php echo $task['tag_color']; ?>"><?php echo $task['tag']; ?></div>
                  </div>
                </div>
                
                <button class="expand-details-btn">
                  <i class="fas fa-caret-up"></i>
                </button>
            </div>
            <?php endforeach; ?>
        </div>

        <div id="toDo" class="toDo column drop">
            <div class="title">To Do</div>
        
            <?php foreach ($toDoTasks as $task): ?>
            <div class="task" draggable="true" data-task-id="<?php echo $task['task_id']; ?>">
                <input type="hidden" name="task_id" value="<?php echo $task['task_id']; ?>">
                <div class="task-nav">
                  <p class="task-title"><?php echo $task['task_name']; ?></p>
                  <button class="task-settings">
                    <i class="fa-solid fa-gear"></i>
                  </button>
                </div>
                
                <div class="additional-details expanded">
                  <p><?php echo $task['description']; ?></p>
                  <div class="task-footer">
                    <p class="task-date"><?php echo $task['deadline']; ?></p>
                    <div class="task-tag <?php echo $task['tag_color']; ?>"><?php echo $task['tag']; ?></div>
                  </div>
                </div>
                
                <button class="expand-details-btn">
                  <i class="fas fa-caret-up"></i>
                </button>
            </div>
            <?php endforeach; ?>
        </div>

        <div id="inProgress" class="inProgress column drop">
          <div class="title">In Progress</div>

            <?php foreach ($inProgressTasks as $task): ?>
            <div class="task" draggable="true" data-task-id="<?php echo $task['task_id']; ?>">
                <input type="hidden" name="task_id" value="<?php echo $task['task_id']; ?>">
                <div class="task-nav">
                  <p class="task-title"><?php echo $task['task_name']; ?></p>
                  <button class="task-settings">
                    <i class="fa-solid fa-gear"></i>
                  </button>
                </div>
                
                <div class="additional-details expanded">
                  <p><?php echo $task['description']; ?></p>
                  <div class="task-footer">
                    <p class="task-date"><?php echo $task['deadline']; ?></p>
                    <div class="task-tag <?php echo $task['tag_color']; ?>"><?php echo $task['tag']; ?></div>
                  </div>
                </div>
                
                <button class="expand-details-btn">
                  <i class="fas fa-caret-up"></i>
                </button>
            </div>
            <?php endforeach; ?>
        </div>

        <div id="done" class="done column drop">
            <div class="title">Done</div>
            
            <?php foreach ($doneTasks as $task): ?>
            <div class="task" draggable="true" data-task-id="<?php echo $task['task_id']; ?>">
                <input type="hidden" name="task_id" value="<?php echo $task['task_id']; ?>">
                <div class="task-nav">
                  <p class="task-title"><?php echo $task['task_name']; ?></p>
                  <button class="task-settings">
                    <i class="fa-solid fa-gear"></i>
                  </button>
                </div>
                
                <div class="additional-details expanded">
                  <p><?php echo $task['description']; ?></p>
                  <div class="task-footer">
                    <p class="task-date"><?php echo $task['deadline']; ?></p>
                    <div class="task-tag <?php echo $task['tag_color']; ?>"><?php echo $task['tag']; ?></div>
                  </div>
                </div>
                
                <button class="expand-details-btn">
                  <i class="fas fa-caret-up"></i>
                </button>
            </div>
            <?php endforeach; ?>
        </div>
      </div>

      <div id="modify-task-form-container" class="hide">
        <form id="modify-task-form">
          <div id="modify-task-form-actions">
            <button type="button" id="modify-task-form-close"></button>
          </div>
          <input type="hidden" id="modify-task-id" name="task_id" />
          <label for="modify-task-title">Task Title:</label>
          <input type="text" id="modify-task-title" name="task_title" />
          <label for="modify-task-description">Description:</label>
          <textarea id="modify-task-description" name="description"></textarea>
          <label for="modify-task-deadline">Deadline:</label>
          <input type="date" id="modify-task-deadline" name="deadline" />
          <label for="modify-task-tag">Tag:</label>
          <input type="text" id="modify-task-tag" name="tag" />
          <label for="modify-task-tag-color">Tag Color:</label>
          <select id="modify-task-tag-color" name="tag_color">
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="purple">Purple</option>
          </select>
          <button type="submit">Save Changes</button>
          <button id="modify-task-form-delete">Delete</button>
        </form>
      </div>


      <footer>
        <ul class="controls">
          <li data-tooltip="Drag task here to delete">
            <a href="#" class="remove" id="remove">
              <img src="./src/contents/imgs/trash-icon.png" alt="remove" />
            </a>
          </li>
          <li data-tooltip="Add new task">
            <a href="#add-task-modal" class="add-task" id="add-task">
              <img src="./src/contents/imgs/add.png" alt="add" />
            </a>
          </li>
        </ul>
      </footer>

      <div class="overlay" id="add-task-modal">
        <div class="modal-content">
          <form id="add-task-form" class="add-task-form" name="add_task">
            <a href="#" class="close-modal">&times;</a>
            <h2>Add Task</h2>
            <input type="text" id="task" name="task" placeholder="Task" />
            <textarea
              id="description"
              name="description"
              placeholder="Description"
            ></textarea>
            <input
              type="text"
              id="assignee"
              name="assignee"
              placeholder="Assignee"
            />
            <input
              type="date"
              id="deadline"
              name="deadline"
              placeholder="Deadline"
            />

            <label for="tagColorSelector">Tag Color:</label>
            <select id="tagColorSelector" name="tagColorSelector">
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
            </select>

            <input
              type="text"
              id="tagNameInput"
              name="tagNameInput"
              placeholder="Tag Name"
            />

            <input
              type="submit"
              id="add-task-btn"
              name="add_task"
              value="Add Task"
            />
            <input
              type="hidden"
              id="scrumboard_ID"
              name="scrumboard_ID"
              value="0"
            />
            <input
              type="hidden"
              id="status_VALUE"
              name="status_VALUE"
              value="1"
            />
          </form>
        </div>
      </div>
    </div>
    

    <script id="task-card-template" type="text/x-handlebars-template">
      {{#each this}}

        <div class="card" data-task-id="{{id}}">
          <i href="#" class="fa fa-expanded"></i>
          <h5>{{task}}</h5>
          <div class="card-content">
            <p data-field="deadline">{{deadline}}</p>
            <p data-field="description">{{description}}</p>
            <p data-field="assignee">{{#checkIfEmptyAssigned
                assigned_to
              }}{{/checkIfEmptyAssigned}}</p>
            <button class="expand-details-btn">
              <i class="fas fa-caret-down"></i>
            </button>
          </div>
        </div>
      {{/each}}
    </script>

    <script>
      function omitData(data) {
        const data_to_send = { message: data };
        window.parent.postMessage(data_to_send, "*");
      }
    </script>
  </body>
</html>