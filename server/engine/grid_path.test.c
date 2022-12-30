#include <stdio.h>
#include "grid_path.h"

void main()
{
    char grid[9] = {'0', '1', '2', '3', '4', '5', '6', '7', '8'};

    int siblings[8];

    int siblingOf = 1;

    getSiblingsList(siblingOf, grid, &siblings);

    printf("Siblings of %d: %d, %d, %d, %d, %d, %d, %d, %d", siblingOf, siblings[0], siblings[1], siblings[2], siblings[3], siblings[4], siblings[5], siblings[6], siblings[7]);

    char grid2[16] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    getSiblingsList(siblingOf, grid2, &siblings);

    printf("Siblings of %d: %d, %d, %d, %d, %d, %d, %d, %d", siblingOf, siblings[0], siblings[1], siblings[2], siblings[3], siblings[4], siblings[5], siblings[6], siblings[7]);
}