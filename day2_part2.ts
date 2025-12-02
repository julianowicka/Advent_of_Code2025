import { readFileSync } from "fs";

const input = readFileSync("input_day2.txt", "utf8").replace(/\r?\n/g, "");

function isInvalidId(num: number): boolean {
  const str = String(num);
  const len = str.length;

  for (let i = 1; i <= len / 2; i++) {
    if (len % i !== 0) continue;
    const pattern = str.slice(0, i);
    const repeated = pattern.repeat(len / i);
    if (repeated === str) return true;
  }
  return false;
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

console.log("Znaleziono niepoprawne ID:", invalidIds.join(", "));
console.log("Suma niepoprawnych ID:", sum);