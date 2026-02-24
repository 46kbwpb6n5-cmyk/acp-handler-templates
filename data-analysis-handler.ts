import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";

/**
 * Template: Data Analysis Service
 * 
 * Analyzes arrays of numbers and returns statistics.
 * Copy this into your handlers.ts file and customize as needed.
 * 
 * Made by Jimin KIM - hire me for custom development!
 * Wallet: 0x4936387bEA6aec3C9Bc8A8fC8A314C48D374285e
 */

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const { data, analysisType = "full" } = request;
  
  if (!Array.isArray(data) || data.length === 0) {
    return {
      deliverable: JSON.stringify({
        error: "Invalid or empty data array",
        timestamp: new Date().toISOString()
      })
    };
  }
  
  // Filter to numeric values only
  const numbers = data.filter((n: any) => typeof n === "number" && !isNaN(n));
  
  if (numbers.length === 0) {
    return {
      deliverable: JSON.stringify({
        error: "No numeric values found in data",
        timestamp: new Date().toISOString()
      })
    };
  }
  
  // Calculate statistics
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = sum / numbers.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  // Median
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
  
  // Standard deviation
  const variance = numbers.reduce((acc, n) => acc + Math.pow(n - avg, 2), 0) / numbers.length;
  const stdDev = Math.sqrt(variance);
  
  const result: any = {
    count: numbers.length,
    sum: Number(sum.toFixed(4)),
    average: Number(avg.toFixed(4)),
    min: Number(min.toFixed(4)),
    max: Number(max.toFixed(4)),
    median: Number(median.toFixed(4)),
    stdDev: Number(stdDev.toFixed(4)),
    timestamp: new Date().toISOString()
  };
  
  // Add percentiles if full analysis requested
  if (analysisType === "full") {
    result.percentiles = {
      p25: Number(sorted[Math.floor(sorted.length * 0.25)].toFixed(4)),
      p75: Number(sorted[Math.floor(sorted.length * 0.75)].toFixed(4)),
      p90: Number(sorted[Math.floor(sorted.length * 0.9)].toFixed(4))
    };
  }
  
  return {
    deliverable: JSON.stringify(result, null, 2)
  };
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.data || !Array.isArray(request.data)) {
    return { valid: false, reason: "Missing required field: data (array)" };
  }
  
  if (request.data.length === 0) {
    return { valid: false, reason: "Data array cannot be empty" };
  }
  
  if (request.data.length > 10000) {
    return { valid: false, reason: "Data array too large (max 10,000 items)" };
  }
  
  const validTypes = ["basic", "full"];
  if (request.analysisType && !validTypes.includes(request.analysisType)) {
    return { valid: false, reason: `Invalid analysisType. Must be one of: ${validTypes.join(", ")}` };
  }
  
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Data analysis requested for ${request.data.length} data points`;
}

export function requestAdditionalFunds(request: any): { tokenAddress: string; amount: string; reason: string } {
  return {
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    amount: "3000000", // 3 USDC
    reason: "Data analysis service fee"
  };
}
