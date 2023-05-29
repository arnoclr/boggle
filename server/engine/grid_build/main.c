#include <stdlib.h>
#include "structs.h"
#include "grid.h"
#include "fileFunc.h"

//main

//argc = nombre d'arguments passé au programme (de base le nombre d'argument est de 1)
//argv = tableau de chaînes de caractères contenant les arguments (argv[0] = nom du programme)
int main(int argc, char *argv[]){
    int statut =verify_arguments(argc, argv);
    if (statut != 0){
        return statut;
    }
    Args args = {argv[1], atoi(argv[2]), atoi(argv[3])};

    Characters_frequency characters_frequency;
    if (read_file(args.name_file,&characters_frequency)!=0)
    {
        return 250;
    }

    print_grid(characters_frequency,args.length,args.width);

    return 0;
}