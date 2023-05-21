#if !defined(structs)
#define structs

//regroupe les structures de données du programme, ainsi que certaine fonction associé a elle

struct Character_frequency {
    char character[3];
    int frequency;
};

typedef struct {
    struct Character_frequency data[26];  
}  Characters_frequency;

// manage Arguments

typedef struct {
    char *name_file;
    int length;
    int width;
} Args;

struct Character_frequency parse_Character_frequency(char buffer[]);
int verify_arguments(int argc,char *argv[]);

#endif // structs
