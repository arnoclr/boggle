<?php

class AntiCheat
{
    public function generateImageFor(String $letters, int $size = 32, int $seed = 0): string
    {
        $image = imagecreatetruecolor($size, $size);
        $backgroundColor = imagecolorallocate($image, 253, 244, 235);
        $textColor = imagecolorallocate($image, 56, 88, 111);
        $availableFontVariants = ["Xed", "Noise"];
        $availableOrientations = [-90, 0, 90];
        $seed += ord($letters);
        $fontVariant = $availableFontVariants[$seed % count($availableFontVariants)];
        $orientation = $availableOrientations[$seed % count($availableOrientations)];
        $font = realpath("./assets/fonts/anticheat/ZXX $fontVariant.otf");
        $fontSize = $size / sizeof(str_split($letters));
        $y = $size - ($size - $fontSize) / 2;
        imagefill($image, 0, 0, $backgroundColor);
        imagefttext($image, $fontSize, 0, 0, $y, $textColor, $font, $letters);
        // $image = imagerotate($image, $orientation, $backgroundColor);
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
