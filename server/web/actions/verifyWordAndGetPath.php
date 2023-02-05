<?php

if (!isset($_SESSION['grid']) || !isset($_GET['word'])) {
    respondWithJson([
        "success" => false,
        "error" => "Paramètres manquants"
    ]);
}

$wordToVerify = $_GET['word'];
$grid = $_SESSION['grid'];

if (!preg_match("/^[a-z]+$/i", $wordToVerify)) {
    respondWithJson([
        "success" => false,
        "error" => "Paramètres manquants"
    ]);
}

// TODO: check with dictionnary_lookup

$wordToVerify = strtoupper($wordToVerify);

exec("cd ..\\engine && grid_path $wordToVerify 4 4 $grid", $out, $ret);

respondWithJson([
    "success" => true,
    "isWordFound" => sizeof($out) > 0,
    "path" => $out[0] ?? null,
]);
