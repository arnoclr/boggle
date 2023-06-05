#include <stdlib.h>
#include <stdio.h>
#include "grid.h"
#include "structs.h"
#include "path.h"
#include "tools.h"



int main(int argc, char *argv[]) {
    int error = verify_arguments(argc,argv);
    if (error != 0){
        return error;
    }
    Array2D grid = create_grid(argc, argv);
    ValidPath path= search_word_in_grid(grid,argv[1]);
    freeArray2D(grid);
    if (path.valid)
    {
        print_path_of_word(path.path,grid.width);
        freeGridPath(path.path);
    }else{
        freeGridPath(path.path);
        return 1;
    }
    
    return 0;
}