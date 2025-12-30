import { InvestmentParams, SimulationResult, YearlyData } from '../types';

export const calculateCompoundInterest = (params: InvestmentParams): SimulationResult => {
  const { monthlyContribution, annualInterestRate, years, initialCapital, inflationRate, applyTax, taxRate } = params;
  
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

  const finalBalance = parseFloat(currentBalance.toFixed(2));
  const totalInvestedFixed = parseFloat(totalInvested.toFixed(2));
  const totalInterest = parseFloat((currentBalance - totalInvested).toFixed(2));

  // Calculate Tax (Variable rate on Capital Gains)
  const appliedTaxRate = (taxRate !== undefined ? taxRate : 26) / 100;
  const taxAmount = applyTax && totalInterest > 0 ? parseFloat((totalInterest * appliedTaxRate).toFixed(2)) : 0;
  const netBalance = parseFloat((finalBalance - taxAmount).toFixed(2));

  // Calculate Purchasing Power (Real Value adjusting for inflation)
  const inflationDecimal = (inflationRate || 0) / 100;
  const purchasingPower = parseFloat((netBalance / Math.pow(1 + inflationDecimal, years)).toFixed(2));

  // Calculate FIRE Monthly Income (4% Rule on Net Balance)
  // Annual withdrawal = 4% of capital. Monthly = Annual / 12.
  const fireMonthlyIncome = parseFloat(((netBalance * 0.04) / 12).toFixed(2));

  return {
    data,
    finalBalance,
    totalInvested: totalInvestedFixed,
    totalInterest,
    netBalance,
    taxAmount,
    purchasingPower,
    fireMonthlyIncome
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};