import { readFileSync } from "fs";

function findMaxJoltageForBank(bank: string): number {
  let maxJoltage = 0;
  const n = bank.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const currentJoltage = parseInt(bank[i] + bank[j], 10);
      if (currentJoltage > maxJoltage) {
        maxJoltage = currentJoltage;
      }
    }
  }
  return maxJoltage;
}

const rawContent = readFileSync("input_day3.txt", "utf8");

const batteryBanks = rawContent
  .trim()
  .split(/\r?\n/)
  .filter(line => line.trim() !== "");

const totalJoltage = batteryBanks
  .map(bank => {
    const maxForBank = findMaxJoltageForBank(bank);
    console.log(`Bank "${bank}": max joltage is ${maxForBank}`);
    return maxForBank;
  })
  .reduce((sum, current) => sum + current, 0);

console.log(`Total output : ${totalJoltage}`);