import React from 'react';
import { SimulationResult, InvestmentParams } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, Wallet, Coins, ShoppingBag, Flame, AlertCircle } from 'lucide-react';

interface SummaryCardsProps {
  result: SimulationResult;
  params: InvestmentParams;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ result, params }) => {
  // Calcolo del guadagno nominale (netto se tassato, lordo altrimenti)
  const nominalGain = params.applyTax 
    ? (result.totalInterest - result.taxAmount) 
    : result.totalInterest;

  // ROI Nominale
  const nominalRoi = result.totalInvested > 0 
    ? (nominalGain / result.totalInvested) * 100 
    : 0;

  // Calcolo del guadagno reale (basato sul potere d'acquisto)
  const realGain = result.purchasingPower - result.totalInvested;
  
  // ROI Reale
  const realRoi = result.totalInvested > 0 
    ? (realGain / result.totalInvested) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Capitale Finale / Netto */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 rounded-2xl text-white shadow-lg shadow-brand-200 flex flex-col justify-between md:col-span-2 lg:col-span-1">
        <div>
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium">Capitale {params.applyTax ? 'Netto' : 'Finale'}</span>
          </div>
          <div className="text-3xl font-bold tracking-tight">
            {formatCurrency(params.applyTax ? result.netBalance : result.finalBalance)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-brand-100 text-xs">
              {params.applyTax ? `Dopo le tasse (${params.taxRate}%)` : 'Totale accumulato'}
            </span>
            {nominalRoi > 0 && (
              <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-bold backdrop-blur-sm">
                +{nominalRoi.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        
        {/* Purchasing Power Display */}
        {params.inflationRate > 0 && (
          <div className="mt-4 pt-3 border-t border-white/20">
             <div className="flex items-center justify-between mb-1 opacity-90">
               <div className="flex items-center gap-2">
                 <ShoppingBag className="w-4 h-4" />
                 <span className="text-xs font-medium">Potere d'acquisto reale</span>
               </div>
               {/* Real ROI Badge */}
               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm ${realRoi >= 0 ? 'bg-emerald-500/30 text-emerald-50' : 'bg-red-500/30 text-red-50'}`}>
                 ROI Reale: {realRoi > 0 ? '+' : ''}{realRoi.toFixed(1)}%
               </span>
            </div>
            <div className="text-xl font-bold">
              {formatCurrency(result.purchasingPower)}
            </div>
            <div className="text-brand-100 text-[10px]">
              Svalutato dall'inflazione ({params.inflationRate}%)
            </div>
          </div>
        )}
      </div>

      {/* Totale Versato */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
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

      {/* Interessi */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2 text-emerald-600">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">Interessi {params.applyTax ? 'Netto Tasse' : 'Generati'}</span>
        </div>
        <div className="text-2xl font-bold text-emerald-600">
          +{formatCurrency(nominalGain)}
        </div>
        
        <div className="space-y-1 mt-1">
          <div className="text-emerald-800/60 text-xs">
            {params.applyTax 
              ? `Tasse: ${formatCurrency(result.taxAmount)}` 
              : 'Guadagno lordo nominale'}
          </div>

          {/* Real Gain Indication if Inflation > 0 */}
          {params.inflationRate > 0 && (
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <div className="text-xs text-slate-500">
                Reale: <span className={`font-medium ${realGain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {realGain > 0 ? '+' : ''}{formatCurrency(realGain)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FIRE Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2 opacity-90">
          <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
          <span className="text-sm font-medium">Rendita FIRE</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {formatCurrency(result.fireMonthlyIncome)}
          <span className="text-base font-normal opacity-80">/mese</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-indigo-200 text-xs">
            Regola del 4% ({params.inflationRate > 0 ? 'reale' : 'nominale'})
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;