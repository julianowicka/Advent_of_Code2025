import { readFileSync } from "fs";

const input = readFileSync("input_day5.txt", "utf8").trim().split(/\r?\n/);
const blankIndex = input.findIndex(line => line.trim() === "");
const rangeLines = blankIndex === -1 ? input : input.slice(0, blankIndex);

let ranges = rangeLines.map(line => {
  const [start, end] = line.split("-").map(Number);
  return [start, end] as [number, number];
});

ranges.sort((a, b) => a[0] - b[0]);

const merged: [number, number][] = [];
for (const [start, end] of ranges) {
  if (merged.length === 0) {
    merged.push([start, end]);
  } else {
    const last = merged[merged.length - 1];
    if (start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
}

let totalFresh = 0;
for (const [start, end] of merged) {
  totalFresh += end - start + 1;
}

console.log("Total fresh ingredient IDs:", totalFresh);