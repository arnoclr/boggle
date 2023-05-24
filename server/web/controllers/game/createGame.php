<?php

require "lib/readableRandomString.php";

$rrs = new RandomReadableString();

try {
    assertParamsExists(["isPrivateGame"], $_POST);
    assertUserIsConnected();
} catch (Exception $e) {
    respondWithErrorJSON($e->getMessage());
}

$stmt = $pdo->prepare("SELECT g.publicId FROM players p JOIN gamesplayers gp ON p.idPlayer = gp.idPlayer JOIN games g ON gp.idGame = g.idGame WHERE p.email = :email AND g.endedAt > NOW() LIMIT 1;");
$stmt->execute([
    "email" => $_SESSION['player_email']
]);

$lastGame = $stmt->fetch();

if ($lastGame) {
    respondWithErrorJSONAndStatus($lastGame->publicId, "already_in_game");
}

$stmt = $pdo->prepare("SELECT g.publicId FROM players p JOIN gamesplayers gp ON p.idPlayer = gp.idPlayer JOIN games g ON gp.idGame = g.idGame WHERE p.email = :email AND g.endedAt > NOW() LIMIT 1;");
$stmt->execute([
    "email" => $_SESSION['player_email']
]);

$lastGame = $stmt->fetch();

if ($lastGame) {
    respondWithErrorJSONAndStatus($lastGame->publicId, "already_in_game");
}

$publicGameId = $rrs->rrs(5, 5);

function getGrid(int $size): string
{
    exec("../engine/grid_build.bin ../engine/grid_build/frequence.txt $size $size", $out, $ret);
    return $out[0];
}

function getSolutionsCount(string $grid): int
{
    exec("../engine/solve.bin ../engine/dico.lex 3 4 4 " . $grid, $a, $b);
    $words = array_unique(explode(" ", $a[0]));
    return count($words);
}

$grid = getGrid(4);
$solutionsCount = getSolutionsCount($grid);

while ($solutionsCount < 15) {
    $grid = getGrid(4);
    $solutionsCount = getSolutionsCount($grid);
}

$ins = $pdo->prepare("INSERT INTO games (grid, createdAt, isPrivateGame, publicId) VALUES (:grid, NOW(), :isPrivateGame, :publicId)");
$ins->execute([
    "grid" => $grid,
    "isPrivateGame" => $_POST['isPrivateGame'] === "true" ? 1 : 0,
    "publicId" => $publicGameId
]);

respondWithSuccessJSON([
    "publicGameId" => $publicGameId
]);
