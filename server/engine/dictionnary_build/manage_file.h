//fichier regroupant les fonctions utilisant des fichiers

#if !defined(MANAGE_FILE)
#define MANAGE_FILE
#include "tree.h"


CSTree make_CStree_with_file(char input_file[]);

int write_lex(char output_file[],StaticTree tree);
#endif // MANAGE_FILE
