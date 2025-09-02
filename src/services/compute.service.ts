

export interface ComputeInput {
  gender: 'male' | 'female';
  bodyFatPercent: number;
  BMI: number;
  calorieTarget: number;
  waterIntake: number;
  weightLossRate: number;
  seeResultsDays: number;
  [key: string]: any; 
}

export interface ComputeResult {
  gender: 'male' | 'female';
  bodyFatPercent: number;
  BMI: number;
  calorieTarget: number;
  waterIntake: number;
  weightLossRate: number;
  seeResultsDays: number;
  labels: {
    bodyFatLabel: string;
    bmiLabel: string;
    caloriesLabel: string;
    hydrationLabel: string;
  };
}

function clamp(n: number, min: number, max: number): number {
  if (n == null || Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function round(n: number, dp = 1): number {
  return Math.round((n + Number.EPSILON) * Math.pow(10, dp)) / Math.pow(10, dp);
}

export function computeFromForm(doc: ComputeInput): ComputeResult {
  const gender = doc.gender;

  // normalize form data
  const bodyFatPercent = round(clamp(Number(doc.bodyFatPercent), 0, 100), 1);
  const BMI = round(clamp(Number(doc.BMI), 0, 80), 1);
  const calorieTarget = Math.round(clamp(Number(doc.calorieTarget), 500, 6000));
  const waterIntake = Math.round(clamp(Number(doc.waterIntake), 0, 30)); 
  const weightLossRate = round(clamp(Number(doc.weightLossRate), 0, 10), 2); 
  const seeResultsDays = Math.round(clamp(Number(doc.seeResultsDays), 1, 365));

  const bodyFatLabel = (() => {
    if (gender === 'male') {
      if (bodyFatPercent < 24) return 'Almost Healthy';
      if (bodyFatPercent <= 31) return 'Obese';
      return 'Very Obese';
    } else {
      if (bodyFatPercent < 31) return 'Almost Healthy';
      if (bodyFatPercent <= 39) return 'Obese';
      return 'Very Obese';
    }
  })();

  const bmiLabel = (() => {
    if (BMI < 26) return 'Almost Healthy';
    if (BMI < 35) return 'Obese';
    return 'Very Obese';
  })();

  const caloriesLabel = (() => {
    if (calorieTarget >= 1300) return 'Almost Healthy';
    if (calorieTarget >= 1100) return 'Obese Range';
    return 'Very Obese Range';
  })();

  const hydrationLabel = (() => {
    if (waterIntake > 6) return 'Great';
    if (waterIntake >= 2) return 'Getting there';
    return 'Low intake';
  })();

  return {
    gender,
    bodyFatPercent,
    BMI,
    calorieTarget,
    waterIntake,
    weightLossRate,
    seeResultsDays,
    labels: { bodyFatLabel, bmiLabel, caloriesLabel, hydrationLabel },
  };
}
