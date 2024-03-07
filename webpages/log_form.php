<?php
session_start();
session_unset();
session_destroy();

session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = '212.107.17.1';
$db = 'u921949114_discoveria';
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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = test_input($_POST['email']);
    $password = test_input($_POST['password']);

    if (!validateEmail($email)) {
        die("Invalid email format.");
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM DB_accounts WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['userid'] = $user['id'];
            $_SESSION['username'] = $user['username'];

            header("Location: user_view.php?userid=" . $_SESSION['userid']);
            exit();
        }
    } catch (\PDOException $e) {
        echo "Error occurred during login.";
    }
}
?>