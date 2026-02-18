
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Classification {
  MELANOMA = 'Melanoma',
  BCC = 'Basal Cell Carcinoma',
  SCC = 'Squamous Cell Carcinoma',
  NEVUS = 'Benign Nevus',
  AK = 'Actinic Keratosis',
  DERMATOFIBROMA = 'Dermatofibroma',
  BENIGN = 'Benign',
  MALIGNANT = 'Malignant'
}

export interface PreventionTip {
  category: string;
  tip: string;
}

export interface AnalysisResult {
  id: string;
  label: Classification | string;
  confidence: number;
  riskLevel: RiskLevel;
  findings: string[];
  recommendations: string[];
  preventionTips: PreventionTip[];
  clinicalIndicators: {
    asymmetry: number;
    border: number;
    color: number;
    diameter: number;
  };
  summary: string;
  imageUrl: string;
  timestamp: Date;
  probabilities?: Record<string, number>;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastScanDate?: Date;
  history: AnalysisResult[];
}

export interface AtlasCase {
  id: string;
  title: string;
  classification: Classification | string;
  imageUrl: string;
  similarity: number;
  explanation: string;
  trendPrediction: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface ModelMetrics {
  trainingAccuracy: number;
  validationAccuracy: number;
  precision: number;
  recall: number;
  f1: number;
  confusionMatrix: number[][];
}
