import React, { useState, useEffect, useMemo } from 'react';
import InputForm from './components/InputForm';
import ResultsChart from './components/ResultsChart';
import SummaryCards from './components/SummaryCards';
import AIAdvisor from './components/AIAdvisor';
import { InvestmentParams } from './types';
import { calculateCompoundInterest } from './utils/calculations';
import { TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<InvestmentParams>({
    monthlyContribution: 100,
    annualInterestRate: 7, // Average stock market return
    years: 10,
    initialCapital: 0
  });

  // Calculate results whenever params change
  const result = useMemo(() => {
    return calculateCompoundInterest(params);
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-600 rounded-xl text-white shadow-lg shadow-brand-200">
              <TrendingUp size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">InvestiMente</h1>
              <p className="text-slate-500 text-sm">Pianifica il tuo futuro finanziario</p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 h-full">
            <InputForm params={params} onChange={setParams} />
          </div>

          {/* Right Column: Visualization & AI */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <SummaryCards result={result} />
            <ResultsChart result={result} />
            <AIAdvisor params={params} result={result} />
          </div>
        </main>

        <footer className="mt-12 text-center text-slate-400 text-sm py-4 border-t border-slate-200/60">
          <p>© {new Date().getFullYear()} InvestiMente. I rendimenti passati non sono garanzia di quelli futuri.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;