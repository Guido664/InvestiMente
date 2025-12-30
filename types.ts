export interface InvestmentParams {
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  initialCapital: number;
}

export interface YearlyData {
  year: number;
  totalInvested: number;
  interestEarned: number;
  totalBalance: number;
}

export interface SimulationResult {
  data: YearlyData[];
  finalBalance: number;
  totalInvested: number;
  totalInterest: number;
}

export enum CalculationStatus {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  COMPLETE = 'COMPLETE'
}