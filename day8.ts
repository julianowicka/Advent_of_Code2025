import { readFileSync } from "fs";
import { resolve } from "path";

interface Point3D {
  id: number;
  x: number;
  y: number;
  z: number;
}

interface PointPair {
  p1_id: number;
  p2_id: number;
  distance: number;
}

class DSU {
  private parent: number[];
  private circuitSize: number[];

  constructor(count: number) {
    this.parent = Array.from({ length: count }, (_, i) => i);
    this.circuitSize = Array(count).fill(1);
  }

  public find(i: number): number {
    if (this.parent[i] === i) {
      return i;
    }
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }


  public union(i: number, j: number): void {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI === rootJ) {
      return;
    }

    if (this.circuitSize[rootI] < this.circuitSize[rootJ]) {
      this.parent[rootI] = rootJ;
      this.circuitSize[rootJ] += this.circuitSize[rootI];
    } else {
      this.parent[rootJ] = rootI;
      this.circuitSize[rootI] += this.circuitSize[rootJ];
    }
  }


  public getCircuitSizes(): number[] {
    const sizes: number[] = [];
    for (let i = 0; i < this.parent.length; i++) {
      // If an element is its own parent, it's the root of a circuit.
      if (this.parent[i] === i) {
        sizes.push(this.circuitSize[i]);
      }
    }
    return sizes;
  }
}

function calculateSquaredDistance(p1: Point3D, p2: Point3D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = p1.z - p2.z;
  return dx * dx + dy * dy + dz * dz;
}

function solve() {
  console.log("--- Day 8: Playground Solver ---");

  let rawContent: string;
  const inputFileName = "input_day8.txt";
  try {
    const filePath = resolve(process.cwd(), inputFileName);
    rawContent = readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`Error reading file "${inputFileName}": ${error.message}`);
    return;
  }

  const junctionBoxes: Point3D[] = rawContent
    .trim()
    .split(/\r?\n/)
    .map((line, index) => {
      const [x, y, z] = line.split(",").map(Number);
      return { id: index, x, y, z };
    });

  console.log(`Parsed ${junctionBoxes.length} junction boxes.`);

  const allPairs: PointPair[] = [];
  for (let i = 0; i < junctionBoxes.length; i++) {
    for (let j = i + 1; j < junctionBoxes.length; j++) {
      allPairs.push({
        p1_id: junctionBoxes[i].id,
        p2_id: junctionBoxes[j].id,
        distance: calculateSquaredDistance(junctionBoxes[i], junctionBoxes[j]),
      });
    }
  }
  console.log(`Calculated distances for ${allPairs.length} unique pairs.`);

  allPairs.sort((a, b) => a.distance - b.distance);
  console.log("Sorted all pairs by distance.");

  const connectionsToMake = 1000;
  const dsu = new DSU(junctionBoxes.length);

  for (let i = 0; i < connectionsToMake; i++) {
    const pair = allPairs[i];
    dsu.union(pair.p1_id, pair.p2_id);
  }
  console.log(`Made the ${connectionsToMake} shortest connections.`);

  const circuitSizes = dsu.getCircuitSizes();
  
  circuitSizes.sort((a, b) => b - a);

  console.log(`Found ${circuitSizes.length} final circuits.`);
  console.log(`The largest circuit sizes are: ${circuitSizes.slice(0, 5).join(', ')}...`);

  if (circuitSizes.length < 3) {
    console.error("Error: Less than 3 circuits found. Cannot calculate the result.");
    return;
  }

  const largestThree = circuitSizes.slice(0, 3);
  const result = largestThree.reduce((product, size) => product * size, 1);

  console.log(`The final answer is: ${result}`);
}

solve();