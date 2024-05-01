<?php
session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

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
