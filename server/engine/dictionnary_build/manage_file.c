#include "manage_file.h"
#include <stdio.h>
#include "tree.h"

int read_line(FILE *file,Line *line){
    if(fgets(line->tab,line->size,file)!=NULL){
        return 0;
    }
    return -1;

}

CSTree make_CStree_with_file(char input_file[]){
    FILE *file = fopen(input_file,"r");
    if (file == NULL)
    {
        exit(250);
    }

    
    char tab[255];
    Line line = {tab,255};
    CSTree tree = NULL;

    while(read_line(file,&line)!=-1){
        add_path_in_CStree(&tree,line,0);

    }

    fclose(file);

    return tree;
}


Header make_header(StaticTree tree){
    Header header;
    header.headerSize = sizeof(Header);
    header.numWords = countElements('\0',tree);
    header.nNodes = tree.nNodes;
    header.cellSize = sizeof(ArrayCell);
    return header;
}


int write_lex(char output_file[],StaticTree tree){
    
    FILE *file = fopen(output_file,"wb");
    if (file == NULL)
    {
        return 250;
    }
    
    Header head = make_header(tree);
    fwrite(&head,sizeof(Header),1,file);
    fwrite(tree.nodeArray,head.nNodes*sizeof(ArrayCell),1,file);
    
    
    
    if(fclose(file)!=0){
        return 250;
    }

    return 0;
}