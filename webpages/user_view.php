<?php

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

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

session_start();

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $pdo->prepare("SELECT username FROM user WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $user = $stmt->fetch();

    if ($user) {
        $username = $user['username'];
        
        // Query to fetch all projects associated with this user
        $projectQuery = $pdo->prepare("SELECT p.project_id, p.project_name 
                                       FROM project p 
                                       JOIN user_project up ON p.project_id = up.project_id 
                                       WHERE up.user_id = :user_id");
        $projectQuery->execute(['user_id' => $user_id]);
        $projects = $projectQuery->fetchAll();

        include 'userView.html'; // Assuming userView.html will handle the display of projects
    } else {
        echo "No user found.";
    }
} else {
    header("Location: login.php");
    exit();
}

?>

