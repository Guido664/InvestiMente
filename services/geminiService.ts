import { InvestmentParams, SimulationResult } from "../types";

// AI Service is disabled.
// This file is kept to prevent broken import references in other parts of the codebase,
// but the functionality is now a stub.

export const hasApiKey = (): boolean => false;

export const getFinancialAdvice = async (
  params: InvestmentParams, 
  result: SimulationResult
): Promise<string> => {
  return "AI functionality has been disabled.";
};