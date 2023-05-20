<?php

class AntiCheat
{
    public function generateImageFor(String $letter, int $size = 32, int $seed = 0): string
    {
        $image = imagecreatetruecolor($size, $size);
        $backgroundColor = imagecolorallocate($image, 255, 255, 255);
        $textColor = imagecolorallocate($image, 0, 0, 0);
        $availableFontVariants = ["Xed", "Noise"];
        $seed += ord($letter);
        $fontVariant = $availableFontVariants[$seed % count($availableFontVariants)];
        $font = realpath("./assets/fonts/anticheat/ZXX $fontVariant.otf");
        $fontSize = $size;
        imagefill($image, 0, 0, $backgroundColor);
        imagefttext($image, $fontSize, 0, 0, $fontSize, $textColor, $font, $letter);
        ob_start();
        imagejpeg($image, null, 50);
        $imageData = ob_get_contents();
        ob_end_clean();
        imagedestroy($image);
        return $imageData;
    }

    public function returnImageFor(String $letter, int $size = 32, int $seed = 0): void
    {
        header("Content-type: image/jpeg");
        echo $this->generateImageFor($letter, $size);
    }
}
