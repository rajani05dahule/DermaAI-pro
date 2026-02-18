
import { GoogleGenAI, Type } from "@google/genai";
import { Classification, RiskLevel, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    label: {
      type: Type.STRING,
      description: "Must be 'Benign' or 'Malignant'.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence percentage (0-100).",
    },
    riskLevel: {
      type: Type.STRING,
      description: "Must be 'Low', 'Medium', or 'High'.",
    },
    findings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific dermatological observations.",
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Professional clinical next steps.",
    },
    preventionTips: {
      type: Type.ARRAY,
      items: { 
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Category like 'Monitoring', 'Protection', 'Action'." },
          tip: { type: Type.STRING, description: "Personalized advice." }
        },
        required: ["category", "tip"]
      },
      description: "Personalized prevention advice.",
    },
    clinicalIndicators: {
      type: Type.OBJECT,
      properties: {
        asymmetry: { type: Type.NUMBER, description: "Score 0-10" },
        border: { type: Type.NUMBER, description: "Score 0-10" },
        color: { type: Type.NUMBER, description: "Score 0-10" },
        diameter: { type: Type.NUMBER, description: "Score 0-10" }
      },
      required: ["asymmetry", "border", "color", "diameter"]
    },
    summary: {
      type: Type.STRING,
      description: "One-sentence overview of the screening result.",
    }
  },
  required: ["label", "confidence", "riskLevel", "findings", "recommendations", "preventionTips", "clinicalIndicators", "summary"]
};

export const analyzeSkinLesion = async (imageBase64: string, imageUrl: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Act as a Board-Certified Dermatologist AI.
    Analyze this 224x224 skin lesion image based on the ABCDE criteria.
    1. ASYMMETRY: How asymmetric is the shape? (0-10)
    2. BORDER: How irregular are the edges? (0-10)
    3. COLOR: How many colors or variegation? (0-10)
    4. DIAMETER/EVOLUTION: Does it appear concerning? (0-10)
    Provide a detailed screening including findings, next steps, and prevention tips.
    Output MUST follow the JSON schema.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA
    }
  });

  const text = response.text || '{}';
  const result = JSON.parse(text);

  return {
    id: Math.random().toString(36).substring(7),
    label: result.label as Classification,
    confidence: result.confidence,
    riskLevel: result.riskLevel as RiskLevel,
    findings: result.findings,
    recommendations: result.recommendations,
    preventionTips: result.preventionTips,
    clinicalIndicators: result.clinicalIndicators,
    summary: result.summary,
    imageUrl,
    timestamp: new Date()
  };
};

export const findNearbyClinics = async (lat: number, lng: number) => {
  const model = 'gemini-2.5-flash-lite-latest';
  const response = await ai.models.generateContent({
    model,
    contents: "Locate and list the names, addresses, and specialties of the nearest dermatologists and skin cancer screening clinics to my current location.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });

  return {
    text: response.text,
    places: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.maps).filter(Boolean) || []
  };
};

export const createHealthChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are a helpful and professional Dermatology Health Assistant for DermAI Pro. Answer questions about skin health, sun protection, and explain dermatological terms. Always remind users that you are an AI and they should consult a real doctor for clinical diagnoses.',
    },
  });
};
