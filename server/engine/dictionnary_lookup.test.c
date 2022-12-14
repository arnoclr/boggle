#include <stdio.h>
#include "dictionnary_lookup.h"

char *filename = "fr32.lex";

int shouldReturn(char *word, int expected)
{
    return lookup(filename, word) == expected;
}

void test(char *word, int expected)
{
    if (shouldReturn(word, expected))
    {
        printf("Test passed\n");
    }
    else
    {
        printf("Test failed\n");
    }
}

void main()
{
    test("BONJOUR", 0);
    test("BONJOU", 1);
    test("BONJOUZ", 2);
    test("AALENIEN", 0);
    test("AALENIENNE", 0);
    test("AALENIENNES", 0);
    test("AALENIENS", 0);
    test("AAS", 0);
    test("ABACOST", 0);
}