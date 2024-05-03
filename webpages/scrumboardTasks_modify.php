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
        $taskId = $_POST['task_id'];
        $taskTitle = $_POST['task_title'];
        $description = $_POST['description'];
        $deadline = $_POST['deadline'];
        $tag = $_POST['tag']; 
        $tagColor = $_POST['tag_color']; 
        
        $stmt = $pdo->prepare("UPDATE task SET task_name = :task_name, description = :description, deadline = :deadline, tag = :tag, tag_color = :tag_color WHERE task_id = :task_id");
        $stmt->bindValue(':task_name', $taskTitle);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':deadline', $deadline);
        $stmt->bindValue(':tag', $tag);
        $stmt->bindValue(':tag_color', $tagColor);
        $stmt->bindValue(':task_id', $taskId);
        $stmt->execute();

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'User not logged in']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
