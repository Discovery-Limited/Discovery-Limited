<?php 
$name = $_POST["name"];
$email = $_POST["email"];
$password = $_POST["password"];
$password_confirmation = $_POST["password_confirmation"];
$terms = filter_input(INPUT_POST,"terms", FILTER_VALIDATE_BOOL);


if (empty($_POST["name"])) {
    die("Name is required");
}

if ( ! filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    die("Valid email is required");
}

if (strlen($_POST["password"]) < 8) {
    die("Password must be at least 8 characters");
}

if ( ! preg_match("/[a-z]/i", $_POST["password"])) {
    die("Password must contain at least one letter");
}

if ( ! preg_match("/[0-9]/", $_POST["password"])) {
    die("Password must contain at least one number");
}

if ($_POST["password"] !== $_POST["password_confirmation"]) {
    die("Passwords must match");
}

if (! $terms) {
    die("Terms and Conditions must be accepted");  
}

$password_hash = password_hash($_POST["password"], PASSWORD_DEFAULT);

$mysqli = require __DIR__ ."/databaseconn.php";

$sql ="INSERT INTO accounts (name, email, password_hash) VALUES (?, ?, ?)";

$stmt = $mysqli->stmt_init();

if ( ! $stmt->prepare($sql)) {
    die("Error SQL". $mysqli->error);   
}

$stmt->bind_param("sss",
                   $_POST ["name"] ,
                   $_POST ["email"],
                   $_POST["password"]);

                   if ($stmt->execute()) {

                    echo"Successful Signup";    
                   } else { 
                    die($mysqli->error." ".$mysqli->errno);
                   }
                


    
















