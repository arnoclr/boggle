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

$req = $pdo->prepare("SELECT * FROM players WHERE email = :email");
$req->execute([
    "email" => $email
]);

$player = $req->fetch();
$_SESSION['player_onetime_code'] = randomNumbers(7);
$_SESSION['player_onetime_code_email'] = $email;
$_SESSION['player_onetime_code_expires'] = time() + 60 * 5;

if ($player == false) {
    respondWithErrorJSONAndStatus("Aucun utilisateur avec cette adresse email n'existe", "email_not_found");
}

respondWithSuccessJSON(sendEmail(
    $email,
    "Connexion à Boggle",
    <<<HTML
    <h1>Code de connexion</h1>
    <p>Utilisez le code ci-dessous pour vous connecter au jeu Boggle.</p>
    <p style="font-size: 22px;">{$_SESSION['player_onetime_code']}</p>
    HTML
));
