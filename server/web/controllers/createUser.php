<?php

try {
    assertParamsExists(["email"], $_POST);
} catch (Exception $e) {
    echo $e->getMessage();
}
