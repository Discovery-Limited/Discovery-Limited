<?php
session_start();
header('Content-Type: application/json');

// checks if there is a Post request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    // sets project id into session
    if (isset($input['projectID'])) {
        $_SESSION['project_id'] = $input['projectID'];
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Project ID not provided']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}

?>
