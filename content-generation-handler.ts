import type { ExecuteJobResult, ValidationResult } from "../../../runtime/offeringTypes.js";

/**
 * Template: Content Generation Service
 * 
 * Generates content based on prompts using AI.
 * Copy this into your handlers.ts file and customize as needed.
 * 
 * Made by Jimin KIM - hire me for custom development!
 * Wallet: 0x4936387bEA6aec3C9Bc8A8fC8A314C48D374285e
 */

export async function executeJob(request: any): Promise<ExecuteJobResult> {
  const { 
    topic, 
    format = "text",
    tone = "professional",
    length = "medium"
  } = request;
  
  // Length configurations
  const lengthConfig: Record<string, { min: number; max: number }> = {
    short: { min: 50, max: 150 },
    medium: { min: 150, max: 400 },
    long: { min: 400, max: 800 }
  };
  
  const config = lengthConfig[length] || lengthConfig.medium;
  
  // Generate content (placeholder - integrate with AI API for real content)
  const content = generateContent(topic, tone, format);
  
  // Adjust length
  let finalContent = content;
  if (content.length < config.min) {
    finalContent = content + "\n\n" + generateAdditionalContent(topic, tone);
  } else if (content.length > config.max) {
    finalContent = content.substring(0, config.max) + "...";
  }
  
  const result = {
    topic,
    format,
    tone,
    length,
    wordCount: finalContent.split(/\s+/).length,
    charCount: finalContent.length,
    content: finalContent,
    timestamp: new Date().toISOString(),
    note: "This is a template. Integrate with OpenAI/Kimi API for real AI-generated content."
  };
  
  return {
    deliverable: JSON.stringify(result, null, 2)
  };
}

function generateContent(topic: string, tone: string, format: string): string {
  const tonePrefixes: Record<string, string> = {
    professional: `Professional analysis of ${topic}:\n\n`,
    casual: `Here's what you need to know about ${topic}:\n\n`,
    technical: `Technical overview - ${topic}:\n\n`,
    persuasive: `Why ${topic} matters:\n\n`
  };
  
  const formatSuffixes: Record<string, string> = {
    text: `\n\nKey insights about ${topic} include its impact on the industry, potential growth opportunities, and strategic considerations for stakeholders.`,
    markdown: `\n\n## Key Points\n\n- Impact on industry\n- Growth opportunities\n- Strategic considerations`,
    json: ``
  };
  
  return (tonePrefixes[tone] || tonePrefixes.professional) + 
         `This content covers ${topic} comprehensively, examining various aspects and implications.` +
         (formatSuffixes[format] || formatSuffixes.text);
}

function generateAdditionalContent(topic: string, tone: string): string {
  const additions: Record<string, string> = {
    professional: `\n\nAdditional considerations for ${topic} include market dynamics, competitive landscape, and future projections.`,
    casual: `\n\nOh, and one more thing about ${topic} - it's actually pretty interesting when you dig deeper!`,
    technical: `\n\nTechnical specifications and implementation details for ${topic} vary based on specific use cases and requirements.`,
    persuasive: `\n\nDon't miss out on ${topic} - the opportunity window is now!`
  };
  
  return additions[tone] || additions.professional;
}

export function validateRequirements(request: any): ValidationResult {
  if (!request.topic || typeof request.topic !== "string") {
    return { valid: false, reason: "Missing required field: topic (string)" };
  }
  
  if (request.topic.length < 3) {
    return { valid: false, reason: "Topic must be at least 3 characters" };
  }
  
  const validFormats = ["text", "markdown", "json"];
  if (request.format && !validFormats.includes(request.format)) {
    return { valid: false, reason: `Invalid format. Must be one of: ${validFormats.join(", ")}` };
  }
  
  const validTones = ["professional", "casual", "technical", "persuasive"];
  if (request.tone && !validTones.includes(request.tone)) {
    return { valid: false, reason: `Invalid tone. Must be one of: ${validTones.join(", ")}` };
  }
  
  const validLengths = ["short", "medium", "long"];
  if (request.length && !validLengths.includes(request.length)) {
    return { valid: false, reason: `Invalid length. Must be one of: ${validLengths.join(", ")}` };
  }
  
  return { valid: true };
}

export function requestPayment(request: any): string {
  return `Content generation requested: "${request.topic}" (${request.length || "medium"})`;
}

export function requestAdditionalFunds(request: any): { tokenAddress: string; amount: string; reason: string } {
  return {
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    amount: "4000000", // 4 USDC
    reason: `Content generation service fee for "${request.topic}"`
  };
}
