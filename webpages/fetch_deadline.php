<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

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
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

$user_id = $_SESSION['user_id'];

try {
    // Prepare and execute the stored procedure
    $stmt = $pdo->prepare("CALL GetTasksForUser(:user_id)");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch all results
    $tasks = $stmt->fetchAll();

    // Output results
    echo json_encode($tasks);

} catch (PDOException $e) {
    echo "Error executing stored procedure: " . $e->getMessage();
}

?>
