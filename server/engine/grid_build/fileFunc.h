#if !defined(fileFunc)
#define fileFunc

#include <stdio.h>
#include "structs.h"

//fonction qui manipule les fichiers


int read_line(FILE *file,struct Character_frequency *character_frequency );
int read_file(char name_file[],Characters_frequency* characters_frequency);


#endif // fileFunc
