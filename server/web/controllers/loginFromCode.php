<?php

sleep(2);

try {
    assertParamsExists(["email", "code"], $_POST);
} catch (Exception $e) {
    respondWithErrorJSON($e->getMessage());
}

$email = $_POST['email'];
$code = $_POST['code'];

if ($_SESSION['player_onetime_code_email'] != $email) {
    respondWithErrorJSON("L'adresse email ne correspond pas au code");
}

if ($_SESSION['player_onetime_code'] != $code) {
    respondWithErrorJSON("Le code est incorrect");
}

if ($_SESSION['player_onetime_code_expires'] < time()) {
    respondWithErrorJSON("Le code a expiré");
}

$_SESSION['player_email'] = $email;

// Fill in the passkey field with a fake key to prevent one from being registered 
$get = $pdo->prepare("SELECT * FROM players WHERE email = :email");

$get->execute([
    "email" => $email
]);

$player = $get->fetch();

$passkey = json_decode($player->passkey);

if ($passkey->webauthnkeys === null) {
    $passkey->webauthnkeys = true;

    $up = $pdo->prepare("UPDATE players SET passkey = :passkey WHERE idPlayer = :id");

    $up->execute([
        "passkey" => json_encode($passkey),
        "id" => $player->idPlayer
    ]);
}


respondWithSuccessJSON([
    "email" => $email
]);
