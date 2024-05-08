<?php
header('Content-Type: application/json');

$config = require 'config.php';

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

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$taskQuery = $pdo->prepare("SELECT t.*
                               FROM task t 
                               JOIN user_task ut ON t.task_id = ut.task_id
                               WHERE (t.status = 'inProgress' OR t.status = 'toDo') AND ut.user_id = :user_id");
$taskQuery->execute(['user_id' => $user_id]);
$tasks = $taskQuery->fetchAll(PDO::FETCH_ASSOC);

foreach ($tasks as &$task) {
    $userQuery = $pdo->prepare("SELECT u.email
                                FROM user u
                                JOIN user_task ut ON u.user_id = ut.user_id
                                WHERE ut.task_id = :task_id");
    $userQuery->execute(['task_id' => $task['task_id']]);
    $users = $userQuery->fetchAll(PDO::FETCH_ASSOC);
    $task['users'] = $users;  // Assign correct users list to each task
}
unset($task);  // Break the reference with the last element

echo json_encode(['tasks' => $tasks]);
?>
