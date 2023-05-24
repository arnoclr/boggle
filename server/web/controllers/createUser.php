<?php

require "lib/readableRandomString.php";

$rrs = new RandomReadableString();

$webauthn = new \Davidearl\WebAuthn\WebAuthn(FRONT_END_HOST);

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
    $playerName = "." . $rrs->rrs(7, 7);

    $query = $pdo->prepare("SELECT * FROM players WHERE email = :email");
    $query->execute([
        "email" => $email
    ]);

    $player = $query->fetch();

    if ($player) {
        respondWithErrorJSONAndStatus("Un utilisateur avec cette adresse email existe déjà", "email_already_used");
    }

    $userid = md5(time() . '-' . rand(1, 1000000000));

    $passkeyRecord = (object)[
        'name' => $email,
        'id' => $userid,
        'webauthnkeys' => $webauthn->cancel()
    ];

    $query = $pdo->prepare("INSERT INTO players (email, name, createdAt, lastConnection, isPrivateAccount, passkey) VALUES (:email, :name, NOW(), NOW(), :isPrivateAccount, :passkey)");
    $query->execute([
        "email" => $email,
        "name" => $playerName,
        "isPrivateAccount" => "0",
        "passkey" => json_encode($passkeyRecord)
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
