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

$projectQuery = $pdo->prepare("SELECT p.project_id, p.project_name, p.contributors, p.admin_id
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
    foreach ($projects as &$project) {
        $taskUserQuery = $pdo->prepare("SELECT u.user_id  
                                        FROM user u
                                        JOIN user_task ut ON u.user_id = ut.user_id
                                        JOIN task t ON t.task_id = ut.task_id 
                                        WHERE t.project_id = :project_id");
        $taskUserQuery->execute(['project_id' => $project['project_id']]);
        $taskUsers = $taskUserQuery->fetchAll(PDO::FETCH_COLUMN, 0); 
        $userCount = array_count_values($taskUsers)[$user_id] ?? 0;
        $project['user_task_count'] = $userCount;

    }
    unset($project);  // Break the reference with the last element
    foreach ($projects as &$project) {
        $userQuery = $pdo->prepare("SELECT u.email  
                                    FROM user u
                                    JOIN user_project up ON u.user_id = up.user_id
                                    JOIN project p ON up.project_id = p.project_id 
                                    WHERE p.is_deleted = 0 AND up.is_left = 0 AND p.project_id = :project_id");
        $userQuery->execute(['project_id' => $project['project_id']]);
        $users = $userQuery->fetchAll(PDO::FETCH_ASSOC);
        $project['projectUsers'] = $users;  // Add users to the project
    }
    unset($project);  // Break the reference with the last element
    foreach ($projects as &$project) {
        $adminQuery = $pdo->prepare("SELECT u.email  
                                    FROM user u
                                    WHERE u.user_id = :user_id");
        $adminQuery->execute(['user_id' => $project['admin_id']]);
        $admin = $adminQuery->fetch(PDO::FETCH_COLUMN, 0);
        $project['adminEmail'] = $admin;  // Add users to the project
        $project['user'] = $_SESSION['user_id'];
    }
    unset($project);  // Break the reference with the last element
}

echo json_encode($projects);
?>
