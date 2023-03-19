<?php

respondWithJSON([
    "connected" => isset($_SESSION['player_email'])
]);
