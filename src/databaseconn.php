<?php

$host = "localhost";
$dbname = "database";
$username = "root";
$password = "";

$mysqli = new mysqli ($host,$username, $password, $dbname);

if ($mysqli->connect_errno) {
    die("Failed to Connect". $mysqli->connect_error);
}

return $mysqli;
