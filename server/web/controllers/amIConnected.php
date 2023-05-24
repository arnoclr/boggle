<?php

$stmt = $pdo->prepare("SELECT * FROM players WHERE email = :email AND name LIKE :name");
$stmt->execute([
    "email" => $_SESSION['player_email'],
    "name" => "%."
]);

$playerWithDefaultName = $stmt->fetch();

respondWithSuccessJSON([
    "connected" => isset($_SESSION['player_email']),
    "suggestNameChange" => $playerWithDefaultName !== false,
    "currentName" => $playerWithDefaultName->name ?? null
]);
