<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

function redirect($url) {
    header("Location: $url");
    exit;
}

// Load the configuration file
$config = require 'config.php';

// Database configuration
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
    redirect("login.php");
}

// Getting data from form
$user_id = $_SESSION['user_id'];
$project_name = $_POST['project_name'] ?? '';
$email_addresses = isset($_POST['emails']) ? explode(',', $_POST['emails']) : [];

// Begin a transaction
$pdo->beginTransaction();

try {
    // Inserting a new project
    $stmt = $pdo->prepare("INSERT INTO project (project_name, admin_id) VALUES (:project_name, :user_id)");
    $stmt->bindParam(':project_name', $project_name);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    $project_id = $pdo->lastInsertId();

    // Adding creator to the project by user_project table
    $stmt = $pdo->prepare("INSERT INTO user_project (project_id, user_id) VALUES (:project_id, :user_id)");
    $stmt->bindParam(':project_id', $project_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    // Adding other users if user emails were provided
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

    // Updating contributor count according to the user emails
    $stmt = $pdo->prepare("UPDATE project SET contributors = :contributors WHERE project_id = :project_id");
    $stmt->bindParam(':contributors', $contributors);
    $stmt->bindParam(':project_id', $project_id);
    $stmt->execute();

    // Commit the transaction
    $pdo->commit();
    redirect('user_view.php');
} catch (\PDOException $e) {
    // Rollback the transaction on error
    $pdo->rollBack();
    echo "An error occurred: " . $e->getMessage();
}
?>
