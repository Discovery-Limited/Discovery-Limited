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


function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePassword($password, $confirmpassword) {
    return $password === $confirmpassword;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = test_input($_POST['username']);
    $email = test_input($_POST['email']);
    $password = test_input($_POST['password']);
    $confirmpassword = test_input($_POST['confirmpassword']);

    if (!validateEmail($email)) {
        die("Invalid email format.");
    }

    if (!validatePassword($password, $confirmpassword)) {
        die("Passwords don't match.");
    }

    // Check if the email already exists
    $stmt = $pdo->prepare("SELECT email FROM user WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        die("Email already exists.");
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO user (username, email, password) VALUES (:username, :email, :password)");
        $stmt->execute(['username' => $username, 'email' => $email, 'password' => $hashed_password]);

        $_SESSION['user_id'] = $pdo->lastInsertId();
        header("Location: user_view.php");
        exit;
    } catch (\PDOException $e) {
        die("An error occurred: " . $e->getMessage());
    }
}
?>
