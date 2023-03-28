<?php

try {
    assertParamsExists(["email"], $_POST);
} catch (Exception $e) {
    respondWithErrorJSON($e->getMessage());
}

$email = $_POST['email'];

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    respondWithErrorJSON("L'adresse email n'est pas valide");
}

try {
    $playerName = "user-" . random_int(1000, 9999);

    $query = $pdo->prepare("SELECT * FROM players WHERE email = :email");
    $query->execute([
        "email" => $email
    ]);

    $player = $query->fetch();

    if ($player) {
        respondWithErrorJSONAndStatus("Un utilisateur avec cette adresse email existe déjà", "email_already_used");
    }

    $query = $pdo->prepare("INSERT INTO players (email, name, createdAt, lastConnection, isPrivateAccount) VALUES (:email, :name, NOW(), NOW(), :isPrivateAccount)");
    $query->execute([
        "email" => $email,
        "name" => $playerName,
        "isPrivateAccount" => "0"
    ]);

    $id = $pdo->lastInsertId();

    respondWithSuccessJSON([
        "id" => $id,
        "name" => $playerName,
        "email" => $email
    ]);
} catch (Exception $e) {
    // respondWithErrorJSON("Une erreur est survenue lors de la création de l'utilisateur");
    respondWithErrorJSON($e->getMessage());
}
