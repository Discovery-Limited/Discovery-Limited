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

if (isset($_SESSION['userid'])) {
    $userid = $_SESSION['userid'];

    $stmt = $pdo->prepare("SELECT username FROM DB_accounts WHERE id = :userid");
    $stmt->execute(['userid' => $userid]);
    $user = $stmt->fetch();
    $username = $user['username'];

    include 'userView.html';
} else {
    header("Location: login.php");
    exit();
}
?>
