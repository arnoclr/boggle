import { promisify } from "util";
import { exec as e } from "child_process";

export const exec = promisify(e);
