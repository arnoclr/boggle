<?php

$userName = $_POST['userName'] ?? null;

if (!$userName) {
    // TODO: Récupérer le nom de l'utilisateur connecté
}

$stmt = $pdo->prepare("SELECT * FROM players WHERE name = :userName");
$stmt->execute([
    "userName" => $userName
]);

$user = $stmt->fetch();

if (!$user) {
    respondWithErrorJSON("user_not_found");
}

$stmt = $pdo->prepare("SELECT COUNT(*) AS totalGames FROM gamesplayers WHERE idPlayer = :idPlayer");
$stmt->execute([
    "idPlayer" => $user->idPlayer
]);

$totalGames = $stmt->fetch();

$stmt = $pdo->prepare("
    SELECT 
        SUM(score) AS totalScore,
        COUNT(*) AS totalWordsFound
    FROM 
        wordsfound 
    WHERE 
        idPlayer = :idPlayer
");
$stmt->execute([
    "idPlayer" => $user->idPlayer
]);

$stats = $stmt->fetch();

$stmt = $pdo->prepare("
    SELECT *
    from games g
    JOIN gamesplayers gp ON g.idGame = gp.idGame
    JOIN players p ON gp.idPlayer = p.idPlayer
    WHERE p.idPlayer = :idPlayer
");
$stmt->execute([
    "idPlayer" => $user->idPlayer
]);

$games = $stmt->fetchAll();

$gamesStats = [];
// On va parcourir les parties et récupérer les stats de chaque partie ainsi que les mots trouvés, le score, le meilleur mot,etc
foreach ($games as $game) {
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) AS totalWordsFound,
            SUM(score) AS totalScore
        FROM 
            wordsfound 
        WHERE 
            idPlayer = :idPlayer AND idGame = :idGame
    ");
    $stmt->execute([
        "idPlayer" => $user->idPlayer,
        "idGame" => $game->idGame
    ]);

    $gameStats = $stmt->fetch();

    $stmt = $pdo->prepare("
        SELECT 
            word,
            score
        FROM 
            wordsfound
        WHERE 
            idPlayer = :idPlayer AND idGame = :idGame
        ORDER BY score DESC
        LIMIT 1
    ");
    $stmt->execute([
        "idPlayer" => $user->idPlayer,
        "idGame" => $game->idGame
    ]);

    $bestWord = $stmt->fetch();

    $gamesStats[] = [
        "publicId" => $game->publicId,
        "startedAt" => $game->startedAt,

        "totalWordsFound" => $gameStats->totalWordsFound,
        "totalScore" => $gameStats->totalScore ?? 0,
        "bestWord" => $bestWord->word ?? null,
        "bestWordScore" => $bestWord->score ?? 0
    ];
}

respondWithSuccessJSON([
    "userName" => $user->name,
    "isPublic" => $user->isPrivateAccount == 0,
    "totalGames" => $totalGames->totalGames ?? 0,
    "totalScore" => $stats->totalScore ?? 0,
    "totalWordsFound" => $stats->totalWordsFound ?? 0,
    "games" => $gamesStats ?? []
]);