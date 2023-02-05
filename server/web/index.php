<?php

session_start();

require "app/AntiCheat.php";
require "functions/response.php";

const GRID_SIZE = 4;

$action = $_GET['action'] ?? "home";

switch ($action) {
    case 'home':

        exec("cd ..\\engine && grid_build frequence.txt 4 4", $gridString, $ret);
        $_SESSION['grid'] = $gridString[0];
        $grid = explode(" ", $gridString[0]);

        $antiCheat = new AntiCheat();

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
        break;

    default:
        $actionPath = "actions/$action.php";
        if (file_exists($actionPath)) {
            require $actionPath;
        } else {
            http_response_code(404);
            require "views/404.php";
        }
}
