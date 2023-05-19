<?php

require "vendor/autoload.php";
require "env.php";

session_start();

$allowOrigin = FRONT_END_PROTOCOL . "://" . FRONT_END_HOST . (FRONT_END_PORT ? ":" . FRONT_END_PORT : "");

header('Access-Control-Allow-Origin: ' . $allowOrigin);
header('Access-Control-Allow-Credentials: true');

$pdo = new PDO("mysql:host=" . DB_HOST . ";port=3306;dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

$action = $_GET['action'] ?? "";

$controller = "controllers" . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, explode(".", $action)) . ".php";

require "functions/utils.php";

if (file_exists($controller)) {
    require $controller;
} else {
    require "views/404.php";
}
