#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

typedef struct node
{
    char letter;
    struct node *firstChild;
    struct node *nextSibling;
} Node;

typedef Node *CSTree;

CSTree newCSTree(char letter, CSTree firstChild, CSTree nextSibling)
{
    CSTree t = malloc(sizeof(Node));
    if (t == NULL)
        return NULL;
    t->letter = letter;
    t->firstChild = firstChild;
    t->nextSibling = nextSibling;
    return t;
}

int nSibling(CSTree t)
{
    if (t == NULL || t->nextSibling == NULL)
    {
        return 0;
    }
    return 1 + nSibling(t->nextSibling);
}

int nChildren(CSTree t)
{
    if (t == NULL)
    {
        return 0;
    }

    return 1 + nSibling(t->firstChild);
}

void printPrefix(CSTree t)
{
    if (t != NULL)
    {
        printf("%c", t->letter);
        printPrefix(t->firstChild);
        printPrefix(t->nextSibling);
    }
}

void printDetails(CSTree t)
{
    if (t != NULL)
    {
        printf("%c, siblings: %d, children: %d\n", t->letter, nSibling(t), nChildren(t));
        printDetails(t->firstChild);
        printDetails(t->nextSibling);
    }
}

void _printLexHumanLanguage(CSTree t, int childAt)
{
    if (t != NULL)
    {
        childAt += nChildren(t);
        printf("%c, siblings: %d, childAt: %d\n", t->letter, nSibling(t), childAt);
        _printLexHumanLanguage(t->nextSibling, childAt);
        _printLexHumanLanguage(t->firstChild, nChildren(t));
    }
}

void printLexHumanLanguage(CSTree t)
{
    _printLexHumanLanguage(t, nSibling(t));
}

void insertLetterAt(CSTree *t, char *word, int pos)
{
    // parcourir les voisins tant qu'on a pas trouvé la lettre, si on ne la trouve pas arrivé au bout, on créé un nouveau voisin

    if (pos >= strlen(word))
        return;

    char letter = word[pos];

    // printf("\nLettre a inserer: %c", letter);

    if (*t == NULL)
    {
        // printf("\nCreation d'un noeud car il n'existe pas");
        *t = newCSTree(letter, NULL, NULL);
    }

    if ((*t)->letter == letter)
    {
        // printf("\nNoeud trouve, on passe au fils");
        return insertLetterAt(&(*t)->firstChild, word, pos + 1);
    }

    // printf("\nNoeud non trouve, on passe au voisin");
    return insertLetterAt(&(*t)->nextSibling, word, pos);
}

int main(int argc, char *argv[])
{
    if (argc != 3)
    {
        printf("Usage: %s <inputFile> <outputFile>", argv[0]);
        exit(1);
    }

    char *inputFilename = argv[1];
    char *outputFilename = argv[2];

    // we assume that the inputFile is a list of word written in CAPITAL letters and ordered alphabetically

    FILE *inputFile = fopen(inputFilename, "r");
    FILE *outputFile = fopen(outputFilename, "wb");

    CSTree t = NULL;

    while (!feof(inputFile))
    {
        char word[255];
        fscanf(inputFile, "%s", word);

        int wordLen = strlen(word);

        // printf("\n---\nword: %s len: %d", word, wordLen);

        insertLetterAt(&t, word, 0);
    }

    printLexHumanLanguage(t);
    // printDetails(t);

    // printf("\nNombre de fils: %d, Nombre de voisins: %d", nChildren(t), nSibling(t));
}