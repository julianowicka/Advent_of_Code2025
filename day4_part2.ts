import { readFileSync } from "fs";

const input = readFileSync("input_day4.txt", "utf8").trim();
let grid = input.split("\n").map(line => line.trim().split(""));

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

function countAdjacentRolls(r: number, c: number): number {
  let count = 0;
  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
      if (grid[nr][nc] === "@") count++;
    }
  }
  return count;
}

function findAccessibleRolls(): [number, number][] {
  const toRemove: [number, number][] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "@") {
        const neighbors = countAdjacentRolls(r, c);
        if (neighbors < 4) {
          toRemove.push([r, c]);
        }
      }
    }
  }
  return toRemove;
}

let totalRemoved = 0;
let round = 0;

while (true) {
  const rollsToRemove = findAccessibleRolls();
  if (rollsToRemove.length === 0) break;
  for (const [r, c] of rollsToRemove) {
    grid[r][c] = ".";
  }
  totalRemoved += rollsToRemove.length;
  round++;
}

console.log("Total rolls removed:", totalRemoved);