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

// Check if the user is logged in
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $projectQuery = $pdo->prepare("SELECT p.project_id, p.project_name, contributors 
                                   FROM project p 
                                   JOIN user_project up ON p.project_id = up.project_id 
                                   WHERE up.user_id = :user_id and up.is_left = 0");
    $projectQuery->execute(['user_id' => $user_id]);
    $projects = $projectQuery->fetchAll(PDO::FETCH_ASSOC);

    // Encode data as JSON and output it
    echo json_encode($projects);
} else {
    echo json_encode(['error' => 'User not logged in']);
}
?>
