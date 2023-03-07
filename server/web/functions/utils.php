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
