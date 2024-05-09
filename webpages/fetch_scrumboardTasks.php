<?php
header('Content-Type: application/json');

// Database configuration
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
    // Gets scrumboard tasks data
    $scrumboardTaskQuery = $pdo->prepare("SELECT t.task_id, t.task_name, t.deadline, t.assignee_id, t.description, t.scrumboard_id 
                                   FROM task t
                                   JOIN scrumboard s ON s.scrumboard_id = t.scrumboard_id 
                                   JOIN project p ON p.project_id = s.scrumboard_id
                                   WHERE p.project_id = :project_id AND t.is_deleted = 0");
    $scrumboardTaskQuery->execute(['project_id' => $project_id]);
    $scrumboardTasks = $scrumboardTaskQuery->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($scrumboardTasks);
} else {
    echo json_encode(['error' => 'User not logged in']);
}
?>