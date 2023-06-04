<?php

if (!isset($_SESSION['player_email'])) {
    respondWithErrorJSON("Vous n'êtes pas connecté");
}

sleep(1);

$token = secureRandomToken(64);

$pdo->prepare("UPDATE players SET websocketToken = :token WHERE email = :email")
    ->execute([
        "token" => $token,
        "email" => $_SESSION['player_email']
    ]);

respondWithSuccessJSON([
    "token" => $token
]);
