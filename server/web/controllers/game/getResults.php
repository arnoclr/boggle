<?php

try {
    assertUserIsConnected();
    assertParamsExists(['publicGameId'], $_POST);
} catch (Exception $e) {
    respondWithErrorJSON($e->getMessage());
}

$publicGameId = $_POST['publicGameId'];

$get = $pdo->prepare(<<<SQL
SELECT * FROM games 
WHERE publicId = :publicId
AND endedAt IS NOT NULL
AND endedAt > NOW()
SQL);

$get->execute([
    ':publicId' => $publicGameId
]);

$game = $get->fetch();

if ($game) {
    respondWithErrorJSONAndStatus("La partie n'est pas terminée", "game_is_active");
}

$get = $pdo->prepare(<<<SQL
SELECT p.name, SUM(wf.score) AS score
FROM games g
JOIN gamesplayers gp ON gp.idGame = g.idGame
JOIN players p ON p.idPlayer = gp.idPlayer
JOIN wordsfound wf ON wf.idGame = g.idGame AND wf.idPlayer = p.idPlayer
WHERE g.publicId = :publicId
GROUP BY p.name;
SQL);

$get->execute([
    ':publicId' => $publicGameId
]);

$players = $get->fetchAll();

respondWithSuccessJSON($players);
