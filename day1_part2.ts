import { readFileSync } from "fs";


function findPasswordPart2(rotations: string[]): number {
  let position = 50;
  let counter = 0;


  for (const rotation of rotations) {
    const direction = rotation[0];
    const distance = parseInt(rotation.slice(1), 10);

    const fullRevolutions = Math.floor(distance / 100);
    counter += fullRevolutions;

    let step: number;
    if (direction === "R") {
      step = 1;
    } else {
      step = -1;
    }

    const partialSteps = distance % 100;



    for (let i = 0; i < partialSteps; i++) {
      const prevPosition = position;
      position = (position + step + 100) % 100;
      if (position === 0) {
        counter++;

      }
    }

  }

  return counter;
}

const inputPath = "input.txt";
const fileData = readFileSync(inputPath, "utf8")
  .trim()
  .split("\n")
  .filter(Boolean);

const password = findPasswordPart2(fileData);
console.log("Password:", password);