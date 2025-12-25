import { readFileSync } from "fs";
import { resolve } from "path";

type Cell = [number, number];
type Shape = Cell[];
type Board = boolean[][];

function parseInput(filename: string) {
  const raw = readFileSync(resolve(process.cwd(), filename), "utf8");
  const lines = raw.trim().split(/\r?\n/);
  
  let splitIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^\d+x\d+:/.test(lines[i])) {
      splitIndex = i;
      break;
    }
  }

  const shapeLines = lines.slice(0, splitIndex);
  const regionLines = lines.slice(splitIndex);

  const shapes: Shape[] = [];
  let currentShape: Cell[] = [];
  
  for (const line of shapeLines) {
    if (/^\d+:/.test(line)) {
      if (currentShape.length > 0) {
        shapes.push(currentShape);
        currentShape = [];
      }
    } else if (line.trim().length > 0) {
      const y = currentShape.length > 0 
        ? Math.max(...currentShape.map(c => c[1])) + 1 
        : 0;
      [...line].forEach((c, x) => {
        if (c === "#") currentShape.push([x, y]);
      });
    }
  }
  if (currentShape.length > 0) {
    shapes.push(currentShape);
  }

  const regions: { w: number; h: number; counts: number[] }[] = [];
  for (const line of regionLines) {
    const [size, rest] = line.split(":");
    const [w, h] = size.split("x").map(Number);
    const counts = rest.trim().split(/\s+/).map(Number);
    regions.push({ w, h, counts });
  }

  return { shapes, regions };
}

function normalize(shape: Shape): Shape {
  if (shape.length === 0) return shape;
  const minX = Math.min(...shape.map(p => p[0]));
  const minY = Math.min(...shape.map(p => p[1]));
  return shape.map(([x, y]) => [x - minX, y - minY] as Cell);
}

function rotate90(shape: Shape): Shape {
  return normalize(shape.map(([x, y]) => [-y, x] as Cell));
}

function flipH(shape: Shape): Shape {
  return normalize(shape.map(([x, y]) => [-x, y] as Cell));
}

function shapeKey(shape: Shape): string {
  const sorted = [...shape].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return sorted.map(p => `${p[0]},${p[1]}`).join(";");
}

function getAllOrientations(shape: Shape): Shape[] {
  const seen = new Set<string>();
  const result: Shape[] = [];
  
  let current = normalize(shape);
  for (let r = 0; r < 4; r++) {
    for (const s of [current, flipH(current)]) {
      const key = shapeKey(s);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(s);
      }
    }
    current = rotate90(current);
  }
  
  return result;
}

function canPlace(board: Board, shape: Shape, x: number, y: number): boolean {
  for (const [dx, dy] of shape) {
    const nx = x + dx;
    const ny = y + dy;
    if (ny < 0 || ny >= board.length || nx < 0 || nx >= board[0].length || board[ny][nx]) {
      return false;
    }
  }
  return true;
}

function place(board: Board, shape: Shape, x: number, y: number, val: boolean) {
  for (const [dx, dy] of shape) {
    board[y + dy][x + dx] = val;
  }
}

let callCount = 0;
const MAX_CALLS = 500000;

function solve(
  board: Board,
  allShapes: Shape[][],
  remaining: number[]
): boolean {
  callCount++;
  if (callCount > MAX_CALLS) return false;
  
  if (remaining.every(c => c === 0)) {
    return true;
  }

  let y = -1, x = -1;
  outer: for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (!board[i][j]) {
        y = i;
        x = j;
        break outer;
      }
    }
  }

  if (y === -1) return false;

  for (let shapeIdx = 0; shapeIdx < allShapes.length; shapeIdx++) {
    if (remaining[shapeIdx] === 0) continue;

    for (const variant of allShapes[shapeIdx]) {
      if (canPlace(board, variant, x, y)) {
        place(board, variant, x, y, true);
        remaining[shapeIdx]--;
        
        if (solve(board, allShapes, remaining)) {
          return true;
        }
        
        remaining[shapeIdx]++;
        place(board, variant, x, y, false);
      }
    }
  }

  board[y][x] = true;
  const result = solve(board, allShapes, remaining);
  board[y][x] = false;
  
  return result;
}

function main() {

  const inputFile = process.argv[2] || "input_day12.txt";
  const { shapes, regions } = parseInput(inputFile);

  const allOrientations = shapes.map(s => getAllOrientations(s));


  let validCount = 0;
  let processed = 0;

  for (const region of regions) {
    processed++;
    
    const board: Board = Array.from({ length: region.h }, () =>
      Array(region.w).fill(false)
    );

    callCount = 0;
    if (solve(board, allOrientations, [...region.counts])) {
      validCount++;
    }

    if (processed % 50 === 0 || processed === regions.length) {
      console.log(`Processed ${processed}/${regions.length} regions, valid: ${validCount}`);
    }
  }

  console.log(`\n✅ Regions that can fit all presents: ${validCount}`);
}

main();
