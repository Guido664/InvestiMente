import React from 'react';
import { InvestmentParams } from '../types';
import { Settings, DollarSign, Calendar, TrendingUp, PiggyBank } from 'lucide-react';

interface InputFormProps {
  params: InvestmentParams;
  onChange: (params: InvestmentParams) => void;
}

const InputForm: React.FC<InputFormProps> = ({ params, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Se il valore è vuoto, salviamo 0 nello stato, ma l'input visivamente rimarrà vuoto grazie al value check
    onChange({
      ...params,
      [name]: value === '' ? 0 : parseFloat(value),
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center gap-2 mb-6 text-brand-700">
        <Settings size={20} />
        <h2 className="text-xl font-bold">Parametri Investimento</h2>
      </div>

      <div className="space-y-6">
        {/* Initial Capital */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <PiggyBank size={16} className="text-slate-400" />
            Capitale Iniziale (€)
          </label>
          <input
            type="number"
            name="initialCapital"
            // Se è 0, mostriamo stringa vuota per permettere l'editing/cancellazione
            value={params.initialCapital || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none font-mono text-lg"
            placeholder="0"
          />
        </div>

        {/* Monthly Contribution */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <DollarSign size={16} className="text-slate-400" />
            Rata Mensile (€)
          </label>
          <input
            type="number"
            name="monthlyContribution"
            value={params.monthlyContribution || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none font-mono text-lg"
            placeholder="100"
          />
        </div>

        {/* Interest Rate */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-slate-400" />
            Rendimento Annuo (%)
          </label>
          <input
            type="number"
            name="annualInterestRate"
            value={params.annualInterestRate || ''}
            onChange={handleChange}
            step="0.1"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none font-mono text-lg"
            placeholder="7"
          />
           <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
            <span>Conservativo (3%)</span>
            <span>Bilanciato (7%)</span>
            <span>Aggressivo (12%)</span>
          </div>
        </div>

        {/* Years */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            Durata (Anni)
          </label>
          <input
            type="number"
            name="years"
            value={params.years || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none font-mono text-lg"
            placeholder="10"
          />
        </div>
      </div>
    </div>
  );
};

export default InputForm;