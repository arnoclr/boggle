#include <stdio.h>
#include <stdlib.h>
#include "score.h"

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        printf("Usage: %s WORD ANOTHERWORD ...", argv[0]);
        exit(1);
    }

    int score = 0;
    for (int i = 1; i < argc; i++)
    {
        score += scoreOfWord(argv[i]);
    }

    printf("%d", score);

    return 0;
}