#include "grid.h"
#include <stdio.h>
#include "structs.h"
#include "array2D.h"
#include "character.h"
#include <stdlib.h>
#include <string.h>
#include "tools.h"
#include "path.h"

// les 2 fonctions sont employé afin de trouver un chemin valide
int add_position_in_path_if_valid(GridPath *path,Array2D grid,Coord2D coord,char* word,unsigned int index,unsigned int index_path);
int search_letter_adjacent_in_grid(Array2D grid,GridPath* path,char *word,unsigned int index,unsigned int index_path);

void fill_grid(Array2D grid,unsigned int argc, char *argv[]){
    for (unsigned int i = 0; i < grid.width; i++)
    {
        for (unsigned int j = 0; j < grid.height; j++)
        {
            Character character;
            for (int k = 0; k < maxChar; k++)
            {
                character = parse_Character(argv[4+i+j*grid.width]);
            }
            set_character(&grid,i,j,character);
        }
    }
    
}
Array2D create_grid(unsigned int argc, char *argv[]){
    int width = atoi(argv[2]);
    int height = atoi(argv[3]);
    Array2D grid = createArray2D(width, height);
    fill_grid(grid, argc, argv);
    return grid;
}

void set_character(Array2D *array2D,unsigned int x,unsigned int y, Character character) {
    unsigned int index = x + y * array2D->width;
    if (index < array2D->width * array2D->height && index >= 0){
        array2D->array[index] = character;
    }
    else{
        exit(EXIT_FAILURE);//les coordonnées données ne sont pas dans la grille 
    }
}

Character get_Character_in_grid(unsigned int x,unsigned int y,Array2D array2D){
    unsigned int index = x + y * array2D.width;
    if (index < array2D.width * array2D.height && index >= 0){
        return array2D.array[index];
    }
    else{
        exit(EXIT_FAILURE );//les coordonnées données ne sont pas dans la grille 
    }
}


void print_grid(Array2D grid){
    for (unsigned int i = 0; i < grid.width; i++)
    {
        for (unsigned int j = 0; j < grid.height; j++)
        {
            Character character = get_Character_in_grid(j,i,grid);
            printf("%s ",character.character);
        }
        printf("\n");
    }
}

int add_position_in_path_if_valid(GridPath *path,Array2D grid,Coord2D coord,char* word,unsigned int index,unsigned int index_path){
    
    if (Coord_in_Array2D(grid,coord) && !Coord_in_Path(*path,coord,index_path)) // on regarde si la case est une case valide
    {
        Character character = get_Character_in_grid(coord.x,coord.y,grid);
        if(character.character[1]!='\0'){   // on regarde si on a affaire au QU
            if (index+1 < strlen(word))   //on regarde si il nous reste assez d'espace pour comparer cette lettre du mot, ainsi que la suivante  
            {
                if (character.character[0]==word[index] && character.character[1]==word[index+1])
                {
                    path->path[index_path] = coord;
                    if (index_path == path->length-1) // le mot a été trouvé, on peut alors sortir de la fonction
                    {
                        return 1;
                    }
                    int result = search_letter_adjacent_in_grid(grid,path,word,index+2,index_path+1);
                    if (result==1)
                    {
                        return 1;   
                    }
                    
                }
            }else{
                return 0;
            }
            
        }
        if (character.character[0]==word[index])
        {
            path->path[index_path] = coord;
            if (index_path == path->length-1) // le mot a été trouvé, on peut alors sortir de la fonction
            {
                return 1;
            }
            int result = search_letter_adjacent_in_grid(grid,path,word,index+1,index_path+1);
            if (result==1)
            {
                return 1;   
            }
            
        }

    }
    return 0;
}

/*
coordBegin correspond a la coordonnée ou chercher la premiere lettre
index correspond a l'index de la lettre a chercher dans le mot
path correspond au chemin emprunté pour faire le mot (jusqu'a l'index)
*/
int search_letter_adjacent_in_grid(Array2D grid,GridPath* path,char *word,unsigned int index,unsigned int index_path){ 

    for(int i = -1; i <= 1;i++){
        for(int j = -1; j <= 1;j++){

            Coord2D coord;
            
            coord.x = path->path[index_path-1].x + i;
            coord.y = path->path[index_path-1].y + j;
            
            int result = add_position_in_path_if_valid(path,grid,coord,word,index,index_path);
            if (result==1)
            {
                return 1;   
            }
        }
    }
    return 0;
}


ValidPath search_word_in_grid(Array2D grid, char *word){
    GridPath path;
    
    path.length = strlen(word)-wordOccurence(word,'Q');
    
    path.path = (Coord2D*)malloc(path.length * sizeof(Coord2D));
    if (path.path == NULL)
    {
        exit(245);
    }

    for (unsigned int i = 0; i < grid.width; i++)
    {
        for (unsigned int j = 0; j < grid.height; j++)
        {
            Coord2D coordBegin = {i,j};
            if (add_position_in_path_if_valid(&path,grid,coordBegin,word,0,0)==1) // si le mot a été trouvé
            {
                ValidPath validPath;
                validPath.path = path;
                validPath.valid = true;
                return validPath;
            }
        }
        
    }
    
    ValidPath validPath;
    validPath.path = path;
    validPath.valid = false;
    return validPath;
}
