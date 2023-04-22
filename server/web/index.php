<?php

session_start();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

require "vendor/autoload.php";
require "env.php";

$pdo = new PDO("mysql:host=" . DB_HOST . ";port=3306;dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$action = $_GET['action'] ?? null;

$controller = "controllers" . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, explode(".", $action)) . ".php";

require "functions/utils.php";

if (file_exists($controller)) {
    require $controller;
} else {
    require "views/404.php";
}
