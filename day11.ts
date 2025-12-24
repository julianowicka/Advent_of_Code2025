import { readFileSync } from "fs";
import { resolve } from "path";

type Graph = Map<string, string[]>;

function parseInput(lines: string[]): Graph {
  const graph: Graph = new Map();

  for (const line of lines) {
    const [from, rest] = line.split(":");
    const targets = rest.trim().split(/\s+/);
    graph.set(from.trim(), targets);
  }

  return graph;
}

function solve() {
  console.log("--- Day 11: Reactor ---");

  let rawContent: string;
  const inputFileName = process.argv[2] || "input_day11.txt";

  try {
    const filePath = resolve(process.cwd(), inputFileName);
    rawContent = readFileSync(filePath, "utf8");
  } catch (error: any) {
    console.error(`Error reading file "${inputFileName}": ${error.message}`);
    return;
  }

  const lines = rawContent.trim().split(/\r?\n/);
  const graph = parseInput(lines);

  function countPaths(node: string, visited: Set<string> = new Set()): number {
    if (node === "out") {
      return 1;
    }

    if (visited.has(node)) {
      return 0;
    }

    const newVisited = new Set(visited);
    newVisited.add(node);

    const neighbors = graph.get(node) ?? [];
    let total = 0;

    for (const next of neighbors) {
      total += countPaths(next, newVisited);
    }

    return total;
  }

  const result = countPaths("you");

  console.log(`Number of distinct paths ${result}`);
}

solve();