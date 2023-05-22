<?php

require "vendor/autoload.php";
require "env.php";

session_start();

$onlineUrl = FRONT_END_PROTOCOL . "://" . FRONT_END_HOST . (FRONT_END_PORT ? ":" . FRONT_END_PORT : "");
$authorizedOrigins = [$onlineUrl, "http://localhost:5173"];
$origin = $_SERVER['HTTP_ORIGIN'] ?? "";
$allowOrigin = in_array($origin, $authorizedOrigins) ? $origin : $onlineUrl;

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
    header("HTTP/1.0 500 Internal Server Error");
}
