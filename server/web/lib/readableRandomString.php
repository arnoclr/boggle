<?php
class RandomReadableString
{
    private $_VOWELS = [
        'a', 'an', 'ai', 'au',
        'e', 'ei', 'eu', 'en',
        'i', 'in', 'io',
        'o', 'oi', 'ou', 'on',
        'u', 'un', 'ui',
        'y'
    ];

    private $_CONSONANTS = [
        'b', 'br', 'bl',
        'c', 'cr', 'ch',
        'd', 'dr',
        'f', 'ff', 'fr', 'fl',
        'g', 'gu', 'gr', 'gl', 'gn',
        'j',
        'k', 'kr',
        'l', 'll', 'lt', 'lg', 'lj', 'lk', 'lm', 'lv', 'lgu', 'lgr',
        'm', 'mm',
        'n', 'nn',
        'p', 'pr', 'ps', 'pl', 'pn', 'pp',
        'q', 'qu',
        'r', 'rt', 'rp', 'rg', 'rd', 'rq', 'rj', 'rgu', 'rgr', 'rgl', 'rgn',
        's', 'ss', 'sl',
        't', 'tr', 'tl', 'th', 'tt',
        'v', 'vr',
        'w',
        'x',
        'y',
        'z', 'zt', 'zj', 'zv'
    ];

    private $_BLACKLIST = [
        'aiw',
        'eiw',
        'gni', 'guo', 'gua',
        'iow',
        'mz', 'mr', 'mt', 'mq', 'ms', 'md', 'mf', 'mg', 'mh', 'mj', 'mk', 'ml', 'mw', 'mx', 'mc', 'mv', 'mn',
        'nm', 'nw',
        'nb', 'np',
        'oiw', 'ouw', 'onw',
        'uu', 'uw', 'uiw',
        'yy'
    ];

    // TODO: not start with same 2 consonants

    private function randomBetweenZeroAnd($max)
    {
        return rand(0, $max);
    }

    // src: https://stackoverflow.com/a/2124557/6683922
    private function contains($str, array $arr)
    {
        foreach ($arr as $a) {
            if (stripos($str, $a) !== false) return true;
        }
        return false;
    }

    private function uuid($length = 4)
    {
        $_SYLLABES = [$this->_VOWELS, $this->_CONSONANTS];
        $str = '';
        $startWith = $this->randomBetweenZeroAnd(1);

        while (strlen($str) < $length) {
            $remainingLength = $length - strlen($str);

            $pos = $this->randomBetweenZeroAnd(count($_SYLLABES[$startWith]) - 1);
            $syllabe = $_SYLLABES[$startWith][$pos];

            while (strlen($syllabe) > $remainingLength) {
                $pos = $this->randomBetweenZeroAnd(count($_SYLLABES[$startWith]) - 1);
                $syllabe = $_SYLLABES[$startWith][$pos];
            }

            $str .= $syllabe;

            $startWith = ($startWith + 1) % 2;
        }

        if ($this->contains($str, $this->_BLACKLIST)) {
            return $this->uuid($length);
        }

        return $str;
    }

    public function rrs(int $length, ?int $separatorGap = 0)
    {
        if (!isset($separatorGap)) {
            return $this->uuid($length);
        }

        $str = "";

        while (strlen($str) < $length) {
            $str .= $this->uuid($separatorGap) . '-';
        }

        return substr($str, 0, $length);
    }
}
