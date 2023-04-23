<?php

require "lib/readableRandomString.php";

$rrs = new RandomReadableString();

try {
    assertParamsExists(["isPrivateGame"], $_POST);
} catch (Exception $e) {
    respondWithErrorJSON($e->getMessage());
}

if (!isset($_SESSION['player_email'])) {
    respondWithErrorJSON("Vous n'êtes pas connecté");
}

$publicGameId = $rrs->rrs(5, 5);

exec("../engine/grid_build ../engine/frequence.txt 4 4", $out, $ret);
$grid = $out[0];

$ins = $pdo->prepare("INSERT INTO games (grid, createdAt, isPrivateGame, publicId) VALUES (:grid, NOW(), :isPrivateGame, :publicId)");
$ins->execute([
    "grid" => $grid,
    "isPrivateGame" => $_POST['isPrivateGame'] === "true" ? 1 : 0,
    "publicId" => $publicGameId
]);

respondWithSuccessJSON([
    "publicGameId" => $publicGameId
]);
