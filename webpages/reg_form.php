<?php
$host = '212.107.17.1';
$db = 'u921949114_discoveria_';
$user = 'u921949114_admin_';
$pass = 'w4bF&9zDp#q@X6yS';
$charset = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
} catch (\PDOException $e) {
    die("Database connection failed.");
}
session_start();
session_unset();
session_destroy();

session_start();

function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateEmail($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePassword($password, $confirmpassword) 
{
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
        die("Passwords doesn't match.");
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $verificationToken = bin2hex(random_bytes(16));

    try {
        $stmt = $pdo->prepare("INSERT INTO user (username, email, password) VALUES (:username, :email, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);

        $stmt->execute();

        $userid = $pdo->lastInsertId();

        $_SESSION['user_id'] = $userid;

        echo "Registration successful.";
        header("Location: user_view.php?userid=" . $_SESSION['user_id']);
    } catch (\PDOException $e) {
        echo "User already exists.";
    }
}
