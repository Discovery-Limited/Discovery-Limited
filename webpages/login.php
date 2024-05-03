<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

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

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = test_input($_POST['email']);
    $password = test_input($_POST['password']);

    if (!validateEmail($email)) {
        die("Invalid email format.");
    }

    try {
        $stmt = $pdo->prepare("SELECT user_id, username, password FROM user WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['username'] = $user['username'];
            header("Location: user_view.php");
            exit;
        } else {
            die("Invalid email or password.");
        }
    } catch (\PDOException $e) {
        die("An error occurred: " . $e->getMessage());
    }
}
?>
