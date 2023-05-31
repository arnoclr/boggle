<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitccdc7adeac70eb57413fb1343a6695f5
{
    public static $files = array (
        'decc78cc4436b1292c6c0d151b19445c' => __DIR__ . '/..' . '/phpseclib/phpseclib/phpseclib/bootstrap.php',
    );

    public static $prefixLengthsPsr4 = array (
        'p' => 
        array (
            'phpseclib3\\' => 11,
        ),
        'P' => 
        array (
            'ParagonIE\\ConstantTime\\' => 23,
        ),
        'D' => 
        array (
            'Davidearl\\WebAuthn\\' => 19,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'phpseclib3\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpseclib/phpseclib/phpseclib',
        ),
        'ParagonIE\\ConstantTime\\' => 
        array (
            0 => __DIR__ . '/..' . '/paragonie/constant_time_encoding/src',
        ),
        'Davidearl\\WebAuthn\\' => 
        array (
            0 => __DIR__ . '/..' . '/davidearl/webauthn/WebAuthn',
        ),
    );

    public static $prefixesPsr0 = array (
        'C' => 
        array (
            'CBOR' => 
            array (
                0 => __DIR__ . '/..' . '/2tvenom/cborencode/src',
            ),
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitccdc7adeac70eb57413fb1343a6695f5::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitccdc7adeac70eb57413fb1343a6695f5::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInitccdc7adeac70eb57413fb1343a6695f5::$prefixesPsr0;
            $loader->classMap = ComposerStaticInitccdc7adeac70eb57413fb1343a6695f5::$classMap;

        }, null, ClassLoader::class);
    }
}
