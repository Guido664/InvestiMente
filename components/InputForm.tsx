import React from 'react';
import { InvestmentParams } from '../types';
import { Settings, DollarSign, Calendar, TrendingUp, PiggyBank, ReceiptEuro, ArrowDownUp } from 'lucide-react';

interface InputFormProps {
  params: InvestmentParams;
  onChange: (params: InvestmentParams) => void;
}

const InputForm: React.FC<InputFormProps> = ({ params, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    onChange({
      ...params,
      [name]: type === 'checkbox' ? checked : (value === '' ? 0 : parseFloat(value)),
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

        <div className="h-px bg-slate-100 my-6"></div>

        {/* Real Factors Header */}
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <ArrowDownUp size={18} />
          <h3 className="text-md font-bold">Fattori Economici</h3>
        </div>

        {/* Inflation */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <span>Inflazione Stimata (%)</span>
          </label>
          <input
            type="number"
            name="inflationRate"
            value={params.inflationRate || ''}
            onChange={handleChange}
            step="0.1"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none font-mono text-lg"
            placeholder="0"
          />
          <p className="text-xs text-slate-400 mt-1">Riduce il potere d'acquisto reale.</p>
        </div>

        {/* Tax Section */}
        <div className="group bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2 cursor-pointer">
              <ReceiptEuro size={16} className="text-slate-500" />
              Applica Tassazione
            </label>
            <input
              type="checkbox"
              name="applyTax"
              checked={params.applyTax}
              onChange={handleChange}
              className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300"
            />
          </div>
          
          {params.applyTax && (
            <div className="mt-4 pt-3 border-t border-slate-200 animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Aliquota Fiscale (%)</label>
              <input
                type="number"
                name="taxRate"
                value={params.taxRate || ''}
                onChange={handleChange}
                step="0.1"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-brand-500 outline-none font-mono"
                placeholder="26"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputForm;