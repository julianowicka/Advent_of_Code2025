import { readFileSync } from "fs";


function findPassword(rotations: string[]): number {
  let position = 50;
  let counter = 0;

  for (const rotation of rotations) {
    const direction = rotation[0];
    const distance = parseInt(rotation.slice(1), 10);

    if (direction === 'L') {
      position = (position - distance + 100) % 100;
    } else if (direction === 'R') {
      position = (position + distance) % 100;
    } else {
      throw new Error(`Unknown direction: ${rotation}`);
    }

    if (position === 0) counter++;
  }

  return counter;
}

const inputPath = "input.txt";
const fileData = readFileSync(inputPath, "utf8")
  .trim()
  .split("\n")
  .filter(Boolean);

console.log("Password:", findPassword(fileData));