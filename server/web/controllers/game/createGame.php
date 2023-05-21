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
