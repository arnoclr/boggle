#include <stdio.h>
#include "dictionnary_lookup.h"

int main(int argc, char *argv[])
{
    if (argc < 3)
    {
        printf("Usage: %s filename word", argv[0]);
        exit(1);
    }

    char *filename = argv[1];
    char *word = argv[2];

    int result = lookup(filename, word);

    switch (result)
    {
    case 0:
        printf("found");
        break;
    case 1:
        printf("prefix");
        break;
    case 2:
        printf("not found");
        break;
    }

    return 0;
}