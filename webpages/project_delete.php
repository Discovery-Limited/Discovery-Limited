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

    $projectDeleteQuery = $pdo->prepare("UPDATE project SET p.is_deleted = 1 
                                   FROM project p  
                                   WHERE p.project_id = :project_id");
    $projectDeleteQuery->execute(['project_id' => $project_id]);

    echo $project_name + "is deleted.";
    header('Location: fetch_projects.php');
} else {
    echo json_encode(['error' => 'User not logged in']);
}
?>