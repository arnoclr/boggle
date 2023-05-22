<?php

$webauthn = new \Davidearl\WebAuthn\WebAuthn($allowOriginHostname);

try {
    assertParamsExists(["response"], $_POST);
} catch (Exception $e) {
    respondWithErrorJSON($e->getMessage());
}

/* complete the registration */
if (empty($_SESSION['registration_email'])) {
    respondWithErrorJSON("Aucune session de création d'utilisateur n'est en cours");
}

$email = $_SESSION['registration_email'];

$get = $pdo->prepare("SELECT * FROM players WHERE email = :email");

$get->execute([
    "email" => $email
]);

$user = $get->fetch();

$passkey = json_decode($user->passkey);

if ($passkey->webauthnkeys) {
    $validKey = $webauthn->authenticate($_POST['response'], $passkey->webauthnkeys);

    if (!$validKey) {
        respondWithErrorJSON("La clé n'est pas valide");
    }
} else {
    $passkey->webauthnkeys = $webauthn->register($_POST['response'], $passkey->webauthnkeys);

    $up = $pdo->prepare("UPDATE players SET passkey = :passkey WHERE idPlayer = :id");

    $up->execute([
        "passkey" => json_encode($passkey),
        "id" => $user->idPlayer
    ]);
}

unset($_SESSION['registration_email']);

$_SESSION['player_email'] = $email;

respondWithSuccessJSON([
    "email" => $email
]);
