//prend un fichier d'attribution des points par lettre et un mot
//puis retourne le score du mot
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

typedef struct letter_score{
    char letter;
    int score;
} Letter_score;

int verify_arguments(int argc,char* argv[]){
    if(argc!=3){
        return 255;
    }
    return 0;
}

Letter_score parse_letter_score(char buffer[]){
    Letter_score letter;
    letter.letter = buffer[0];
    char buffer_score[3];

    buffer_score[0] = buffer[2];
    buffer_score[1] = buffer[3];
    buffer_score[2] = '\0';

    letter.score = atoi(buffer_score);
    return letter;
}

int read_line(FILE *file,Letter_score *character_frequency ){
    char buffer[10];

    if(fgets(buffer,sizeof buffer,file)!=NULL){
        *character_frequency = parse_letter_score(buffer);
        return 0;
    }
    return -1;

}


int read_file(char name_file[],Letter_score* characters_frequency){

    FILE *file_open = fopen(name_file,"r");
    if (file_open == NULL)
    {
        return -1;
    }

    for (int i = 0; i < 26; i++)
    {
        Letter_score letter_score;
        if(read_line(file_open,&letter_score) == -1){
            return -1;
        }
        characters_frequency[i] = letter_score;
    }

    if (fclose(file_open)==EOF)
    {
        return -1;
    }

    return 0;
    
}

int score_word(char word[],Letter_score* letter_score_tab){
    int score = 0;
    for (size_t i = 0; i < strlen(word); i++)
    {
        for (size_t j = 0; j < 26; j++)
        {
            if (word[i] == letter_score_tab[j].letter)
            {
                score += letter_score_tab[j].score;
            }
        }
    }
    return score;
}


int main(int argc,char* argv[]){
    verify_arguments(argc,argv);
    Letter_score letter_score_tab[26]; 
    read_file(argv[1],letter_score_tab);
    int score = score_word(argv[2],letter_score_tab);
    return score;   
}