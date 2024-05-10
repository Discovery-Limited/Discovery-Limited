<?php
header('Content-Type: application/json');

$config = require 'config.php';

// Database configuration
try {
    $pdo = new PDO(
        "mysql:host={$config['db']['host']};dbname={$config['db']['dbname']};charset={$config['db']['charset']}",
        $config['db']['user'],
        $config['db']['pass'],
        $config['options']
    );
} catch (\PDOException $e) {
    echo json_encode(['error' => "Database connection failed: " . $e->getMessage()]);
    exit;
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

// Checks if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Gets all the tasks that are assigned to the user
$taskQuery = $pdo->prepare("SELECT t.*
                               FROM task t 
                               JOIN user_task ut ON t.task_id = ut.task_id
                               JOIN user u ON ut.user_id = u.user_id
                               WHERE (t.status = 'inProgress' OR t.status = 'toDo') AND u.user_id = :user_id
                               ORDER BY t.deadline ASC");
$taskQuery->execute(['user_id' => $user_id]);
$tasks = $taskQuery->fetchAll(PDO::FETCH_ASSOC);

// Gets other contributors of the tasks from taskQuery
foreach ($tasks as &$task) {
    $userQuery = $pdo->prepare("SELECT u.email
                                FROM user u
                                JOIN user_task ut ON u.user_id = ut.user_id
                                WHERE ut.task_id = :task_id");
    $userQuery->execute(['task_id' => $task['task_id']]);
    $users = $userQuery->fetchAll(PDO::FETCH_ASSOC);
    $task['users'] = $users;  
}
unset($task);  

// Sends every data to front end
echo json_encode(['tasks' => $tasks]);
?>
