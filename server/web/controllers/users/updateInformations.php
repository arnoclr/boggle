<?php

try {
    assertUserIsConnected();
} catch (Exception $e) {
    respondWithErrorJSON($e->getMessage());
}

function isBoolean($value)
{
    return is_bool($value) || $value === "true" || $value === "false";
}

function toInt($value)
{
    return $value === "true" ? 1 : 0;
}

$availableParams = ["name", "profilPicUrl", "isPrivateAccount", "passkey"];

foreach ($availableParams as $param) {
    if (isset($_POST[$param])) {
        $query = $pdo->prepare("UPDATE players SET $param = :$param WHERE email = :email");
        $query->execute([
            $param => isBoolean($_POST[$param]) ? toInt($_POST[$param]) : $_POST[$param],
            "email" => $_SESSION['player_email']
        ]);
    }
}

respondWithSuccessJSON(null);
