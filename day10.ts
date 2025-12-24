import { readFileSync } from "fs";
import { resolve } from "path";

interface Machine {
  lightsCount: number;
  target: number[];
  buttons: number[][];
}

function parseLine(line: string): Machine {
  const diagramMatch = line.match(/\[([.#]+)\]/);
  if (!diagramMatch) throw new Error("Invalid diagram");

  const diagram = diagramMatch[1];
  const lightsCount = diagram.length;
  const target = diagram.split("").map(c => (c === "#" ? 1 : 0));

  const buttonMatches = [...line.matchAll(/\(([\d,]+)\)/g)];
  const buttons: number[][] = buttonMatches.map((match) => {
    const indices = match[1].split(",").map(Number);
    const button = new Array(lightsCount).fill(0);
    indices.forEach((idx) => (button[idx] = 1));
    return button;
  });

  return { lightsCount, target, buttons };
}

function minButtonPresses(machine: Machine): number {
  const { lightsCount, target, buttons } = machine;
  const numButtons = buttons.length;

  const matrix: number[][] = Array.from({ length: lightsCount }, (_, i) => [
    ...buttons.map((btn) => btn[i]),
    target[i],
  ]);

  const pivotCols: number[] = [];
  let row = 0;

  for (let col = 0; col < numButtons && row < lightsCount; col++) {
    const pivotRow = matrix.slice(row).findIndex((r) => r[col] === 1);
    if (pivotRow === -1) continue;

    [matrix[row], matrix[row + pivotRow]] = [matrix[row + pivotRow], matrix[row]];
    pivotCols.push(col);

    for (let i = 0; i < lightsCount; i++) {
      if (i !== row && matrix[i][col] === 1) {
        for (let j = 0; j <= numButtons; j++) {
          matrix[i][j] ^= matrix[row][j];
        }
      }
    }
    row++;
  }

  if (matrix.slice(row).some((r) => r[numButtons] === 1)) return Infinity;

  const freeVars = Array.from({ length: numButtons }, (_, i) => i).filter(
    (col) => !pivotCols.includes(col)
  );

  let minPresses = Infinity;

  for (let mask = 0; mask < 1 << freeVars.length; mask++) {
    const solution = new Array(numButtons).fill(0);
    freeVars.forEach((col, i) => (solution[col] = (mask >> i) & 1));

    for (let i = pivotCols.length - 1; i >= 0; i--) {
      const col = pivotCols[i];
      let val = matrix[i][numButtons];
      for (let j = col + 1; j < numButtons; j++) {
        val ^= matrix[i][j] * solution[j];
      }
      solution[col] = val;
    }

    minPresses = Math.min(minPresses, solution.reduce((sum, x) => sum + x, 0));
  }

  return minPresses;
}

function solve() {
  const rawContent = readFileSync(resolve(process.cwd(), "input_day10.txt"), "utf8");
  const machines = rawContent.trim().split(/\r?\n/).map(parseLine);

  const totalPresses = machines.reduce((sum, machine, i) => {
    const presses = minButtonPresses(machine);
    console.log(`Machine ${i + 1}: ${presses} presses`);
    return sum + presses;
  }, 0);

  console.log(`Total: ${totalPresses}`);
}

solve();