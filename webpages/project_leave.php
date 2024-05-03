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

    $projectLeaveQuery = $pdo->prepare("UPDATE user_project up SET up.is_left = 1 
                                   FROM user_project up  
                                   WHERE up.project_id = :project_id");
    $projectLeaveQuery->execute(['project_id' => $project_id]);

    echo $_SESSION['user_id'] + "left the" + $project_name;
    header('Location: fetch_projects.php');
} else {
    echo json_encode(['error' => 'User not logged in']);
}
?>