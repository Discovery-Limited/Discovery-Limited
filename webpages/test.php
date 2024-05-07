<?php

?>

<!-- Display backlog tasks -->
<div id="backlog" class="column">
    <?php foreach ($backlogTasks as $task): ?>
    <div class="task" draggable="true">
        <!-- Task details -->
        <p><?php echo $task['task_name']; ?></p>
        <!-- Add other task details as needed -->
    </div>
    <?php endforeach; ?>
</div>

<!-- Display to-do tasks -->
<div id="toDo" class="column">
    <?php foreach ($toDoTasks as $task): ?>
    <div class="task" draggable="true">
        <!-- Task details -->
        <p><?php echo $task['task_name']; ?></p>
        <!-- Add other task details as needed -->
    </div>
    <?php endforeach; ?>
</div>

<!-- Display in-progress tasks -->
<div id="inProgress" class="column">
    <?php foreach ($inProgressTasks as $task): ?>
    <div class="task" draggable="true">
        <!-- Task details -->
        <p><?php echo $task['task_name']; ?></p>
        <!-- Add other task details as needed -->
    </div>
    <?php endforeach; ?>
</div>

<!-- Display done tasks -->
<div id="done" class="column">
    <?php foreach ($doneTasks as $task): ?>
    <div class="task" draggable="true">
        <!-- Task details -->
        <p><?php echo $task['task_name']; ?></p>
        <!-- Add other task details as needed -->
    </div>
    <?php endforeach; ?>
</div>
