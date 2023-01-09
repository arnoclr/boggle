#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

int main(int argc, char *argv[])
{
    if (argc != 4)
    {
        printf("Usage: %s <filename> <width> <height>", argv[0]);
        return 1;
    }

    FILE *fp = fopen(argv[1], "r");

    if (fp == NULL)
    {
        printf("Error: Could not open file %s", argv[1]);
        return 1;
    }

    int width = atoi(argv[2]);

    if (width <= 0)
    {
        printf("Error: Invalid width %d", width);
        return 1;
    }

    int height = atoi(argv[3]);

    if (height <= 0)
    {
        printf("Error: Invalid height %d", height);
        return 1;
    }

    // TODO: allouer la mémoire dynamiquement
    char frequencies[16000];
    int at = 0;

    // read each line, and append char * numer of occurences in frequencies

    char *line = NULL;
    size_t len = 0;
    ssize_t read;
    while ((read = getline(&line, &len, fp)) != -1)
    {
        // split string and frequencies by space
        char *letters = strtok(line, " ");

        char *frequency = strtok(NULL, " ");

        // get only digits from frequency
        frequency = strtok(frequency, "\n");

        // get frequency int
        int freq = atoi(frequency);

        // if letter == "QU"
        char letter;
        if (strcmp(letters, "QU") == 0)
        {
            letter = '1';
        }
        else
        {
            letter = letters[0];
        }

        // add letter to frequencies
        for (int i = 0; i < freq; i++)
        {
            frequencies[at] = letter;
            at++;
        }
    }

    int gridLength = width * height;

    srand(time(NULL));

    for (int i = 0; i < gridLength; i++)
    {
        int random = rand() % at;
        char letter = frequencies[random];

        if (letter == '1')
        {
            printf("QU ");
        }
        else
        {
            printf("%c ", letter);
        }
    }
}