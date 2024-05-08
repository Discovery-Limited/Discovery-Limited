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

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['task_id']) && !empty($input['task_id'])) {
    $task_id = $input['task_id'];

    $taskFinishQuery = $pdo->prepare("UPDATE task SET status = 'done' WHERE task_id = :task_id");
    $taskFinishQuery->execute(['task_id' => $task_id]);

    if ($taskFinishQuery->rowCount() > 0) {
        echo json_encode(['success' => "Task successfully finished."]);
    } else {
        echo json_encode(['error' => "No task found with that ID or it might already be finished."]);
    }
} else {
    echo json_encode(['error' => 'Task ID is required']);
}
?>