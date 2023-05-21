#include "grid.h"
#include "memory.h"
#include <time.h>
#include <stdio.h>
#include <stdlib.h>


//print_grid
//renvoie la frequence total 
int sum_frequency(Characters_frequency characters_frequency){
    int sum = 0;
    for (int i = 0; i < 26; i++)
    {
        sum+=characters_frequency.data[i].frequency;
    }
    return sum;
}
void print_character(char *character){
    if (character[1]==' ')
    {
        printf("%c ",character[0]);
    }
    else{
        printf("%c%c ",character[0],character[1]); // pas de %s pour eviter de rajouter un espace
    }
}

void print_random_character(Characters_frequency characters_frequency,int total_frequency){
    int range_charactere = rand() % total_frequency;
    
    int max_range = 0;
    for (int i = 0; i < 26; i++)
    {
        max_range+=characters_frequency.data[i].frequency;
        if (range_charactere<=max_range)
        {
            print_character(characters_frequency.data[i].character);
            break;
        }
    }
    
}

void print_grid(Characters_frequency characters_frequency,int length,int width){
    int total_frequency = sum_frequency(characters_frequency);
    srand(time(NULL));
    for (int i = 0; i < length*width; i++)
    {
        print_random_character(characters_frequency,total_frequency);
    }
    
}