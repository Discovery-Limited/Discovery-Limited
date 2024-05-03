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

    $stmt = $pdo->prepare("UPDATE task SET is_deleted = 1 WHERE task_id = :task_id");
    $stmt->execute(['task_id' => $task_id]);

    echo $task_id + "is deleted.";
    header('Location: fetch_scrumboardTasks.php');
} else {
    echo json_encode(['error' => 'User not logged in']);
}
?>