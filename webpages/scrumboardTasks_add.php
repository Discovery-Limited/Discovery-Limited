<?php
header('Content-Type: application/json');
$config = require 'config.php';

try {
    $pdo = new PDO("mysql:host={$config['db']['host']};dbname={$config['db']['dbname']};charset={$config['db']['charset']}", $config['db']['user'], $config['db']['pass'], $config['options']);
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['error' => 'User not logged in']);
        exit;
    }

    if (!isset($_SESSION['project_id'])) {
        echo json_encode(['error' => 'Project ID not set in session']);
        exit;
    }

    // Extract task details from POST request
    $task_name = $_POST['task_name'];
    $deadline = $_POST['deadline'];
    $description = $_POST['description'];
    $scrumboard_id = $_POST['scrumboard_id'];
    $status = $_POST['status'];
    $tag = $_POST['tag']; 
    $tag_color = $_POST['tag_color']; 
    $project_id = $_SESSION['project_id'];
    $upload_time = date("Y-m-d H:i:s");  // Get current date and time

    // Insert task into the 'task' table
    $stmt = $pdo->prepare("INSERT INTO task (task_name, deadline, description, status, tag, tag_color, project_id, upload_time) VALUES (:task_name, :deadline, :description, :status, :tag, :tag_color, :project_id, :upload_time)");
    $stmt->execute(['task_name' => $task_name, 'deadline' => $deadline, 'description' => $description, 'status' => $status, 'tag' => $tag, 'tag_color' => $tag_color, 'project_id' => $project_id, 'upload_time' => $upload_time]);
    $task_id = $pdo->lastInsertId();

    // Process each assignee
    foreach ($_POST['assignees'] as $email) {
        // Find user ID by email
        $userStmt = $pdo->prepare("SELECT user_id FROM user WHERE email = :email");
        $userStmt->execute(['email' => $email]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        // Insert into 'user_task'
        if ($user) {
            $stmt = $pdo->prepare("INSERT INTO user_task (user_id, task_id) VALUES (:user_id, :task_id)");
            $stmt->execute(['user_id' => $user['user_id'], 'task_id' => $task_id]);
        }
    }

    echo json_encode(['success' => true, 'task_id' => $task_id]);
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
