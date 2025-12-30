import React from 'react';
import { SimulationResult } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, Wallet, Coins } from 'lucide-react';

interface SummaryCardsProps {
  result: SimulationResult;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 rounded-2xl text-white shadow-lg shadow-brand-200">
        <div className="flex items-center gap-3 mb-2 opacity-90">
          <Wallet className="w-5 h-5" />
          <span className="text-sm font-medium">Capitale Finale</span>
        </div>
        <div className="text-3xl font-bold tracking-tight">
          {formatCurrency(result.finalBalance)}
        </div>
        <div className="text-brand-100 text-xs mt-1">
           Totale accumulato
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-2 text-slate-500">
          <Coins className="w-5 h-5" />
          <span className="text-sm font-medium">Totale Versato</span>
        </div>
        <div className="text-2xl font-bold text-slate-800">
          {formatCurrency(result.totalInvested)}
        </div>
        <div className="text-slate-400 text-xs mt-1">
          I tuoi risparmi
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-2 text-emerald-600">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">Interessi Generati</span>
        </div>
        <div className="text-2xl font-bold text-emerald-600">
          +{formatCurrency(result.totalInterest)}
        </div>
        <div className="text-emerald-800/60 text-xs mt-1">
          Guadagno netto
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;