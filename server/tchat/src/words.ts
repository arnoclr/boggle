import { exec } from "./exec";

export async function getWordPathIfValid(
  word: string,
  grid: string
): Promise<false | number[]> {
  const upperCaseWord = word.toUpperCase();
  const path = await getWordPathIfInGrid(upperCaseWord, grid);
  const inDict = await isWordInDictionary(upperCaseWord);
  if (inDict && path !== false) {
    return path;
  }
  return false;
}

export async function getWordPathIfInGrid(
  word: string,
  grid: string
): Promise<false | number[]> {
  if (!isRealWord(word)) {
    return false;
  }
  try {
    const output = await exec(`../engine/grid_path.bin ${word} 4 4 ${grid}`);
    console.log(output);
    if (output.stdout !== "") {
      return output.stdout.split(" ").map((n) => parseInt(n));
    }
  } catch (e) {
    console.log(e);
  }
  return false;
}

export async function isWordInDictionary(word: string): Promise<boolean> {
  if (!isRealWord(word)) {
    return false;
  }
  try {
    await exec("../engine/dictionnary_lookup.bin ../engine/dico.lex " + word);
    return true;
  } catch (e) {
    return false;
  }
}

export async function wordScore(word: string): Promise<number> {
  if (!isRealWord(word)) {
    return 0;
  }
  try {
    await exec(
      `../engine/score_scrabble.bin ../engine/score/lettre_attribution.txt ${word}`
    );
  } catch (e: any) {
    return e.code || 0;
  }
  return 0;
}

function isRealWord(word: string): boolean {
  const regex = /^[A-Z]+$/gi;
  return regex.test(word);
}
