export interface InvestmentParams {
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  initialCapital: number;
  inflationRate: number;
  applyTax: boolean;
  taxRate: number;
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
  netBalance: number;
  taxAmount: number;
  purchasingPower: number;
  fireMonthlyIncome: number;
}

export enum CalculationStatus {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  COMPLETE = 'COMPLETE'
}