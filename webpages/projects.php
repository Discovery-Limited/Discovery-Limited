<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// Database credentials
$host = '212.107.17.1';
$db = 'u921949114_discoveria_';
$user = 'u921949114_admin_';
$pass = 'w4bF&9zDp#q@X6yS';
$charset = 'utf8mb4';

// Data Source Name (DSN)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$project_name = $_POST['project_name'] ?? '';
$email_addresses = isset($_POST['emails']) ? explode(',', $_POST['emails']) : [];

// Begin a transaction
$pdo->beginTransaction();

try {
    // Insert new project
    $stmt = $pdo->prepare("INSERT INTO project (project_name) VALUES (:project_name)");
    $stmt->bindParam(':project_name', $project_name);
    $stmt->execute();
    $project_id = $pdo->lastInsertId();

    // Add creator to the user_project
    $stmt = $pdo->prepare("INSERT INTO user_project (project_id, user_id) VALUES (:project_id, :user_id)");
    $stmt->bindParam(':project_id', $project_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    // Add other users if emails were provided
    if (!empty($email_addresses)) {
        foreach ($email_addresses as $email) {
            $stmt = $pdo->prepare("SELECT user_id FROM user WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $user = $stmt->fetch();

            if ($user) {
                $stmt = $pdo->prepare("INSERT INTO user_project (project_id, user_id) VALUES (:project_id, :user_id)");
                $stmt->bindParam(':project_id', $project_id);
                $stmt->bindParam(':user_id', $user['user_id']);
                $stmt->execute();
            }
        }
    }

    // Commit the transaction
    $pdo->commit();
    header('Location: user_view.php');
} catch (\PDOException $e) {
    // Rollback the transaction on error
    $pdo->rollBack();
    echo "An error occurred: " . $e->getMessage();
}
?>
