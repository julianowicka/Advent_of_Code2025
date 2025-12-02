import { readFileSync } from "fs";

const input = readFileSync("input_day2.txt", "utf8").replace(/\r?\n/g, "");

function isInvalidId(num: number): boolean {
  const str = String(num);
  if (str.length % 2 !== 0) return false;
  const half = str.length / 2;
  const left = str.slice(0, half);
  const right = str.slice(half);
  return left === right;
}

function findInvalidIdsSum(input: string): { sum: number; invalidIds: number[] } {
  const ranges = input.split(",").filter(Boolean);
  const invalidIds: number[] = [];
  let sum = 0;

  for (const range of ranges) {
    const [startStr, endStr] = range.split("-");
    if (!startStr || !endStr) continue;
    const start = Number(startStr);
    const end = Number(endStr);

    for (let num = start; num <= end; num++) {
      if (isInvalidId(num)) {
        invalidIds.push(num);
        sum += num;
      }
    }
  }

  return { sum, invalidIds };
}

const { sum, invalidIds } = findInvalidIdsSum(input);

console.log("Invalid ID:", invalidIds.join(", "));
console.log("Sum invalid ID:", sum);