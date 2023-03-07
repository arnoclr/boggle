<?php


// TODO: retirer le test et mettre la connexion à part
$pdo = new PDO("mysql:host=db;port=3306;dbname=boggle", "boggle", "password");

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$action = $_GET['action'] ?? null;

$controller = "controllers" . DIRECTORY_SEPARATOR . $action . ".php";

require "functions/utils.php";

if (file_exists($controller)) {
    require $controller;
} else {
    require "views/404.php";
}
