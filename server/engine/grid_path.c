#include "grid_path.h"
#include <string.h>

// $ grid_path OUI 4 4 G A I R R U V E QU E O T A S M J
int main(int argc, char *argv[])
{
    char *word = argv[1];

    // only grids of 4x4 are supported for the moment

    char grid[16];
    for (int i = 0; i < 16; i++)
    {
        char *letters = argv[4 + i];
        // use 1 digit for QU letter combo
        char letter = strcmp(letters, "QU") == 0 ? '1' : letters[0];
        grid[i] = letter;
    }

    // replace QU in word by 1
    int len = strlen(word);
    for (int i = 0; i < len; i++)
    {
        if (word[i] == 'Q' && word[i + 1] == 'U')
        {
            // décaler tous les caractères suivants d'une position vers la gauche
            memmove(&word[i + 1], &word[i + 2], len - i - 2 + 1);
            len--;         // mettre à jour la longueur du word
            word[i] = '1'; // remplacer "qu" par "1"
        }
    }

    // printf("Word: %s", word);
    // printf("Grid: %s", grid);

    return !isWordInGrid(word, grid);
}