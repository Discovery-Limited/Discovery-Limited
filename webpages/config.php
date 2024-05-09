<?php
// For security reasons, database configuration
// kept in different file
return [
    'db' => [
        'host' => '212.107.17.1',
        'dbname' => 'u921949114_discoveria_',
        'user' => 'u921949114_admin_',
        'pass' => 'w4bF&9zDp#q@X6yS',
        'charset' => 'utf8mb4'
    ],
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
];
?>
