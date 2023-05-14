<?php

require "app/AntiCheat.php";

$get = $pdo->prepare("SELECT * FROM games WHERE publicId = :idGame");
$get->execute([
    "idGame" => $_GET['gameId']
]);

$game = $get->fetch();

$grid = explode(" ", $game->grid);

$cell = intval($_GET['cell']);

$ac = new AntiCheat();

// get seed by transforming hash to int

$seed = sha1($game->publicId . $cell . $game->created_at . $game->grid);
$seed = intval(substr($seed, 0, 8), 16);

$ac->returnImageFor($grid[$cell], 64, $seed);
