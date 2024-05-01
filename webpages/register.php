<?php
session_start();

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

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    exit("Database connection failed: " . $e->getMessage());
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
