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
$project_id = $input['project_id'] ?? null;
$contributors = $input['contributors'] ?? null;

if ($project_id) {
    $projectLeaveQuery = $pdo->prepare("UPDATE user_project SET is_left = 1 WHERE project_id = :project_id AND user_id = :user_id");
    $projectLeaveQuery->execute([
        'project_id' => $project_id,
        'user_id' => $_SESSION['user_id']
    ]);

    $updateContributorsQuery = $pdo->prepare("UPDATE project SET contributors = :contributors WHERE project_id = :project_id");
    $updateContributorsQuery->execute([
        'project_id' => $project_id,
        'contributors' => $contributors
    ]);

    if ($projectLeaveQuery->rowCount() > 0 && $updateContributorsQuery->rowCount() > 0 ) {
        echo json_encode(['success' => true, 'message' => 'Successfully left the project.']);
    } else {
        echo json_encode(['error' => 'Failed to leave the project or already left.']);
    }
} else {
    echo json_encode(['error' => 'Project ID is required']);
}
?>
