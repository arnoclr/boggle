<?php

function respondWithJson($data)
{
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
