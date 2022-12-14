// $ dictionnary_lookup dico.lex BONJOUR
// 0 -> le mot est présent
// 1 -> c'est un préfixe
// 2 -> le mot n'est pas présent

#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <string.h>

struct Cell
{
    int letter;
    int firstChild;
    int nSibling;
};

void _printCell(struct Cell *cell)
{
    printf("letter: %c firstChild: %d nextSibling: %d", cell->letter, cell->firstChild, cell->nSibling);
}

void readCellAt(FILE *lexFile, struct Cell *cell, int pos)
{
    fseek(lexFile, pos, SEEK_SET);
    fread(&cell->letter, sizeof(int), 1, lexFile);
    fread(&cell->firstChild, sizeof(int), 1, lexFile);
    fread(&cell->nSibling, sizeof(int), 1, lexFile);
}

int checkIfSiblingRowContainLetter(char letter, FILE *lexFile, struct Cell *currentCell, int pos, int cellSize)
{
    readCellAt(lexFile, currentCell, pos);

    if (currentCell->letter == letter)
    {
        return 1;
    }

    if (currentCell->nSibling <= 0)
    {
        return 0;
    }

    return checkIfSiblingRowContainLetter(letter, lexFile, currentCell, pos + cellSize, cellSize);
}

int exitWithCode(int code, FILE *lexFile, char *file_contents)
{
    fclose(lexFile);
    free(file_contents);
    return code;
}

extern int lookup(char *filename, char *wordToVerify)
{
    FILE *lexFile = fopen(filename, "rb");
    if (lexFile == NULL)
    {
        exit(1);
    }

    struct stat sb;
    if (stat(filename, &sb) == -1)
    {
        perror("stat");
        exit(1);
    }

    char *file_contents = malloc(sb.st_size);

    // determiner la taille de l'entete
    // initialiser les tailles en fonction de l'entete

    // read first 4 bytes
    int headerSize;
    fread(&headerSize, sizeof(int), 1, lexFile);

    int wordsCount;
    int cellsCount;
    int cellSize;

    fread(&wordsCount, sizeof(int), 1, lexFile);
    fread(&cellsCount, sizeof(int), 1, lexFile);
    fread(&cellSize, sizeof(int), 1, lexFile);

    int pos = 0;
    struct Cell *currentCell = malloc(sizeof(struct Cell));

    int parentPos = 0;

    for (int i = 0; i < strlen(wordToVerify); i++)
    {
        char letter = wordToVerify[i];
        int found = checkIfSiblingRowContainLetter(letter, lexFile, currentCell, headerSize + parentPos, cellSize);

        if (found == 0)
        {
            return exitWithCode(2, lexFile, file_contents);
        }

        parentPos = currentCell->firstChild * cellSize;
    }

    // si on trouve toutes les cases et que la case contient un first child alors c'est un préfixe
    // si on trouve toutes les cases et que la case ne contient aucun first child alors c'est le mot

    readCellAt(lexFile, currentCell, headerSize + currentCell->firstChild * cellSize);

    if (currentCell->firstChild > 0)
    {
        return exitWithCode(1, lexFile, file_contents);
    }

    return exitWithCode(0, lexFile, file_contents);
}