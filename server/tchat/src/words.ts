import { exec } from "./exec";

export async function isValidWord(
  word: string,
  grid: string
): Promise<boolean> {
  const upperCaseWord = word.toUpperCase();
  const inGrid = await isWordInGrid(upperCaseWord, grid);
  const inDict = await isWordInDictionary(upperCaseWord);
  console.log(inGrid, inDict);
  return inDict && inGrid;
}

export async function isWordInGrid(
  word: string,
  grid: string
): Promise<boolean> {
  if (!isRealWord(word)) {
    return false;
  }
  try {
    const output = await exec(`../engine/grid_path ${word} 4 4 ${grid}`);
    return output.stdout !== "";
  } catch (e) {
    return false;
  }
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

function isRealWord(word: string): boolean {
  const regex = /^[A-Z]+$/gi;
  return regex.test(word);
}
