// score basé sur les règles suivantes : https://boggle.fr/regles.php

#include <string.h>

extern int scoreOfWord(char *word)
{
    int len = strlen(word);
    if (len == 3 || len == 4)
        return 1;
    if (len == 5)
        return 2;
    if (len == 6)
        return 3;
    if (len == 7)
        return 5;
    if (len >= 8)
        return 11;
    return 0;
}