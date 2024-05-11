<?php
header('Content-Type: application/json');

// Database Configuration
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

// checks for POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($_SESSION['user_id'])) {
        $task_id = $data['taskId'];
        $status = $data['status'];
        
        // changes the status of task
        $stmt = $pdo->prepare("UPDATE task SET status = :status WHERE task_id = :task_id");
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':task_id', $task_id);
        $stmt->execute();

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'User not logged in']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
