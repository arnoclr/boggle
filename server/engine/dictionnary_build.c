/*
File name: dictionnary_build.c
Execute: $ dictionnary_build dico.txt dico.lex
Description: Construit un arbre lexicographique à partir d’un dictionnaire (dico.txt), le sauvegarde dans un fichier binaire 
(dico.lex). Aucune sortie n’est attendue.
*/

/*
Taille de chaque cellule: 24 octets
les 8 premiers octets sont pour l'élément
les 8 suivants sont pour le FirstChild
les 8 suivants sont pour le nSibling

Pour lire un mot, on lit les 8 premiers octets, puis on lit le FirstChild en le multipliant par 24, puis on lit le nSibling en 
le multipliant par 24 et en ajoutant 32 pour l'en-tête du fichier.

Donc par exemple si on lit un mot commençant par un A, le FirstChild sera 486 037, donc on le multiplie par 24 et on
ajoute 32 pour l'en-tête du fichier ce qui fera 11 664 920, donc on se place à l'octet 11 664 920, etc.

*/


#include <stdio.h>

int main() {
    
    // File dico.txt
    FILE *dico = fopen("dico.txt", "r");

    // File dico.lex
    FILE *lex = fopen("dico.lex", "w");
    
    // print words in dico.txt
    char word[100];
    while (fscanf(dico, "%s", word) != EOF) {
        printf("%s ", word);
    }

    return 0;
}
