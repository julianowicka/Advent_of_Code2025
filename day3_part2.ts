import { readFileSync } from "fs";

function findMaxJoltageForBank(bank: string): number {
  const TARGET_LENGTH = 12;
  const n = bank.length;
  
  if (n < TARGET_LENGTH) return 0;

  let result = "";
  let lastIndex = -1;

  for (let i = 0; i < TARGET_LENGTH; i++) {
    const remainingNeeded = TARGET_LENGTH - 1 - i;
    
    const searchStart = lastIndex + 1;
    const searchEnd = n - 1 - remainingNeeded;

    let maxDigit = -1;
    let maxDigitIndex = -1;

    for (let j = searchStart; j <= searchEnd; j++) {
      const digit = parseInt(bank[j], 10);
      if (digit > maxDigit) {
        maxDigit = digit;
        maxDigitIndex = j;
        
        if (digit === 9) break; 
      }
    }

    result += maxDigit.toString();
    lastIndex = maxDigitIndex;
  }

  return parseInt(result, 10);
}

try {
  const rawContent = readFileSync("input_day3.txt", "utf8");

  const batteryBanks = rawContent
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim() !== "");

  const totalJoltage = batteryBanks
    .map(bank => {
      const maxForBank = findMaxJoltageForBank(bank);
      return maxForBank;
    })
    .reduce((sum, current) => sum + current, 0);

  console.log(`Total : ${totalJoltage}`);

} catch (error) {
  console.error("Error reading file or processing data:", error);
}