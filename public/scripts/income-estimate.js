/**
 * income-estimate.js — 근로소득 실수령액 단순 추정 공용 유틸
 *
 * household-income.js, couple-salary-rank-calculator.js 등에서 공유합니다.
 * 4대보험·소득세를 단순화한 참고용 추정 로직이며, 실제 급여명세서와 다를 수 있습니다.
 */

export const DEDUCTION_PRESETS = {
  NONE: { baseDeduction: 0, dependentDeduction: 0 },
  SIMPLE: { baseDeduction: 1500000, dependentDeduction: 1000000 },
  FAMILY: { baseDeduction: 2500000, dependentDeduction: 1500000 },
};

/**
 * 연 소득(원)을 입력받아 추정 연 실수령액(원)을 반환합니다.
 * @param {number} annualAmount 연 소득(원)
 * @param {object} [options]
 * @param {boolean} [options.includeNonTaxable=true] 비과세 일부 반영 여부
 * @param {number} [options.dependents=0] 부양가족 수
 * @param {{baseDeduction:number, dependentDeduction:number}} [options.deductionPreset] 공제 프리셋
 * @returns {number} 추정 연 실수령액(원)
 */
export function estimateEarnedTakeHome(annualAmount, options = {}) {
  const {
    includeNonTaxable = true,
    dependents = 0,
    deductionPreset = DEDUCTION_PRESETS.SIMPLE,
  } = options;

  const monthlyGross = annualAmount / 12;
  const nonTaxableMonthly = includeNonTaxable ? Math.min(200000, monthlyGross * 0.04) : 0;
  const taxableMonthly = Math.max(0, monthlyGross - nonTaxableMonthly);
  const pension = Math.min(taxableMonthly * 0.045, 280000);
  const health = taxableMonthly * 0.03545;
  const longTermCare = health * 0.1295;
  const employment = taxableMonthly * 0.009;
  const annualDeduction = deductionPreset.baseDeduction + (deductionPreset.dependentDeduction * Math.max(0, dependents));
  const annualTaxableApprox = Math.max(0, taxableMonthly * 12 - annualDeduction);

  let incomeTaxRate = 0.06;
  if (annualTaxableApprox >= 30000000 && annualTaxableApprox < 50000000) incomeTaxRate = 0.1;
  else if (annualTaxableApprox >= 50000000 && annualTaxableApprox < 70000000) incomeTaxRate = 0.14;
  else if (annualTaxableApprox >= 70000000 && annualTaxableApprox < 100000000) incomeTaxRate = 0.17;
  else if (annualTaxableApprox >= 100000000 && annualTaxableApprox < 140000000) incomeTaxRate = 0.2;
  else if (annualTaxableApprox >= 140000000) incomeTaxRate = 0.24;

  const incomeTax = taxableMonthly * incomeTaxRate;
  const localIncomeTax = incomeTax * 0.1;
  const deductions = pension + health + longTermCare + employment + incomeTax + localIncomeTax;

  return Math.max(0, (monthlyGross - deductions) * 12);
}

/**
 * 기타 소득(원)에 대한 추정 실수령액(원)을 반환합니다.
 * @param {number} otherAnnualComp 기타 연 보상(원)
 * @param {boolean} [includeNonTaxable=true]
 * @returns {number}
 */
export function estimateOtherTakeHome(otherAnnualComp, includeNonTaxable = true) {
  if (otherAnnualComp <= 0) return 0;
  return otherAnnualComp * (includeNonTaxable ? 0.96 : 0.9);
}
