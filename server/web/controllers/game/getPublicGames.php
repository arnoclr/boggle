<?php

$get = $pdo->query(<<<SQL
SELECT publicId, createdAt, COUNT(idPlayer) as playersInRoom 
FROM games g 
RIGHT JOIN gamesplayers gp 
    ON g.idGame = gp.idGame 
WHERE isPrivateGame = 0 
    AND startedAt IS NULL
GROUP BY publicId, createdAt
ORDER BY createdAt DESC
LIMIT 15
SQL);

$games = $get->fetchAll();

respondWithSuccessJSON($games);
