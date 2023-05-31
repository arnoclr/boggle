//fichier regroupant les fonction sur la grid

#if !defined(grid_h)
#define grid_h
#include "array2D.h"
#include "structs.h"

Array2D create_grid(unsigned int argc, char *argv[]);
void set_character(Array2D *array2D,unsigned int x,unsigned int y, Character character);
Character get_Character_in_grid(unsigned int x,unsigned int y,Array2D array2D);
ValidPath search_word_in_grid(Array2D grid, char *word);



#endif // grid_h
