<?php
$host = '127.0.0.1:3306';
$db   = 'u921949114_discoveria';
$user = 'u921949114_root_admin';
$pass = 'w4bF&9zDp#q@X6yS';
$charset = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
} catch (\PDOException $e) {
    die("Database connection failed.");
}

session_start();
if (isset($_SESSION['loggedin']) || $_SESSION['loggedin'] === true) {
    header("Location: accessControl.html");
    exit;
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
    $username = test_input($_POST['username']);
    $email = test_input($_POST['email']);
    $password = test_input($_POST['password']);

    if (!validateEmail($email)) {
        die("Invalid email format.");
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $verificationToken = bin2hex(random_bytes(16));

    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, verification_token) VALUES (:username, :email, :password, :token)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':token', $verificationToken);

        $stmt->execute();

        echo "Registration successful, please verify your email.";
    } catch (\PDOException $e) {
        // todo falan 
    }
}
?>