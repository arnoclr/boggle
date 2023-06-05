gcc dictionnary_build/*.c -o dictionnary_build.bin
gcc dictionnary_lookup/main.c dictionnary_lookup/lookup/*.c -o dictionnary_lookup.bin
gcc grid_build/*.c -o grid_build.bin
gcc grid_path/*.c -o grid_path.bin
gcc score/score_basique.c -o score_basique.bin
gcc score/score_scrabble.c -o score_scrabble.bin
gcc solve/*.c dictionnary_lookup/lookup/*.c -o solve.bin

./dictionnary_build.bin dictionnary_build/dico.txt dico.lex

