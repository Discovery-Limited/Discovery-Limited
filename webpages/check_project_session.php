<?php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['project_id']) && !empty($_SESSION['project_id'])) {
    echo json_encode(['projectID' => $_SESSION['project_id']]);
} else {
    echo json_encode(['error' => 'Project ID not set in session']);
}
?>
