<?php

/*
- Affichage que si la personne a un compte publique (verification en faisant la condition dans la requete SQL directement)
- Affichage infos sur joueur, nom, stats générales ...
- Affichage de l'historique avec possibilité de cliquer sur une partie et sa ramène vers /g/ID partie. La aussi il faut quelques stats générales sur la partie, donc meilleur mot trouvé par le joueur, sa position dans le classement, nombre de mots trouvés, score, joueurs présents, date ...
- En bonus : affichage des PP et possibilité de les choisir parmis une liste
*/

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
    SELECT g.grid, g.startedAt, g.endedAt, g.publicId
    from games g
    JOIN gamesplayers gp ON g.idGame = gp.idGame
    JOIN players p ON gp.idPlayer = p.idPlayer
    WHERE p.idPlayer = :idPlayer
");
$stmt->execute([
    "idPlayer" => $user->idPlayer
]);

$games = $stmt->fetchAll();

respondWithSuccessJSON([
    "userName" => $user->name,
    "isPublic" => $user->isPrivateAccount == 0,
    "totalGames" => $totalGames->totalGames ?? 0,
    "totalScore" => $stats->totalScore ?? 0,
    "totalWordsFound" => $stats->totalWordsFound ?? 0,
    "games" => $games ?? []
]);