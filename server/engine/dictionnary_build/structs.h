//fichier regroupant les structures utilisées dans le programme
#if !defined(STRUCTS)
#define STRUCTS


typedef char Element;

typedef struct node{
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
    unsigned int nNodes;
} StaticTree;

typedef struct {
    char *tab;
    int size;
}  Line;

typedef struct {
    unsigned int headerSize;
    unsigned int numWords;
    unsigned int nNodes;
    unsigned int cellSize;
} Header;

typedef struct {
    char *input_file;
    char *output_file;
} Args;

int verify_arguments(int argc);


#endif // STRUCTS
