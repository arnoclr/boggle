#include <stdlib.h>
#include <stdio.h>
#include <limits.h>

typedef char Element;

typedef struct node
{
    Element elem;
    struct node *firstChild;
    struct node *nextSibling;
} Node;
typedef Node *CSTree;

CSTree newTree(Element elem, CSTree firstChild, CSTree nextSibling)
{
    CSTree t = malloc(sizeof(Node));
    if (t == NULL)
        return NULL;
    t->elem = elem;
    t->firstChild = firstChild;
    t->nextSibling = nextSibling;
    return t;
}

void insertWordIntoCSTree(CSTree *t, char *s)
{
    char c = *s;
    if (*t == NULL)
    {
        *t = newTree(c, NULL, NULL);
        if (c != "\0")
        {
            insertWordIntoCSTree(*t->firstChild, *(s + 1));
        }
    }
    else
    {
        if (c == "\0")
        {
            *t = newTree(c, NULL, *t);
        }
        else
        {
            if (c == *t->elem)
            {
                insertWordIntoCSTree(*t->firstChild, *(s + 1));
            }
            else
            {
                insertWordIntoCSTree(*t->nextSibling, *s);
            }
        }
    }
}

ArrayCell makeCell(CSTree t, int index, int inter)
{
    ArrayCell ce;
    ce.elem = t->elem;
    ce.nSiblings = nSiblings(t);
    ce.firstChild = index + inter + ce.nSiblings + 1;
}

void exportStaticTreeRec(CSTree t, StaticTree r, int index, int inter)
{
    if (t == NULL)
    {
        return;
    }
    r.nodeArray[i] = makeCell(t, index, inter);
    exportStaticTreeRec(t->firstChild, r, r.nodeArray[i].firstChild, 0);
    exportStaticTreeRec(t->nextSibling, r, index + 1, inter + size(t) - 1);
}

StaticTree exportStaticTree(CSTree t)
{
    StaticTree r;
    r.nNodes = size(t);
    r.nodeArray = malloc(r.nNodes * sizeof(ArrayCell));
    exportStaticTreeRec(t, r, 0, 0);
    return r;
}