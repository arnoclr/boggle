#include <math.h>
#include <string.h>

extern void getSiblingsList(int casePos, char grid[], int (*siblings)[8])
{
    // retrieve at max 8 cases around the case for a grid of 9, 16 ..
    int gridWidth = sqrt(strlen(grid));

    // clear list
    for (int i = 0; i < 8; i++)
    {
        (*siblings)[i] = -1;
    }

    // case coordinates
    int x = casePos % gridWidth;
    int y = casePos / gridWidth;

    printf("casePos: %d, x: %d, y: %d", casePos, x, y);

    int i = 0;

    if (y > 0) // top
    {
        if (x > 0)
        {
            (*siblings)[i] = casePos - gridWidth - 1;
            i++;
        }
        (*siblings)[i] = casePos - gridWidth;
        i++;
        if (x < gridWidth - 1)
        {
            (*siblings)[i] = casePos - gridWidth + 1;
            i++;
        }
    }

    if (x > 0) // left
    {
        (*siblings)[i] = casePos - 1;
        i++;
    }

    if (x < gridWidth - 1) // right
    {
        (*siblings)[i] = casePos + 1;
        i++;
    }

    if (y < gridWidth - 1) // bottom
    {
        if (x > 0)
        {
            (*siblings)[i] = casePos + gridWidth - 1;
            i++;
        }
        (*siblings)[i] = casePos + gridWidth;
        i++;
        if (x < gridWidth - 1)
        {
            (*siblings)[i] = casePos + gridWidth + 1;
            i++;
        }
    }
}

// recursive function to find a path in a grid
int hasNextSibling(int letterPos, char *word, char grid[], int casesToVerify[])
{
    if (letterPos == strlen(word))
    {
        return 1;
    }

    return 0;
}

int wordIsInGrid(char *word, char grid[])
{

    // trouver toutes les lettres de la grille qui correspondent à la première lettre du mot

    // pour chaque lettre, on cherche dans les 8 voisins toutes les lettres qui correspondent à la deuxième lettre du mot

    // si on trouve une lettre qui correspond à la deuxième lettre du mot, on cherche dans les 8 voisins de cette lettre toutes les lettres qui correspondent à la troisième lettre du mot
}