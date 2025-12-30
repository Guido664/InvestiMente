import { InvestmentParams, SimulationResult, YearlyData } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export const generatePDF = (params: InvestmentParams, result: SimulationResult) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(14, 165, 233); // Brand color (Sky 500)
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('InvestiMente', 14, 20);
  
  doc.setFontSize(12);
  doc.text('Report Piano di Accumulo', 14, 30);
  doc.text(`Data: ${new Date().toLocaleDateString('it-IT')}`, 160, 30);

  // Parameters Section
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.text('Parametri Input', 14, 55);

  const paramData = [
    ['Capitale Iniziale', formatCurrency(params.initialCapital)],
    ['Rata Mensile', formatCurrency(params.monthlyContribution)],
    ['Rendimento Annuo', `${params.annualInterestRate}%`],
    ['Durata', `${params.years} anni`],
    ['Inflazione Stimata', `${params.inflationRate}%`],
    ['Tassazione', params.applyTax ? `Sì (${params.taxRate}%)` : 'No']
  ];

  autoTable(doc, {
    startY: 60,
    head: [],
    body: paramData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', width: 60 } },
  });

  // Results Section
  const resultStartY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Risultati Proiezione', 14, resultStartY);

  const resultData = [
    ['Capitale Totale', formatCurrency(result.finalBalance)],
    ['Totale Versato', formatCurrency(result.totalInvested)],
    ['Interessi Maturati', formatCurrency(result.totalInterest)],
    ['Tasse Stimate', formatCurrency(result.taxAmount)],
    ['Capitale Netto', formatCurrency(result.netBalance)],
    ['Potere d\'Acquisto Reale', formatCurrency(result.purchasingPower)],
    ['Rendita Mensile (FIRE)', formatCurrency(result.fireMonthlyIncome)]
  ];

  autoTable(doc, {
    startY: resultStartY + 5,
    head: [],
    body: resultData,
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', width: 80 } },
  });

  // Yearly Data Table
  const tableStartY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('Dettaglio Annuale', 14, tableStartY);

  const tableRows = result.data.map(row => [
    `Anno ${row.year}`,
    formatCurrency(row.totalInvested),
    formatCurrency(row.interestEarned),
    formatCurrency(row.totalBalance)
  ]);

  autoTable(doc, {
    startY: tableStartY + 5,
    head: [['Anno', 'Versato', 'Interessi', 'Saldo Totale']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 9, cellPadding: 2 },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Generato con InvestiMente - I risultati sono stime basate sui parametri inseriti.', 105, 290, { align: 'center' });
  }

  doc.save('investimente-report.pdf');
};