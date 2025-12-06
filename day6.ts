import { readFileSync } from "fs";

const rawContent = readFileSync("input_day6.txt", "utf8");

const lines = rawContent
  .trim() 
  .split(/\r?\n/) 
  .filter(line => line.trim() !== ""); 

const operatorLine = lines[lines.length - 1];
const numberLines = lines.slice(0, -1);

const operators = operatorLine
  .trim()
  .split(/\s+/); 

const grid = numberLines.map(line => 
  line.trim().split(/\s+/)
);

let total = 0;

for (let colIndex = 0; colIndex < operators.length; colIndex++) {
  const op = operators[colIndex];
  const nums: number[] = [];

  for (const row of grid) {
    const nStr = row[colIndex];
    if (nStr && !isNaN(Number(nStr))) {
      nums.push(Number(nStr));
    }
  }

  let result = 0;
  if (nums.length > 0) {
    if (op === "+") {
      result = nums.reduce((a, b) => a + b, 0);
    } else if (op === "*") {    
      result = nums.reduce((a, b) => a * b, 1);
    }
  }

  console.log(`Column ${colIndex} (${op}): [${nums.join(", ")}] = ${result}`);
  total += result;
}

console.log("total:", total);