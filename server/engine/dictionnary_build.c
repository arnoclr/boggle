/*
dictionnary_build
$ dictionnary_build dico.txt dico.lex
Construit un arbre lexicographique à partir d’un dictionnaire (dico.txt), le sauvegarde dans un fichier binaire
(dico.lex). Aucune sortie n’est attendue.
*/

/*
dictionnaire en texte brut (.txt)
Un fichier contenant tous les words admis du dictionnaire (un par ligne). Les words sont en majuscule, en utilisant
uniquement les caractères A-Z (pas d’accent, de ponctuation, etc.). Ils peuvent éventuellement être suivis d’un espace
et d’un commentaire, (par exemple pour indiquer une valeur utilisée dans le calcul de score). L’ordre alphabétique
n’est pas nécessairement respecté. Une ligne commençant par un espace est ignorée.
dico.txt:
AA
AALENIEN
AALENIENNE (éventuel commentaire ici)
AALENIENNES
AALENIENS
AAS
ABACA ## un autre commentaire
ABACAS
ABACOST
...

*/

/*
    Bloc    Position    Valeur  Signification
    En-tête:
                0       16      Taille de l’en-tête:
                4       300     Nombre de words
                8       1000    Nombre de cellules
                12      12      Taille de chaque cellule
    Cellule 0:
                16      ‘A’     Element
                20      26      FirstChild
                24      25      nSibling
    Cellule 1:
                28      ‘B’     Element
                32      37      FirstChild
                36      24      nSibling
    Cellule 2:
                40      ‘C’     Element
                44      64      FirstChild
                48      24      nSibling
    Cellule 3:
                52      ‘D’     Element
        . . . . . . . . . . .
    Cellule 999:
                12012       0       nSibling
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h> 

const char *filename = "dico.lex";

// Définition du type child Sibling Tree (CSTree)

typedef int Element;

typedef struct node {
    Element elem;
    struct node* firstChild;
    struct node* nextSibling;
} Node;
typedef Node* CSTree;

typedef struct {
    Element elem;
    unsigned int firstChild;
    unsigned int nSiblings;
} ArrayCell;

typedef struct {
    ArrayCell* nodeArray;
    unsigned int nNodes
} StaticTree;

CSTree newCSTree(Element elem, CSTree firstChild, CSTree nextSibling){
    CSTree t = malloc(sizeof(Node));
    if (t == NULL) return NULL;
    t->elem = elem;
    t->firstChild = firstChild;
    t->nextSibling = nextSibling;
    return t;
}

// Imprime t en ordre préfixe (dans l’exemple : 1,2,3,4,6,7,5).
void printPrefix(CSTree t) {
    if (t == NULL) {
        return;
    }

    printf("%d ", t->elem);
    printPrefix(t->firstChild);
    printPrefix(t->nextSibling);
}

// Compte le nombre de nœuds dans l’arbre t.
int size(CSTree t) {
    if (t == NULL) {
        return 0;
    }

    return 1 + size(t->firstChild) + size(t->nextSibling);
}

// Compte le nombre d’enfants du nœud t.
int nChildren(CSTree t) {
    if (t == NULL) {
        return 0;
    }

    return 1 + nSibling(t->firstChild);
}

// Fontion auxiliaire
int nSibling(CSTree t) {
    if (t == NULL || t->nextSibling == NULL) {
        return 0;
    }
    return 1 + nSibling(t->nextSibling);
}

// Fonction auxiliaire
void exportStaticTreeAux(CSTree t, int* i, ArrayCell* nodeArray) {
    if (t == NULL) {
        return;
    }

    nodeArray[*i].elem = t->elem;
    nodeArray[*i].firstChild = *i;
    nodeArray[*i].nSiblings = nChildren(t) - 1;
    (*i)++;

    exportStaticTreeAux(t->nextSibling, i, nodeArray);
    nodeArray[*i].firstChild = *i + 1;
    exportStaticTreeAux(t->firstChild, i, nodeArray);
}


// Crée un arbre statique avec le même contenu que t.
StaticTree exportStaticTree(CSTree t) {
    StaticTree st;
    st.nNodes = size(t);
    st.nodeArray = malloc(st.nNodes * sizeof(ArrayCell));

    int i = 0;
    exportStaticTreeAux(t, &i, st.nodeArray);

    return st;
}

// Renvoie le premier frère de t contenant l’´el´ement e (ou t lui-mˆeme), NULL si aucun n’existe.
CSTree siblingLookup(CSTree t, Element e) {
    if (t == NULL) {
        return NULL;
    }
    
    if (t->elem == e) {
        return t;
    }

    if (t->nextSibling == NULL) {
        return NULL;
    }

    return siblingLookup(t->nextSibling, e);
}

// Insère un noeud contenant e dans la liste de frères de t, et renvoie le noeud correspondant
CSTree sortInsertSibling(CSTree *t, Element e) {
    if (*t == NULL) {
        (*t) = newCSTree(e, NULL, NULL);
        return (*t);
    }

    if ((*t)->nextSibling == NULL) {
        (*t)->nextSibling = newCSTree(e, NULL, NULL);
        return (*t);
    }

    return sortInsertSibling(&(*t)->nextSibling, e);
}

// Renvoie le premier fr`ere de *t contenant e, le noeud est cr´e´e si absent
CSTree sortContinue(CSTree *t, Element e) {
    if (siblingLookup(*t, e) != NULL) return siblingLookup(*t, e);
    return sortInsertSibling(&(*t), e);
}

// Recherche l’´el´ement e parmi les ´el´ements cons´ecutifs de t aux
// positions from,..., from+len-1, renvoie la position de cet ´el´ement
// s’il existe, NONE sinon.
int siblingLookupStatic(StaticTree t, Element e, int from, int len) {
    if (t.nodeArray == NULL) {
        return NULL;
    }

    if (len == 0) {
        if (t.nodeArray[from].elem == e) {
            return e;
        }
        if (t.nodeArray[from].nSiblings == 0) {
            return NULL;
        }
        return siblingLookupStatic(t, e, from + 1, len);
    }

    if (t.nodeArray[from + len - 1].elem == e) {
        return from + len-1;
    }

    if (len > 0) {
        return siblingLookupStatic(t, e, from, len - 1);
    }

    return NULL;
}

int getWordsNumber(FILE *file) {
    char c;
    int nb_lines = 0;

    fseek(file , 0, SEEK_SET);
    while ((c = fgetc(file)) != EOF) {
        if (c == '\n') {
            nb_lines++;
        }
    }

    return nb_lines;
}

CSTree example() {
    CSTree a = newCSTree('A', 
                newCSTree('B', NULL, NULL), 
                newCSTree('C', NULL, NULL)
            );
    CSTree b =  newCSTree('D', NULL,  a );
    return b;
}

// dictionnary_build construit le dictionnaire à partir du fichier dico_text
// il écrit pour chaque mot les cellules avec les éléments (lettre) et le firstChild et le nombre de frères
// Une cellule est codé sur 12 octets (4 octets pour l'élément, 4 octets pour le firstChild et 4 octets pour le nombre de frères)
// L'en tête du fichier est codé sur 16 octets (4 octets pour la taille de l'en tête, 4 octets pour le nombre de mots, 4 octets pour le nombre de cellules et 4 octets pour la taille de chaque cellule)
void dictionnary_build(FILE *dico_text, FILE *dico_lex) {

    dico_text = fopen("dico_maj.txt", "r");
    dico_lex = fopen("dico.lex", "wb");

    // En tête du fichier
    int header_size = 16;
    int nb_words = getWordsNumber(dico_text);
    int nb_cells = 0;
    int cell_size = 12;

    printf("Nombre de mots : %d", nb_words);

    CSTree cs_tree = example();
    // On récupère le nombre de cellules
    nb_cells = size(cs_tree);

    // On écrit l'en tête
    fwrite(&header_size, sizeof(int), 1, dico_lex);
    fwrite(&nb_words, sizeof(int), 1, dico_lex);
    fwrite(&nb_cells, sizeof(int), 1, dico_lex);
    fwrite(&cell_size, sizeof(int), 1, dico_lex);

    // On écrit les cellules
    StaticTree st = exportStaticTree(cs_tree);
    for (int i = 0; i < nb_cells; i++) {
        fwrite(&st.nodeArray[i].elem, sizeof(Element), 1, dico_lex);
        fwrite(&st.nodeArray[i].firstChild, sizeof(int), 1, dico_lex);
        fwrite(&st.nodeArray[i].nSiblings, sizeof(int), 1, dico_lex);
    }

    fclose(dico_text);
    fclose(dico_lex);

}

void majuscule() {
    FILE *dico_file;
    dico_file = fopen("dico.txt", "r");

    FILE *dico_file_maj;
    dico_file_maj = fopen("dico_maj.txt", "w");

    char word[100];

    while (fgets(word, 100, dico_file) != NULL) {
        for (int i = 0; i < strlen(word); i++) {
            word[i] = toupper(word[i]);
        }
        fprintf(dico_file_maj, "%s", word);
    }
    fclose(dico_file);
    fclose(dico_file_maj);
}

int main(int argc, char *argv[])
{
    majuscule();

    FILE *dico_text;
    FILE *dico_lex;

    dictionnary_build(dico_text, dico_lex);

    return 0;

}