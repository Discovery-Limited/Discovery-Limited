<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database configuration
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

// Destroy user session
session_start();
session_destroy();

include 'index.html';
?>