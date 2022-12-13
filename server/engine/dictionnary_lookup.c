// $ dictionnary_lookup dico.lex BONJOUR
// 0 -> le mot est présent
// 1 -> c'est un préfixe
// 2 -> le mot n'est pas présent

#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <string.h>

const char *filename = "fr32.lex";

struct Cell
{
    int letter;
    int firstChild;
    int nSibling;
};

int readCellAt(FILE *lexFile, struct Cell *cell, int pos)
{
    fseek(lexFile, pos, SEEK_SET);
    fread(&cell->letter, sizeof(int), 1, lexFile);
    fread(&cell->firstChild, sizeof(int), 1, lexFile);
    fread(&cell->nSibling, sizeof(int), 1, lexFile);
    return 0;
}

void _printCell(struct Cell *cell)
{
    printf("letter: %c firstChild: %d nextSibling: %d", cell->letter, cell->firstChild, cell->nSibling);
}

int main(int argc, char *argv[])
{
    // read fr.lex file
    // get user word
    printf("The argument supplied is %s\n", argv[1]);

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

    printf("headerSize: %d wordsCount: %d cellsCount: %d cellSize: %d", headerSize, wordsCount, cellsCount, cellSize);

    // read header
    // fread(file_contents, 1, headerSize, lexFile);
    int pos = 0;
    char *wordToVerify = argv[1];
    struct Cell *currentCell = malloc(sizeof(struct Cell));

    for (int i = 0; i < strlen(wordToVerify); i++)
    {
        char letter = wordToVerify[i];
        printf("\n%c : ", letter);

        readCellAt(lexFile, currentCell, (headerSize + pos) * cellSize);
        int nSibling = currentCell->nSibling;
        printf("\nread cell at %d, with %d siblings", (headerSize + pos) * cellSize, nSibling);
        for (int j = 0; j < nSibling; j++)
        {
            readCellAt(lexFile, currentCell, headerSize + pos + (j * cellSize));
            printf("\n");
            _printCell(currentCell);
            if (wordToVerify[i] == currentCell->letter)
            {
                pos = currentCell->firstChild;
                break;
            }
        }
    }

    // lire la case qui correspond à la premiere lettre, lire le nSibling pour avoir la case de meme niveau suivante
    // Quand on est sur la bonne case, lire le first child
    // lire le nsibling a chaque fois afin de tomber sur la deuxieme lettre
    // ...

    // se placer sur la premiere lettre
    // lire le first child

    // si quand on parcourt le nsibling on trouve pas la lettre demandée, alors le mot n'est pas présent
    // si on trouve toutes les cases et que la case contient un first child alors c'est un préfixe
    // si on trouve toutes les cases et que la case ne contient aucun first child alors c'est le mot

    fclose(lexFile);

    free(file_contents);

    return 0;
}