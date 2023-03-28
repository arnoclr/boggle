<?php

use Firehed\WebAuthn\ExpiringChallenge;

// Generate challenge
$challenge = ExpiringChallenge::withLifetime(120);

// Store server-side; adjust to your app's needs
session_start();
$_SESSION['webauthn_challenge'] = $challenge;

// Send to user
header('Content-type: application/json');
echo json_encode($challenge->getBase64());
