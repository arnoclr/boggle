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

    // printf("Grid: %s", grid);

    return !isWordInGrid(word, grid);
}