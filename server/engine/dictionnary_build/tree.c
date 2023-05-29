#include "tree.h"
#include <stdbool.h>
#include <stdio.h>
#include <ctype.h>
#define NONE 0

CSTree newCSTree(Element elem, CSTree firstChild, CSTree nextSibling){ 
    CSTree t = malloc(sizeof(Node));
    if (t == NULL) return NULL;
    t->elem = elem;
    t->firstChild = firstChild;
    t->nextSibling = nextSibling;
    return t;
}


void printPrefix(CSTree tree){
    if (tree==NULL)
    {
        return;
    }

    printf("%c ", tree->elem);
    printPrefix(tree->firstChild);
    printPrefix(tree->nextSibling);
}

int size(CSTree tree){
    
    if (tree!=NULL)
    {
        return size(tree->firstChild )+size(tree->nextSibling)+1;
    }
    return 0;
}

int nSibling(CSTree tree){
    if (tree==NULL)
    {
        return 0;
    }
    
    return nSibling(tree->nextSibling)+1;
}

int nChildren(CSTree tree){
    if (tree->firstChild==NULL)
    {
        return 0;
    }
    return nSibling(tree->firstChild);
}

int filltab(ArrayCell* tab,int posNextChild,int index,CSTree t){
    if (t==NULL)
    {
        return posNextChild;
    }
    int enfants = nChildren(t);
    if (enfants==0)
    {
        tab[index].elem = t->elem;
        tab[index].nSiblings = nSibling(t)-1;
        tab[index].firstChild = NONE;
        index++;
        posNextChild = filltab(tab,posNextChild,index,t->nextSibling);
    }
    else{
        int thisChild = posNextChild;
        posNextChild+=enfants;
        tab[index].elem = t->elem;
        tab[index].nSiblings = nSibling(t)-1;
        tab[index].firstChild = thisChild;
        index++;
        posNextChild = filltab(tab,posNextChild,index,t->nextSibling);
        posNextChild = filltab(tab,posNextChild,thisChild,t->firstChild);
    }
    return posNextChild;
}

StaticTree exportStaticTree(CSTree tree){
    int sizeOfTree = size(tree);
    StaticTree staticTree;
    staticTree.nNodes = sizeOfTree;
    ArrayCell* tab = malloc(sizeof(ArrayCell)*sizeOfTree);
    if (tab==NULL)
    {
        exit(245);
    }

    filltab(tab,nSibling(tree),0,tree);
    staticTree.nodeArray = tab;
    return staticTree;
}


unsigned int countElements(Element elem,StaticTree tree){
    unsigned int count = 0;
    for (unsigned int i = 0; i < tree.nNodes; i++)
    {
        if (tree.nodeArray[i].elem==elem)
        {
            count++;
        }
    }
    return count;
}

void printStatic(StaticTree tree){

    FILE* f = fopen("static.txt","w");
    if (f==NULL)
    {
        exit(250);
    }

    fseek(f,0,SEEK_END);
    
    for(unsigned int i = 0; i < tree.nNodes; i++){
        fprintf(f,"index: %d \tcharactere: %c \tfirstChild: %d \tnSiblings: %d\n",i,tree.nodeArray[i].elem=='\0'?'-':tree.nodeArray[i].elem ,tree.nodeArray[i].firstChild,tree.nodeArray[i].nSiblings);
    }
    fclose(f);
}

_Bool sibling_contains (CSTree tree,Element elem){
    if(tree == NULL){
        return false;
    }
    return (tree->elem == elem) || sibling_contains(tree->nextSibling,elem);
}

void add_sibling(CSTree *tree,Element elem){ //a partir d'un arbre non null, rajoute un frere
    if(*tree==NULL){
        *tree=newCSTree(elem,NULL,NULL);
    }
    else{
        add_sibling(&(*tree)->nextSibling,elem);
    }
}


void add_path_in_CStree(CSTree *tree, Line line,int index){
    
    if (index>line.size)    //verification de l'index
    {
        exit(EXIT_FAILURE); // ne devrait jamais arrivé
    }
    if (*tree==NULL && isalpha(line.tab[index])) // cas ou si l'arbre est vide et que l'on ne veux pas un caractere indésirable
    {
        *tree = newCSTree(line.tab[index],NULL,NULL); 
    }
    
    if(!isalpha(line.tab[index])){  //fin du mot, ajout de la fin de mot dans l'arbre
        if (sibling_contains(*tree,'\0')){   
            return ;
        }
        add_sibling(tree,'\0');
        return ;
    }
    if (line.tab[index]==(*tree)->elem) //si le caractere est le meme que celui de l'arbre alors on passe au prochain et on descend dans l'arbre
    {
        add_path_in_CStree(&(*tree)->firstChild,line,index+1);
    }
    else{
        if ((*tree)->nextSibling==NULL)
        {
            add_sibling(tree,line.tab[index]);
        }
        
        add_path_in_CStree(&(*tree)->nextSibling,line,index);
    }

}

void freeCSTree(CSTree tree){
    if (tree==NULL)
    {
        return;
    }
    freeCSTree(tree->firstChild);
    freeCSTree(tree->nextSibling);
    free(tree);
}

void freeStaticTree(StaticTree tree){
    free(tree.nodeArray);
}
