<?php

$email = $_POST['userEmail'] ?? null;

// On va chercher l'utilisateur dans la base de données
$stmt = $pdo->prepare("SELECT * FROM players WHERE email = :email");
$stmt->execute([
    "email" => $email
]);

$user = $stmt->fetch();

if (!$user) {
    respondWithErrorJSON("user_email_not_found");
}

respondWithSuccessJSON($user->name);
