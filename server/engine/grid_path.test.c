#include <stdio.h>
#include "grid_path.h"

void main()
{
    int siblings[8];

    // int siblingOf = 8;

    // char grid2[16] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
    // int path2[16];

    // getSiblingsList(siblingOf, grid2, &siblings, &path2);

    // printf("Siblings of %d: %d, %d, %d, %d, %d, %d, %d, %d", siblingOf, siblings[0], siblings[1], siblings[2], siblings[3], siblings[4], siblings[5], siblings[6], siblings[7]);

    char grid[9] = {'C', 'X', 'X', 'A', 'X', 'X', 'B', 'A', 'C'};
    char *word = "BAC";

    printf("Word %s is in grid: %d", word, isWordInGrid(word, grid));
}