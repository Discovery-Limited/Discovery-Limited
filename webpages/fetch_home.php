<?php

header('Content-Type: application/json');  // Set content type to JSON

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();  // Start the session

// Load the configuration file
$config = require 'config.php';

try {
    // Create a PDO instance
    $pdo = new PDO(
        "mysql:host={$config['db']['host']};dbname={$config['db']['dbname']};charset={$config['db']['charset']}",
        $config['db']['user'],
        $config['db']['pass'],
        $config['options']
    );

    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
        
        $stmt = $pdo->prepare("SELECT username FROM user WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
    
        $username = $stmt->fetch();

        echo json_encode(['username' => $username]); 
        include 'home.html';
    } else {
        echo json_encode(['error' => 'User ID not set in session.']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => "Database error: " . $e->getMessage()]);
}

?>
