<?php

// Database Configuration
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

// Hashes password to be ready to put in database
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Validates email by checking the database
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Validates password by both checking confirm password and
// actual password
function validatePassword($password, $confirmpassword) {
    return $password === $confirmpassword;
}

// Gets the POST request from form
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = test_input($_POST['username']);
    $email = test_input($_POST['email']);
    $password = test_input($_POST['password']);
    $confirmpassword = test_input($_POST['confirmpassword']);

    // Checks email and password availability
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

    // Post user data into database
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
