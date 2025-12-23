import { readFileSync } from "fs";
import { resolve } from "path";

interface Point2D {
  id: number;
  x: number;
  y: number;
}

function rectangleArea(p1: Point2D, p2: Point2D): number {
  const width = Math.abs(p1.x - p2.x) + 1;
  const height = Math.abs(p1.y - p2.y) + 1;
  return width * height;
}

function solve() {

  let rawContent: string;
  const inputFileName = "input_day9.txt";

  try {
    const filePath = resolve(process.cwd(), inputFileName);
    rawContent = readFileSync(filePath, "utf8");
  } catch (error: any) {
    console.error(`Error reading file "${inputFileName}": ${error.message}`);
    return;
  }

  const redTiles: Point2D[] = rawContent
    .trim()
    .split(/\r?\n/)
    .map((line, index) => {
      const [x, y] = line.split(",").map(Number);
      return { id: index, x, y };
    });

  console.log(`Parsed ${redTiles.length} red tiles.`);

  let maxArea = 0;
  let bestPair: [Point2D, Point2D] | null = null;

  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const p1 = redTiles[i];
      const p2 = redTiles[j];

      const area = rectangleArea(p1, p2);

      if (area > maxArea) {
        maxArea = area;
        bestPair = [p1, p2];
      }
    }
  }

  if (!bestPair) {
    console.error("No rectangle found.");
    return;
  }

  console.log(`The largest possible rectangle area is: ${maxArea}`);
}

solve();
