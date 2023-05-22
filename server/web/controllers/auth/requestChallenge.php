<?php

$webauthn = new \Davidearl\WebAuthn\WebAuthn($allowOriginHostname);

try {
    assertParamsExists(["email"], $_POST);
} catch (Exception $e) {
    respondWithErrorJSON($e->getMessage());
}

$email = $_POST['email'];

$get = $pdo->prepare("SELECT * FROM players WHERE email = :email");

$get->execute([
    "email" => $email
]);

$player = $get->fetch();

if (!$player) {
    respondWithErrorJSONAndStatus("Aucun utilisateur avec cette adresse email n'existe", "email_not_found");
}

$passkeyRecord = json_decode($player->passkey);

if ($passkeyRecord->webauthnkeys) {
    $type = "login";
    $challenge = $webauthn->prepareForLogin($passkeyRecord->webauthnkeys);
} else {
    $type = "register";
    $challenge = $webauthn->prepareChallengeForRegistration($email, $passkeyRecord->id, false);
}

$_SESSION['registration_email'] = $email;

respondWithSuccessJSON(['challenge' => $challenge, 'type' => $type]);
