#include "path.h"
#include <stdio.h>
#include "array2D.h"
#include <stdlib.h>

_Bool Coord_in_Path(GridPath path,Coord2D coord,unsigned int index){ //regarde les coordonnées dans le path jusqu'à l'index
    for (unsigned int i = 0; i < index; i++)
    {
        if (path.path[i].x == coord.x && path.path[i].y == coord.y){
            return true;
        }
    }
    return false;
}




void print_path_of_word(GridPath path,unsigned int width){
    for (unsigned int i = 0; i < path.length; i++)
    {
        printf("%u ",convert2DTo1D(path.path[i].x,path.path[i].y,width));
    }
    printf("\n");
}

void freeGridPath(GridPath path ){
    free(path.path);
}