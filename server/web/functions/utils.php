<?php

function assertParamsExists(array $requiredParams, array $method): void
{
    foreach ($requiredParams as $param) {
        if (!isset($method[$param])) {
            throw new Exception("Paramètre manquant : $param");
        }
    }
}

function respondWithJSON($data): void
{
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function respondWithErrorJSON(string $message): void
{
    respondWithJSON([
        "success" => false,
        "error" => $message
    ]);
}

function respondWithSuccessJSON($data): void
{
    respondWithJSON([
        "success" => true,
        "data" => $data
    ]);
}

function respondWithErrorJSONAndStatus(string $message, string $status): void
{
    respondWithJSON([
        "success" => false,
        "error" => $message,
        "status" => $status
    ]);
}

function assertUserIsConnected(): void
{
    if (!isset($_SESSION['player_email'])) {
        throw new Exception("Vous devez être connecté pour effectuer cette action");
    }
}

function sendEmail($to, $subject, $HTML)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, EMAIL_API_URL);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "to" => $to,
        "subject" => $subject,
        "HTML" => $HTML,
        "name" => "Le support Boggle",
        "from" => "supportboggle",
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . EMAIL_BEARER,
    ]);
    // FIXME: Trouver un moyen de faire sans
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $content = curl_exec($ch);
    curl_close($ch);

    return json_decode($content, true);
}

function randomNumbers($length)
{
    $key = random_int(0, pow(10, $length) - 1);
    $key = str_pad($key, $length, 0, STR_PAD_LEFT);
    return $key;
}

function secureRandomToken(int $length): string
{
    $token = bin2hex(random_bytes($length));
    return $token;
}

function dd($var)
{
    echo "<pre>";
    var_dump($var);
    echo "</pre>";
    exit;
}
