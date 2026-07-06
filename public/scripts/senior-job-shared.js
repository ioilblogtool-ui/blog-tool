// 60대 일자리 계산기 클러스터 공용 로직 (근로기준법 제55조 주휴수당 기준)
// senior-job-salary-calculator-2026, security-guard-salary-calculator-2026,
// cleaning-job-salary-calculator-2026 3개 스크립트가 공통으로 import 한다.

const WEEKS_PER_MONTH = 4.345;
const WEEKLY_HOLIDAY_ELIGIBLE_HOURS = 15;

export function getWeeklyHolidayEligible(weeklyHours) {
  return weeklyHours >= WEEKLY_HOLIDAY_ELIGIBLE_HOURS;
}

export function calcMonthlyPay(hourlyWage, dailyHours, weeklyDays) {
  const weeklyHours = dailyHours * weeklyDays;
  const monthlyHours = weeklyHours * WEEKS_PER_MONTH;
  const weeklyHolidayPay = getWeeklyHolidayEligible(weeklyHours)
    ? (weeklyHours / 40) * 8 * hourlyWage * WEEKS_PER_MONTH
    : 0;
  const basePay = hourlyWage * monthlyHours;
  return {
    weeklyHours,
    monthlyHours,
    basePay,
    weeklyHolidayPay,
    total: basePay + weeklyHolidayPay,
  };
}

// job.fixedMonthlyHours가 있으면(격일제 등) 그 값을 그대로 쓰고,
// 없으면 dailyHoursPreset × weeklyDaysPreset × 4.345주 공식을 쓴다.
// src/data/seniorJobSalaryCalculator2026.ts의 calcJobExample과 동일 로직 (TS↔JS 이중 구현).
export function calcJobExample(job) {
  if (job.fixedMonthlyHours) {
    const basePay = job.hourlyWageDefault * job.fixedMonthlyHours;
    return { weeklyHours: job.fixedMonthlyHours / WEEKS_PER_MONTH, monthlyHours: job.fixedMonthlyHours, basePay, weeklyHolidayPay: 0, total: basePay };
  }
  return calcMonthlyPay(job.hourlyWageDefault, job.dailyHoursPreset[0], job.weeklyDaysPreset[0] ?? 5);
}

export function won(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function manwon(value) {
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
}
