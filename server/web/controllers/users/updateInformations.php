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

function toBoolean($value)
{
    if (is_bool($value)) {
        return $value;
    }

    if ($value === "true") {
        return true;
    }

    if ($value === "false") {
        return false;
    }

    throw new Exception("Invalid boolean value");
}

$availableParams = ["name", "profilPicUrl", "isPrivateAccount", "passkey"];

foreach ($availableParams as $param) {
    if (isset($_POST[$param])) {
        $query = $pdo->prepare("UPDATE players SET $param = :$param WHERE email = :email");
        $query->execute([
            $param => isBoolean($_POST[$param]) ? toBoolean($_POST[$param]) : $_POST[$param],
            "email" => $_SESSION['player_email']
        ]);
    }
}

respondWithSuccessJSON(null);
