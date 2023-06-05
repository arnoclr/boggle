#include "structs.h"
#include "stdbool.h"
#include <ctype.h>
#include <string.h>
#include <stdlib.h>

struct Character_frequency parse_Character_frequency(char buffer[]){
    struct Character_frequency character_frequency;
    character_frequency.character[0] = buffer[0];
    character_frequency.character[1] = buffer[1];
    character_frequency.character[2] = '\0';


    char frequency[3];
    frequency[0] = buffer[2];
    frequency[1] = buffer[3];
    frequency[2] = buffer[4];
    character_frequency.frequency = atoi(frequency);

    return character_frequency;
}


_Bool isNumber(char str[])
{
    int i = 0;
    while (str[i] != '\0')
    {
        if (!isdigit(str[i]))
            return false;
        i++;
    }
    return true;
}

int verify_arguments(int argc,char *argv[]){
    if (argc != 4){
        return 255;  
    }
    if (isNumber(argv[2]) && isNumber(argv[3])){
        return 0;
    }
    return 254;
}