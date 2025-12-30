import { GoogleGenAI } from "@google/genai";
import { InvestmentParams, SimulationResult } from "../types";

// Helper function to safely get the API Key without crashing in browser environments
// where 'process' might not be defined.
const getApiKey = (): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
    return '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const hasApiKey = (): boolean => !!apiKey;

export const getFinancialAdvice = async (
  params: InvestmentParams, 
  result: SimulationResult
): Promise<string> => {
  if (!hasApiKey()) {
    return "API Key mancante. Per attivare l'intelligenza artificiale, configura la variabile d'ambiente API_KEY nelle impostazioni del tuo progetto su Vercel.";
  }

  try {
    const prompt = `
      Agisci come un consulente finanziario esperto. Analizza il seguente piano di accumulo capitale:
      
      Dati Input:
      - Capitale Iniziale: ${params.initialCapital}€
      - Rata Mensile: ${params.monthlyContribution}€
      - Rendimento Annuo Stimato: ${params.annualInterestRate}%
      - Durata: ${params.years} anni
      
      Risultati:
      - Capitale Finale: ${result.finalBalance.toFixed(2)}€
      - Totale Versato: ${result.totalInvested.toFixed(2)}€
      - Interessi Generati: ${result.totalInterest.toFixed(2)}€
      
      Fornisci una breve analisi in italiano (max 150 parole). 
      1. Commenta se il rendimento del ${params.annualInterestRate}% è realistico per il mercato azionario (es. ETF globali).
      2. Evidenzia l'effetto dell'interesse composto.
      3. Menziona brevemente i rischi (inflazione, volatilità).
      Usa un tono professionale ma incoraggiante. Formatta la risposta in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Non sono riuscito a generare un consiglio al momento.";
  } catch (error) {
    console.error("Errore durante la generazione del consiglio AI:", error);
    return "Si è verificato un errore durante la comunicazione con l'assistente AI. Verifica la tua quota o la validità della chiave.";
  }
};