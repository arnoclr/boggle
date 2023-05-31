LETTERS_GROUPS = ['qu', 'ch']


def capitalize(word):
    word = word.lower()
    word = word[0].upper() + word[1:]
    return word


def build_frequence(file_read):
    frequence = {}
    with open(file_read, 'r') as f:
        while(f.readline()):
            mot = f.readline().lower()

            for i in range(len(mot)):
                chars = mot[i] if mot[i:i +
                                      2] not in LETTERS_GROUPS else mot[i:i+2]

                if chars in ['\n', ' ', '']:
                    continue

                if chars not in frequence:
                    frequence[chars] = 0

                frequence[chars] += 1

                i += len(chars) - 1

    return normalize_frequence(frequence)


def normalize_frequence(frequence, MAX_VALUE=100, MIN_VALUE=1):
    print(frequence)
    maxi = max(frequence.values())
    for key, value in frequence.items():
        frequence[key] = int(
            (value / maxi) * (MAX_VALUE - MIN_VALUE) + MIN_VALUE)
    return frequence


def write_frequence(file_write, frequence):
    with open(file_write, 'w') as f:
        # Frequence est un dictionnaire
        is_first_line = True
        for key, value in frequence.items():
            start_of_line = "" if is_first_line else "\n"
            f.write(start_of_line + capitalize(key) + " " + str(value))
            is_first_line = False


frequence = build_frequence("dictionnary_build/dico.txt")

write_frequence("grid_build/frequence.txt", frequence)
