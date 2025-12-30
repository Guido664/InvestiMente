import { GoogleGenAI } from "@google/genai";
import { InvestmentParams, SimulationResult } from "../types";

// Initialize the client. 
// Note: process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (
  params: InvestmentParams, 
  result: SimulationResult
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key mancante. Configura la chiave API per ricevere i consigli dell'AI.";
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
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep thought for this simple task
      }
    });

    return response.text || "Non sono riuscito a generare un consiglio al momento.";
  } catch (error) {
    console.error("Errore durante la generazione del consiglio AI:", error);
    return "Si è verificato un errore durante la comunicazione con l'assistente AI.";
  }
};