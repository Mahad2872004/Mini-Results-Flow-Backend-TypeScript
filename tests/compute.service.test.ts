import { computeFromForm, ComputeInput } from '../src/services/compute.service';

describe('compute.service', () => {

  describe('computeFromForm', () => {
    it('should normalize and clamp numeric values correctly', () => {
      const input: ComputeInput = {
        gender: 'male',
        bodyFatPercent: 150, 
        BMI: -10, 
        calorieTarget: 7000,
        waterIntake: -5,
        weightLossRate: 15, 
        seeResultsDays: 500, 
      };

      const result = computeFromForm(input);

      expect(result.bodyFatPercent).toBe(100);
      expect(result.BMI).toBe(0);
      expect(result.calorieTarget).toBe(6000);
      expect(result.waterIntake).toBe(0);
      expect(result.weightLossRate).toBe(10);
      expect(result.seeResultsDays).toBe(365);
    });

    it('should round numbers correctly', () => {
      const input: ComputeInput = {
        gender: 'female',
        bodyFatPercent: 23.456,
        BMI: 24.987,
        calorieTarget: 2000,
        waterIntake: 3.7,
        weightLossRate: 0.5678,
        seeResultsDays: 30.2,
      };

      const result = computeFromForm(input);

      expect(result.bodyFatPercent).toBeCloseTo(23.5, 1);
      expect(result.BMI).toBeCloseTo(25, 1);
      expect(result.calorieTarget).toBe(2000);
      expect(result.waterIntake).toBe(4); 
      expect(result.weightLossRate).toBeCloseTo(0.57, 2);
      expect(result.seeResultsDays).toBe(30);
    });

    it('should assign correct labels for male', () => {
      const input: ComputeInput = {
        gender: 'male',
        bodyFatPercent: 20,
        BMI: 27,
        calorieTarget: 1200,
        waterIntake: 1,
        weightLossRate: 1,
        seeResultsDays: 10,
      };

      const result = computeFromForm(input);

      expect(result.labels.bodyFatLabel).toBe('Almost Healthy');
      expect(result.labels.bmiLabel).toBe('Obese');
      expect(result.labels.caloriesLabel).toBe('Obese Range');
      expect(result.labels.hydrationLabel).toBe('Low intake');
    });

    it('should assign correct labels for female', () => {
      const input: ComputeInput = {
        gender: 'female',
        bodyFatPercent: 35,
        BMI: 40,
        calorieTarget: 1000,
        waterIntake: 8,
        weightLossRate: 2,
        seeResultsDays: 20,
      };

      const result = computeFromForm(input);

      expect(result.labels.bodyFatLabel).toBe('Obese');
      expect(result.labels.bmiLabel).toBe('Very Obese');
      expect(result.labels.caloriesLabel).toBe('Very Obese Range');
      expect(result.labels.hydrationLabel).toBe('Great');
    });

    it('should handle NaN or null values gracefully', () => {
      const input: ComputeInput = {
        gender: 'male',
        bodyFatPercent: NaN,
        BMI: null as any,
        calorieTarget: undefined as any,
        waterIntake: NaN,
        weightLossRate: NaN,
        seeResultsDays: NaN,
      };

      const result = computeFromForm(input);

      expect(result.bodyFatPercent).toBe(0);
      expect(result.BMI).toBe(0);
      expect(result.calorieTarget).toBe(500); 
      expect(result.waterIntake).toBe(0);
      expect(result.weightLossRate).toBe(0);
      expect(result.seeResultsDays).toBe(1); 
    });
  });

});
