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

if (isset($_SESSION['user_id'])) {

    $stmt = $pdo->prepare("INSERT INTO task (task_name, deadline, description, scrumboard_id) VALUES (:task_name, :deadline, :description, :status, :scrumboard_id)");
    $stmt->execute(['task_name' => $task_name, 'deadline' => $deadline, 'description' => $description, $status => 'status', $scrumboard_id => 'scrumboard_id']);
    $task_id = $pdo->lastInsertId();

    echo $task_id + "is added to the scrumboard.";
    header('Location: fetch_scrumboardTasks.php');
} else {
    echo json_encode(['error' => 'User not logged in']);
}
?>