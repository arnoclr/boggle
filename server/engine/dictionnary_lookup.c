// $ dictionnary_lookup dico.lex BONJOUR
// 0 -> le mot est présent
// 1 -> c'est un préfixe
// 2 -> le mot n'est pas présent

#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>

const char *filename = "fr.lex";

int main(int argc, char *argv[])
{
    // read fr.lex file
    // get user word
    printf("The argument supplied is %s\n", argv[1]);

    FILE *lexFile = fopen(filename, "rb");
    if (lexFile == NULL)
    {
        exit(1);
    }

    struct stat sb;
    if (stat(filename, &sb) == -1)
    {
        perror("stat");
        exit(1);
    }

    char *file_contents = malloc(sb.st_size);
    fread(file_contents, sb.st_size, 1, lexFile);

    printf("read data: %s\n", file_contents);
    fclose(lexFile);

    free(file_contents);

    // determiner la taille de l'entete
    // initialiser les tailles en fonction de l'entete

    // lire la case qui correspond à la premiere lettre, lire le nSibling pour avoir la case de meme niveau suivante
    // Quand on est sur la bonne case, lire le first child
    // lire le nsibling a chaque fois afin de tomber sur la deuxieme lettre
    // ...

    // si quand on parcrourt le nsibling on trouve pas la lettre demandée, alors le mot n'est pas présent
    // si on trouve toutes les cases et que la case contient un first child alors c'est un préfixe
    // si on trouve toutes les cases et que la case ne contient aucun first child alors c'est le mot

    return 0;
}