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
    die("Database connection failed: " . $e->getMessage());
}

session_start();

$email_addresses = isset($_POST['emails']) ? explode(',', $_POST['emails']) : [];

if (isset($_SESSION['user_id'])) {

    if (!empty($email_addresses)) {
        foreach ($email_addresses as $email) {
            $stmt = $pdo->prepare("SELECT user_id, username FROM user WHERE email = :email");
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

    echo $user_id + "is added to the project.";
    header('Location: fetch_projects.php');
} else {
    echo json_encode(['error' => 'User not logged in']);
}
?>