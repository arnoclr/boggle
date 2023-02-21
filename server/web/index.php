<?php

require "app/AntiCheat.php";

const GRID_SIZE = 4;

exec("cd ../engine && ./grid_build frequence.txt 4 4", $gridString, $ret);
$grid = explode(" ", $gridString[0]);

$antiCheat = new AntiCheat();

$submittedWord = strtoupper($_GET['word'] ?? "bonjour");

// TODO: Accept only words
exec("cd ../engine && ./dictionnary_lookup fr32.lex $submittedWord", $out, $ret);

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


// TODO: retirer le test et mettre la connexion à part
$pdo = new PDO("mysql:host=db;port=3306;dbname=boggle", "boggle", "password");

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$players = $pdo->query("SELECT * FROM players")->fetchAll();
