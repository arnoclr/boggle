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
    const output = await exec(`../engine/grid_path ${word} 4 4 ${grid}`);
    if (output.stdout !== "") {
      return output.stdout.split(" ").map((n) => parseInt(n));
    }
  } catch (e) {}
  return false;
}

export async function isWordInDictionary(word: string): Promise<boolean> {
  if (!isRealWord(word)) {
    return false;
  }
  try {
    const output = await exec(
      "../engine/dictionnary_lookup ../engine/fr32.lex " + word
    );
    return output.stdout === "found";
  } catch (e) {
    return false;
  }
}

export async function wordScore(word: string): Promise<number> {
  if (!isRealWord(word)) {
    return 0;
  }
  try {
    const output = await exec(`../engine/score ${word}`);
    return parseInt(output.stdout);
  } catch (e) {
    return 0;
  }
}

function isRealWord(word: string): boolean {
  const regex = /^[A-Z]+$/gi;
  return regex.test(word);
}
