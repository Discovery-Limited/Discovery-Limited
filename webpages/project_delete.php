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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['project_id']) && !empty($input['project_id'])) {
    $project_id = $input['project_id'];

    $projectDeleteQuery = $pdo->prepare("UPDATE project SET is_deleted = 1 WHERE project_id = :project_id");
    $projectDeleteQuery->execute(['project_id' => $project_id]);

    if ($projectDeleteQuery->rowCount() > 0) {
        echo json_encode(['success' => "Project successfully deleted."]);
    } else {
        echo json_encode(['error' => "No project found with that ID or it might already be deleted."]);
    }
} else {
    echo json_encode(['error' => 'Project ID is required']);
}
?>