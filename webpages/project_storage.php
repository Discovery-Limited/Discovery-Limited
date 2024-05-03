<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Load the configuration file
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

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$project_name = $_POST['project_name'] ?? '';
$email_addresses = isset($_POST['emails']) ? explode(',', $_POST['emails']) : [];

// Begin a transaction
$pdo->beginTransaction();

try {
    // Insert new project
    $stmt = $pdo->prepare("INSERT INTO project (project_name, admin_id) VALUES (:project_name, :user_id)");
    $stmt->bindParam(':project_name', $project_name);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    $project_id = $pdo->lastInsertId();

    // Insert new scrumboard
    $stmt = $pdo->prepare("INSERT INTO scrumboard (project_id) VALUES (:project_id)");
    $stmt->bindParam(':project_id', $project_id);
    $stmt->execute();
    $project_id = $pdo->lastInsertId();

    // Add creator to the user_project
    $stmt = $pdo->prepare("INSERT INTO user_project (project_id, user_id) VALUES (:project_id, :user_id)");
    $stmt->bindParam(':project_id', $project_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    // Add other users if emails were provided
    $contributors = 1;
    if (!empty($email_addresses)) {
        foreach ($email_addresses as $email) {
            $stmt = $pdo->prepare("SELECT user_id FROM user WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $user = $stmt->fetch();

            if ($user) {
                $stmt = $pdo->prepare("INSERT INTO user_project (project_id, user_id) VALUES (:project_id, :user_id)");
                $stmt->bindParam(':project_id', $project_id);
                $stmt->bindParam(':user_id', $user['user_id']);
                $stmt->execute();
                $contributors++;
            }
        }
    }

    $stmt = $pdo->prepare("UPDATE project SET contributors = :contributors WHERE project_id = :project_id");
    $stmt->bindParam(':contributors', $contributors);
    $stmt->bindParam(':project_id', $project_id);
    $stmt->execute();

    // Commit the transaction
    $pdo->commit();
    header('Location: user_view.php');
} catch (\PDOException $e) {
    // Rollback the transaction on error
    $pdo->rollBack();
    echo "An error occurred: " . $e->getMessage();
}
?>
