import { InvestmentParams, SimulationResult, YearlyData } from '../types';

export const calculateCompoundInterest = (params: InvestmentParams): SimulationResult => {
  const { monthlyContribution, annualInterestRate, years, initialCapital } = params;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  const totalMonths = years * 12;
  
  let currentBalance = initialCapital;
  let totalInvested = initialCapital;
  const data: YearlyData[] = [];

  // Add Year 0 (Starting point)
  data.push({
    year: 0,
    totalInvested: initialCapital,
    interestEarned: 0,
    totalBalance: initialCapital,
  });

  for (let month = 1; month <= totalMonths; month++) {
    // Add monthly contribution
    currentBalance += monthlyContribution;
    totalInvested += monthlyContribution;
    
    // Apply interest
    const interest = currentBalance * monthlyRate;
    currentBalance += interest;

    // Record data at the end of each year
    if (month % 12 === 0) {
      data.push({
        year: month / 12,
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        interestEarned: parseFloat((currentBalance - totalInvested).toFixed(2)),
        totalBalance: parseFloat(currentBalance.toFixed(2)),
      });
    }
  }

  return {
    data,
    finalBalance: parseFloat(currentBalance.toFixed(2)),
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    totalInterest: parseFloat((currentBalance - totalInvested).toFixed(2)),
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};