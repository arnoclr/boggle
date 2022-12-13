/*
dictionnary_build
$ dictionnary_build dico.txt dico.lex
Construit un arbre lexicographique à partir d’un dictionnaire (dico.txt), le sauvegarde dans un fichier binaire
(dico.lex). Aucune sortie n’est attendue.
*/

/*
dictionnaire en texte brut (.txt)
Un fichier contenant tous les mots admis du dictionnaire (un par ligne). Les mots sont en majuscule, en utilisant
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
                4       300     Nombre de mots
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

// fonction qui transforme les mots du dico.txt en majuscule
void majuscule() {
    FILE *dico_file;
    dico_file = fopen("dico.txt", "r");

    FILE *dico_file_maj;
    dico_file_maj = fopen("dico_maj.txt", "w");

    char mot[100];

    while (fgets(mot, 100, dico_file) != NULL) {
        for (int i = 0; i < strlen(mot); i++) {
            mot[i] = toupper(mot[i]);
        }
        fprintf(dico_file_maj, "%s", mot);
    }
    fclose(dico_file);
    fclose(dico_file_maj);
}

// main
int main(int argc, char *argv[])
{
    majuscule();

}