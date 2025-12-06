import { readFileSync } from "fs";


const rawContent = readFileSync("input_day6.txt", "utf8");
const lines = rawContent.split(/\r?\n/).filter(line => line.length > 0);

const maxWidth = Math.max(...lines.map(l => l.length));
const grid = lines.map(line => line.padEnd(maxWidth, " "));

const height = grid.length;
const operatorRowIndex = height - 1;

let total = 0;
let currentBlockCols: string[][] = [];

for (let x = 0; x <= maxWidth; x++) {
  let isSeparator = false;
  
  if (x < maxWidth) {
    const columnChars: string[] = [];
    for (let y = 0; y < height; y++) {
      columnChars.push(grid[y][x]);
    }
    
    if (columnChars.every(char => char === " ")) {
      isSeparator = true;
    } else {
      currentBlockCols.push(columnChars);
    }
  } else {
    isSeparator = true;
  }

  if (isSeparator && currentBlockCols.length > 0) {
    let operator = "";
    const nums: number[] = [];

    for (let colIdx = currentBlockCols.length - 1; colIdx >= 0; colIdx--) {
      const col = currentBlockCols[colIdx];
      const charAtBottom = col[operatorRowIndex];
      
      if (charAtBottom === "+" || charAtBottom === "*") {
        operator = charAtBottom;
      }

      const numberStr = col.slice(0, operatorRowIndex).join("").replace(/\s/g, "");
      
      if (numberStr.length > 0) {
        nums.push(Number(numberStr));
      }
    }

    let blockResult = 0;
    if (operator === "+") {
      blockResult = nums.reduce((a, b) => a + b, 0);
    } else if (operator === "*") {
      blockResult = nums.reduce((a, b) => a * b, 1);
    }

    total += blockResult;
    currentBlockCols = [];
  }
}

console.log("total:", total);
