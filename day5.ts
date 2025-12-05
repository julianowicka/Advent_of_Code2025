import { readFileSync } from "fs";

const input = readFileSync("input_day5.txt", "utf8").trim().split(/\r?\n/);
const blankIndex = input.findIndex(line => line.trim() === "");

const rangeLines = input.slice(0, blankIndex);
const idLines = input.slice(blankIndex + 1);

const ranges = rangeLines.map(line => {
  const [start, end] = line.split("-").map(Number);
  return [start, end] as [number, number];
});

const ids = idLines.map(Number);

function isFresh(id: number): boolean {
  for (const [start, end] of ranges) {
    if (id >= start && id <= end) return true;
  }
  return false;
}

let freshCount = 0;

for (const id of ids) {
  if (isFresh(id)) freshCount++;
}

console.log("Fresh ingredient IDs:", freshCount);