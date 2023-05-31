<?php

session_destroy();

respondWithSuccessJSON([
    "message" => "Vous êtes déconnecté"
]);
