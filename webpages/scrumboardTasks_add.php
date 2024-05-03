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
    if (isset($_SESSION['user_id'])) {
        // Process form data
        $task_name = $_POST['task_name'];
        $deadline = $_POST['deadline'];
        $description = $_POST['description'];
        $scrumboard_id = $_POST['scrumboard_id'];
        $status = $_POST['status'];
        // INSERT INTO task (task_name, deadline, description, status, scrumboard_id) VALUES ("Taskname", "2222,02,02", "description", 1, 0)
        $stmt = $pdo->prepare("INSERT INTO task (task_name, deadline, description, status, scrumboard_id) VALUES (:task_name, :deadline, :description, :status, :scrumboard_id)");
        $stmt->execute(['task_name' => $task_name, 'deadline' => $deadline, 'description' => $description, 'status' => $status, 'scrumboard_id' => $scrumboard_id]);
        $task_id = $pdo->lastInsertId();

        echo json_encode(['success' => true, 'task_id' => $task_id]);
    } else {
        echo json_encode(['error' => 'User not logged in']);
    }
} else {
    // Handle invalid request method
    echo json_encode(['error' => 'Invalid request method']);
}
?>