#include <stdio.h>
#include "structs.h"
#include "manage_file.h"
#include "tree.h"



int main(int argc, char *argv[]){
    int statut = verify_arguments(argc); 
    if (statut != 0){
        return statut;
    }
    Args args= {argv[1],argv[2]};
    
    CSTree tree = make_CStree_with_file(args.input_file);
    
    StaticTree static_tree = exportStaticTree(tree);
    
    statut = write_lex(args.output_file,static_tree);

    freeCSTree(tree);
    freeStaticTree(static_tree);

    return statut;

    


}




