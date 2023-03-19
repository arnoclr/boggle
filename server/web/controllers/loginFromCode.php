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

respondWithSuccessJSON([
    "email" => $email
]);
