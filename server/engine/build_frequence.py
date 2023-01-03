
def build_frequence(file_read):
    frequence = {}
    with open(file_read, 'r') as f:
        while(f.readline()):
            mot = f.readline()

            for i in range(len(mot)):
                # Si il y a un "qu" on le stock en tant que "qu"
                if mot[i] == "q" and mot[i+1] == "u":
                    if "qu" in frequence:
                        frequence["qu"] += 1
                    else:
                        frequence["qu"] = 1
                elif (mot[i] != " " and mot[i] != "\n"):
                    if mot[i] in frequence:
                        frequence[mot[i]] += 1
                    else:
                        frequence[mot[i]] = 1
                    
    # On va trier le dictionnaire par ordre decroissant
    frequence = sorted(frequence.items(), key=lambda x: x[1], reverse=True)

    return frequence

def write_frequence(file_write, frequence):
    with open(file_write, 'w') as f:
        # Frequence est un dictionnaire
        for key, value in frequence:
            f.write(key.upper() + " " + str(value) + "\n")

            


frequence = build_frequence("dico.txt")

write_frequence("frequence.txt", frequence)