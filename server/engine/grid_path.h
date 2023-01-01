#include <math.h>
#include <string.h>

void appendToSiblingsIfNotInPath(int (*siblings)[8], int (*path)[], int insert, int *at)
{
    int found = 0;
    for (int i = 0; i < 8; i++)
    {
        if ((*path)[i] == insert)
        {
            found = 1;
            break;
        }
    }

    if (!found)
    {
        (*siblings)[*at] = insert;
        (*at)++;
    }
}

void getSiblingsList(int casePos, char grid[], int (*siblings)[8], int (*path)[])
{
    int gridLength = strlen(grid);

    // retrieve at max 8 cases around the case for a grid of 9, 16 ..
    int gridWidth = sqrt(gridLength);

    // clear lists
    for (int i = 0; i < 8; i++)
    {
        (*siblings)[i] = -1;
    }

    for (int i = 0; i < gridLength; i++)
    {
        (*path)[i] = -1;
    }

    // case coordinates
    int x = casePos % gridWidth;
    int y = casePos / gridWidth;

    int at = 0;

    if (y > 0) // top
    {
        if (x > 0)
        {
            appendToSiblingsIfNotInPath(siblings, path, casePos - gridWidth - 1, &at);
        }
        appendToSiblingsIfNotInPath(siblings, path, casePos - gridWidth, &at);
        if (x < gridWidth - 1)
        {
            appendToSiblingsIfNotInPath(siblings, path, casePos - gridWidth + 1, &at);
        }
    }

    if (x > 0) // left
    {
        appendToSiblingsIfNotInPath(siblings, path, casePos - 1, &at);
    }

    if (x < gridWidth - 1) // right
    {
        appendToSiblingsIfNotInPath(siblings, path, casePos + 1, &at);
    }

    if (y < gridWidth - 1) // bottom
    {
        if (x > 0)
        {
            appendToSiblingsIfNotInPath(siblings, path, casePos + gridWidth - 1, &at);
        }
        appendToSiblingsIfNotInPath(siblings, path, casePos + gridWidth, &at);
        if (x < gridWidth - 1)
        {
            appendToSiblingsIfNotInPath(siblings, path, casePos + gridWidth + 1, &at);
        }
    }
}

int goToNextSibling(int letterPos, char *word, char grid[], int (*siblings)[8], int (*path)[], int pathLength)
{
    getSiblingsList((*path)[letterPos], grid, siblings, path);

    // si le chemin est plus long que la position de la lettre, c'est qu'on vient d'un mauvais chemin
    // tester le prochain voisin
    if (letterPos < pathLength)
    {
        int lastVisitedSibling = (*path)[letterPos];
        int nextSibling = -1;
        for (int i = 0; i < 8; i++)
        {
            if ((*siblings)[i] < lastVisitedSibling)
            {
                nextSibling = (*siblings)[i];
                break;
            }
        }

        if (nextSibling != -1)
        {
            (*path)[letterPos + 1] = nextSibling;
            return goToNextSibling(letterPos + 1, word, grid, siblings, path, pathLength);
        }

        // si on a pas trouvé de voisin, on essaye de revenir en arrière si possible
        if (letterPos > 0)
        {
            return goToNextSibling(letterPos - 1, word, grid, siblings, path, pathLength - 1);
        }

        return 0;
    }

    // regarder si la lettre actuelle est bonne
    // si non, on réappelle la fonction en reculant la position de la lettre en gardant le chemin intact pour ne pas revenir dessus
    if (word[letterPos] != (*path)[letterPos])
    {
        return goToNextSibling(letterPos - 1, word, grid, siblings, path, pathLength);
    }

    // si la lettre est bonne et que c'est la dernière lettre, on a trouvé le mot
    if (letterPos == strlen(word) - 1)
    {
        return 1;
    }

    // on avance dans le chemin
    return goToNextSibling(letterPos + 1, word, grid, siblings, path, pathLength + 1);
}

extern int isWordInGrid(char *word, char grid[])
{
    int path[16] = {7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1};
    int siblings[8];
    return goToNextSibling(0, word, grid, &siblings, &path, 1);
}