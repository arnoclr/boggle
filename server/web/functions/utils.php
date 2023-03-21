<?php

function assertParamsExists($requiredParams, $method)
{
    foreach ($requiredParams as $param) {
        if (!isset($method[$param])) {
            throw new Exception("Paramètre manquant : $param");
        }
    }
}

function respondWithJSON($data)
{
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function respondWithErrorJSON($message)
{
    respondWithJSON([
        "success" => false,
        "error" => $message
    ]);
}

function respondWithSuccessJSON($data)
{
    respondWithJSON([
        "success" => true,
        "data" => $data
    ]);
}

function respondWithErrorJSONAndStatus($message, $status)
{
    respondWithJSON([
        "success" => false,
        "error" => $message,
        "status" => $status
    ]);
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

function dd($var)
{
    echo "<pre>";
    var_dump($var);
    echo "</pre>";
    exit;
}
