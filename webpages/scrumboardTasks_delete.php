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
    die("Database connection failed: " . $e->getMessage());
}

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $taskId = $data['task_id'];

    $stmt = $pdo->prepare("DELETE FROM task WHERE task_id = :task_id");
    $stmt->execute(['task_id' => $taskId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
        exit;
    } else {
        echo json_encode(['success' => false, 'error' => 'Task not found or could not be deleted']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

?>