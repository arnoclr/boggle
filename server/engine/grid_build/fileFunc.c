#include "fileFunc.h"
#include <stdio.h>
#include "structs.h"

//lit une ligne et la parse dans un Character_frequency
int read_line(FILE *file,struct Character_frequency *character_frequency ){
    char buffer[10];

    if(fgets(buffer,sizeof buffer,file)!=NULL){
        *character_frequency = parse_Character_frequency(buffer);
        return 0;
    }
    return -1;

}

int read_file(char name_file[],Characters_frequency* characters_frequency){

    FILE *file_open = fopen(name_file,"r");
    if (file_open == NULL)
    {
        return -1;
    }

    for (int i = 0; i < 26; i++)
    {
        if(read_line(file_open,&characters_frequency->data[i]) == -1){
            return -1;
        }
    }

    if (fclose(file_open)==EOF)
    {
        return -1;
    }

    return 0;
    
}
