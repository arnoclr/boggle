<?php

class AntiCheat
{
    public function generateImageFor(String $letter, int $size = 32): string
    {
        $image = imagecreatetruecolor($size, $size);
        $backgroundColor = imagecolorallocate($image, 255, 255, 255);
        $textColor = imagecolorallocate($image, 0, 0, 0);
        $availableFontVariants = ["Xed", "Noise", "False"];
        $fontVariant = $availableFontVariants[array_rand($availableFontVariants)];
        $font = realpath("./assets/fonts/anticheat/ZXX $fontVariant.otf");
        $fontSize = $size;
        imagefill($image, 0, 0, $backgroundColor);
        imagefttext($image, $fontSize, 0, 0, $fontSize, $textColor, $font, $letter);
        ob_start();
        imagepng($image);
        $imageData = ob_get_contents();
        ob_end_clean();
        imagedestroy($image);
        return "data:image/png;base64," . base64_encode($imageData);
    }
}
