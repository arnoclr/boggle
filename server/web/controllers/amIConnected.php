<?php

respondWithSuccessJSON([
    "connected" => isset($_SESSION['player_email'])
]);
