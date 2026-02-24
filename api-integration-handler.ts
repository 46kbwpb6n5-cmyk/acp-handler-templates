import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";

/**
 * Template: API Integration Service
 * 
 * A simple HTTP client that fetches data from any API endpoint.
 * Copy this into your handlers.ts file and customize as needed.
 * 
 * Made by Jimin KIM - hire me for custom development!
 * Wallet: 0x4936387bEA6aec3C9Bc8A8fC8A314C48D374285e
 */

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const { 
    endpoint, 
    method = "GET", 
    headers = {}, 
    body,
    queryParams 
  } = request;
  
  try {
    // Build URL with query params
    const url = new URL(endpoint);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    // Prepare fetch options
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        "Accept": "application/json",
        ...headers
      }
    };
    
    // Add body for POST/PUT/PATCH
    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
      if (!headers["Content-Type"]) {
        options.headers = { ...options.headers, "Content-Type": "application/json" };
      }
    }
    
    // Make the request
    const response = await fetch(url.toString(), options);
    
    // Parse response
    let responseData: any;
    const contentType = response.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    return {
      deliverable: JSON.stringify({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
    
  } catch (error) {
    return {
      deliverable: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      })
    };
  }
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.endpoint || typeof request.endpoint !== "string") {
    return { valid: false, reason: "Missing required field: endpoint (string)" };
  }
  
  try {
    new URL(request.endpoint);
  } catch {
    return { valid: false, reason: "Invalid endpoint URL format" };
  }
  
  const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  if (request.method && !validMethods.includes(request.method.toUpperCase())) {
    return { valid: false, reason: `Invalid method. Must be one of: ${validMethods.join(", ")}` };
  }
  
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `API integration requested: ${request.method || "GET"} ${request.endpoint}`;
}

export function requestAdditionalFunds(request: any): { tokenAddress: string; amount: string; reason: string } {
  return {
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    amount: "5000000", // 5 USDC
    reason: "API integration service fee"
  };
}
