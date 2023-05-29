//fichier regroupant les fonctions utilisant les différents arbres

#ifndef tree_h
#define tree_h

#include <memory.h>
#include <stdlib.h>
#include "structs.h"

CSTree newCSTree(Element elem, CSTree firstChild, CSTree nextSibling);

void printPrefix(CSTree tree);

StaticTree exportStaticTree(CSTree tree);

//comte le nombre d'occurence de l'element dans l'arbre
unsigned int countElements(Element elem,StaticTree tree);

void printStatic(StaticTree tree);

_Bool sibling_contains (CSTree tree,Element elem);

void add_sibling(CSTree *tree,Element elem);

//fonction ajoutant un chemin dans l'arbre à partir d'une ligne
void add_path_in_CStree(CSTree *tree, Line line,int index);

void freeCSTree(CSTree tree);
void freeStaticTree(StaticTree tree);

#endif