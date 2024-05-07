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

$user_id = $_SESSION['user_id'];

$projectQuery = $pdo->prepare("SELECT p.project_id, p.project_name, contributors
                               FROM project p 
                               JOIN user_project up ON p.project_id = up.project_id 
                               WHERE p.is_deleted = 0 AND up.is_left = 0 AND up.user_id = :user_id");
$projectQuery->execute(['user_id' => $user_id]);
$projects = $projectQuery->fetchAll(PDO::FETCH_ASSOC);

if ($projects) {
    foreach ($projects as &$project) {
        $taskQuery = $pdo->prepare("SELECT t.status  
                                    FROM task t 
                                    WHERE t.project_id = :project_id");
        $taskQuery->execute(['project_id' => $project['project_id']]);
        $tasks = $taskQuery->fetchAll(PDO::FETCH_ASSOC);
        $project['tasks'] = $tasks;  // Add tasks to the project
    }
    unset($project);  // Break the reference with the last element
}

echo json_encode($projects);
?>
