import React, { useState } from 'react';
import { InvestmentParams, SimulationResult } from '../types';
import { getFinancialAdvice, hasApiKey } from '../services/geminiService';
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

  // Check if API key is present safely
  const apiKeyPresent = hasApiKey();

  // Reset advice if key params change significantly
  React.useEffect(() => {
     // Optional: reset advice when inputs change
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
            className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!apiKeyPresent}
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
      
      {!advice && !loading && apiKeyPresent && (
        <p className="text-sm text-slate-500">
          Richiedi un'analisi basata sull'intelligenza artificiale per capire se i tuoi obiettivi sono realistici e quali rischi considerare.
        </p>
      )}

      {!apiKeyPresent && (
        <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-xl flex items-start gap-3 border border-yellow-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Funzionalità AI non disponibile</p>
            <p>Per abilitare l'advisor intelligente, devi configurare la chiave API su Vercel:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-xs opacity-90">
              <li>Vai nelle <strong>Settings</strong> del tuo progetto su Vercel</li>
              <li>Seleziona <strong>Environment Variables</strong></li>
              <li>Aggiungi Key: <code>API_KEY</code> con il valore della tua Gemini API Key</li>
              <li>Effettua un nuovo deploy</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;