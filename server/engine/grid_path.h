#include <math.h>
#include <string.h>

#define gridLength 9

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
    // retrieve at max 8 cases around the case for a grid of 9, 16 ..
    int gridWidth = sqrt(gridLength);

    // clear lists
    for (int i = 0; i < 8; i++)
    {
        (*siblings)[i] = -1;
    }

    // for (int i = 0; i < gridLength; i++)
    // {
    //     (*path)[i] = -1;
    // }

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
    // renvoie les numéros de cases des voisins pour une grille commencant à 0
    getSiblingsList((*path)[letterPos], grid, siblings, path);

    // printf("Grid: %c, %c, %c, %c, %c, %c, %c, %c, %c\n", grid[0], grid[1], grid[2], grid[3], grid[4], grid[5], grid[6], grid[7], grid[8]);

    printf("-------------------\n");
    printf("voisins: %d, %d, %d, %d, %d, %d, %d, %d\n", (*siblings)[0], (*siblings)[1], (*siblings)[2], (*siblings)[3], (*siblings)[4], (*siblings)[5], (*siblings)[6], (*siblings)[7]);

    // printf("%c: ", word[letterPos]);
    printf("Path (%d): %d, %d, %d, %d, %d, %d, %d, %d\n", pathLength, (*path)[0], (*path)[1], (*path)[2], (*path)[3], (*path)[4], (*path)[5], (*path)[6], (*path)[7]);
    // printf("Lettre de la grille: %c\n", grid[(*path)[letterPos - 1]]);

    // si le chemin est plus long que la position de la lettre, c'est qu'on vient d'un mauvais chemin
    // tester le prochain voisin
    // letter pos start at 0, path length start at 1
    if (letterPos + 1 < pathLength)
    {
        int lastVisitedSibling = (*path)[letterPos + 1];
        int nextSibling = -1;
        for (int i = 0; i < 8; i++)
        {
            if ((*siblings)[i] > lastVisitedSibling)
            {
                nextSibling = (*siblings)[i];
                break;
            }
        }

        printf("lastVisitedSibling: %d, nextSibling: %d\n", lastVisitedSibling, nextSibling);

        if (nextSibling != -1)
        {
            (*path)[letterPos + 1] = nextSibling;
            printf("On vient d'un mauvais chemin et on va tester le voisin suivant\n");
            return goToNextSibling(letterPos + 1, word, grid, siblings, path, pathLength);
        }

        // si on a pas trouvé de voisin, on essaye de revenir en arrière si possible
        if (letterPos > 0)
        {
            printf("On vient d'un mauvais chemin mais il n'y a plus de voisins, on retourne un cran en arrière\n");
            return goToNextSibling(letterPos - 1, word, grid, siblings, path, pathLength - 1);
        }

        printf("à spécifier\n");
        return 0;
    }

    // regarder si la lettre actuelle est bonne
    // si non, on réappelle la fonction en reculant la position de la lettre en gardant le chemin intact pour ne pas revenir dessus
    int gridCase = (*path)[letterPos];
    printf("gridCase: %d\n", gridCase);
    if (word[letterPos] != grid[gridCase])
    {
        printf("Lettre trouvée dans la grille: %c\n", grid[gridCase]);
        printf("La lettre n'est pas bonne, on retourne un cran en arrière\n");
        return goToNextSibling(letterPos - 1, word, grid, siblings, path, pathLength);
    }

    // si la lettre est bonne et que c'est la dernière lettre, on a trouvé le mot
    if (letterPos == strlen(word) - 1)
    {
        printf("La lettre est bonne et c'est la dernière lettre, on a trouvé le mot\n");
        return 1;
    }

    // on avance dans le chemin
    printf("La lettre est bonne, on avance dans le chemin\n");
    return goToNextSibling(letterPos + 1, word, grid, siblings, path, pathLength + 1);
}

extern int isWordInGrid(char *word, char grid[])
{
    int path[16] = {0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1};
    int siblings[8];

    for (int i = 0; i < gridLength; i++)
    {
        path[0] = i;
        if (grid[i] == word[0] && goToNextSibling(0, word, grid, &siblings, &path, 1))
        {
            return 1;
        }
    }

    return 0;
}