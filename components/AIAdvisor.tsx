import React, { useState } from 'react';
import { InvestmentParams, SimulationResult } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  params: InvestmentParams;
  result: SimulationResult;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ params, result }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    const text = await getFinancialAdvice(params, result);
    setAdvice(text);
    setLoading(false);
  };

  // Reset advice if key params change significantly to avoid stale data (Optional check, simplistic here)
  React.useEffect(() => {
     if(advice) {
        // Simple UX decision: keep advice until requested again, or we could clear it. 
        // Let's keep it but show a visual cue if we wanted to be fancy.
        // For now, no action.
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.years, params.monthlyContribution, params.annualInterestRate]);

  return (
    <div className="mt-6 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 rounded-2xl border border-violet-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-violet-700">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold text-lg">AI Financial Advisor</h3>
        </div>
        {!advice && !loading && (
          <button
            onClick={handleGetAdvice}
            className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center gap-2"
          >
            <Sparkles size={16} />
            Analizza Strategia
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 text-violet-600 animate-pulse gap-2">
          <Loader2 className="animate-spin w-5 h-5" />
          <span className="font-medium">Gemini sta analizzando il tuo piano...</span>
        </div>
      )}

      {advice && !loading && (
        <div className="prose prose-sm prose-violet max-w-none">
          <ReactMarkdown>{advice}</ReactMarkdown>
          <div className="mt-4 flex justify-end">
            <button 
                onClick={handleGetAdvice}
                className="text-xs text-violet-500 hover:text-violet-700 underline"
            >
                Aggiorna Analisi
            </button>
          </div>
        </div>
      )}
      
      {!advice && !loading && (
        <p className="text-sm text-slate-500">
          Richiedi un'analisi basata sull'intelligenza artificiale per capire se i tuoi obiettivi sono realistici e quali rischi considerare.
        </p>
      )}

      {!process.env.API_KEY && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg flex items-center gap-2 border border-yellow-100">
          <AlertCircle size={14} />
          <span>Configura una API KEY nel file .env o nelle impostazioni di Vercel per abilitare l'AI.</span>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;