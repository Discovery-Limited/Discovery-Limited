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

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $pdo->prepare("SELECT username FROM user WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch();

    if ($user) {
        $username = $user['username'];
        
        // Query to fetch all projects associated with this user
        $projectQuery = $pdo->prepare("SELECT p.project_id, p.project_name 
                                       FROM project p 
                                       JOIN user_project up ON p.project_id = up.project_id 
                                       WHERE up.user_id = :user_id");
        $projectQuery->execute(['user_id' => $user_id]);
        $projects = $projectQuery->fetchAll();

        include 'userView.html'; // Assuming userView.html will handle the display of projects
    } else {
        echo "No user found.";
    }
} else {
    header("Location: login.php");
    exit();
}

?>

