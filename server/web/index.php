<?php

const GRID_SIZE = 4;
const GRID_STRING = "G A I R R U V E QU E O T A S M J";

// TODO: Use C program to get grid
$grid = explode(" ", GRID_STRING);

$submittedWord = strtoupper($_GET['word'] ?? "bonjour");

// TODO: Accept only words
exec("cd ..\\engine && dictionnary_lookup fr32.lex $submittedWord", $out, $ret);

$displayResult = "";
switch ($out[0]) {
    case "found":
        $displayResult = "Le mot $submittedWord est valide";
        break;
    case "prefix":
        $displayResult = "Le mot $submittedWord est un préfixe valide";
        break;
    default:
        $displayResult = "Le mot $submittedWord n'est pas valide";
        break;
}


require "views/home.php";
