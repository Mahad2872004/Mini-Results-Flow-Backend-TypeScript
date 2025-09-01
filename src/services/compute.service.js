/**
 * Compute server-side values used by Result cards.
 * Your current UI already *has* bodyFatPercent, BMI, etc. in the form.
 * Here we normalize/validate/compute if additional raw inputs are ever added.
 * For now, we treat provided values as authoritative and return clean numbers.
 */

function clamp(n, min, max) {
  if (n == null || Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function round(n, dp = 1) {
  return Math.round((n + Number.EPSILON) * Math.pow(10, dp)) / Math.pow(10, dp);
}

export function computeFromForm(doc) {
  const gender = doc.gender;

  // normalize ranges from form data
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
