import assert from 'node:assert/strict';
import { YETC_RULES as rules, YETC_DEFAULTS as defaults, YETC_FIELDS as fields, YETC_INTRO, YETC_FAQ } from '../src/data/yearEndTaxRefundCalculator.ts';
import { createCalculator, parseValue, validateInput, restoreState, serializeState } from '../public/scripts/year-end-tax-refund-calculator.js';

const calc = createCalculator(rules);
const input = overrides => ({ ...defaults, ...overrides });
let passed = 0;
function check(name, verify) { verify(); passed++; console.log('통과: ' + name); }
check('기본 상태의 수기 계산·표준세액공제', () => {
  const r = calc.calculate(defaults);
  assert.equal(r.laborDeduction, 12_250_000);
  assert.equal(r.taxBase, 36_250_000);
  assert.equal(r.taxAmount, 4_177_500);
  assert.equal(r.laborCredit, 660_000);
  assert.equal(r.finalTax, 3_387_500);
  assert.equal(r.refund, null);
});
check('카드 25% 미달·동일·1원 초과', () => {
  const c = amount => calc.calcCardDeduction(input({ creditCardAmount: amount }));
  assert.equal(c(10_000_000).remaining, 2_500_000);
  assert.equal(c(12_500_000).deduction, 0);
  assert.ok(Math.abs(c(12_500_001).raw - 0.15) < 1e-6);
  assert.equal(c(12_500_001).deduction, 0);
});
check('일반 카드·결제수단 비교 수기값', () => {
  const s = input({ creditCardAmount: 15_000_000 });
  assert.equal(calc.calcCardDeduction(s).deduction, 375_000);
  assert.equal(calc.compareScenario(s, 'creditCardAmount', 1_000_000).deductionIncrease, 150_000);
  assert.equal(calc.compareScenario(s, 'debitCashAmount', 1_000_000).deductionIncrease, 300_000);
  assert.equal(calc.compareScenario(s, 'creditCardAmount', 1_000_000).incomeTaxDecrease, 22_500);
  assert.equal(calc.compareScenario(s, 'debitCashAmount', 1_000_000).incomeTaxDecrease, 45_000);
});
check('카드 문턱을 넘는 추가 소비', () => {
  const s = input({ creditCardAmount: 12_000_000 });
  assert.equal(calc.compareScenario(s, 'creditCardAmount', 1_000_000).deductionIncrease, 75_000);
  assert.equal(calc.compareScenario(s, 'debitCashAmount', 1_000_000).deductionIncrease, 150_000);
});
check('최저사용금액 15→30→40% 차감', () => {
  const s = input({ creditCardAmount: 5_000_000, debitCashAmount: 5_000_000, traditionalMarketAmount: 5_000_000 });
  const r = calc.calcCardDeduction(s);
  assert.equal(r.thresholdDeduction, 3_250_000);
  assert.equal(r.deduction, 1_000_000);
});
check('문화체육비 차감·고소득 결제수단 재분류', () => {
  assert.equal(calc.calcCardDeduction(input({ creditCardAmount: 5_000_000, cultureSportsAmount: 5_000_000, traditionalMarketAmount: 5_000_000 })).deduction, 1_000_000);
  const high = input({ grossSalary: 80_000_000, creditCardAmount: 20_000_000, cultureSportsAmount: 1_000_000, cultureDebitAmount: 1_000_000 });
  assert.equal(calc.calcCardDeduction(high).deduction, 450_000);
});
check('카드 기본·추가한도 포화와 중복 방지', () => {
  const s = input({ creditCardAmount: 50_000_000, traditionalMarketAmount: 10_000_000 });
  const r = calc.calcCardDeduction(s);
  assert.equal(r.deduction, 6_000_000);
  assert.equal(r.extra, 3_000_000);
  assert.equal(calc.compareScenario(s, 'debitCashAmount', 1_000_000).deductionIncrease, 0);
  assert.equal(calc.calcCardDeduction(input({ grossSalary: 80_000_000, creditCardAmount: 60_000_000, publicTransportAmount: 10_000_000 })).deduction, 4_500_000);
});
check('2026 카드 자녀별 한도·7천만원 경계·1.2억원 초과', () => {
  for (const [salary, caps] of [[70_000_000, [3_000_000, 3_500_000, 4_000_000]], [70_000_001, [2_500_000, 2_750_000, 3_000_000]], [130_000_000, [2_500_000, 2_750_000, 3_000_000]]]) {
    for (let children = 0; children < 3; children++) assert.equal(calc.calcCardDeduction(input({ grossSalary: salary, cardLimitChildren: children })).baseCap, caps[children]);
  }
});
check('연금저축·IRP 추가 납입 대표 예시', () => {
  const a = input({ pensionSaving: 4_000_000, irpAmount: 2_000_000 });
  assert.equal(calc.compareScenario(a, 'irpAmount', 1_000_000).nominalCreditIncrease, 150_000);
  assert.equal(calc.compareScenario(a, 'irpAmount', 1_000_000).incomeTaxDecrease, 150_000);
  const b = input({ grossSalary: 70_000_000, pensionSaving: 6_000_000, irpAmount: 1_000_000 });
  assert.equal(calc.compareScenario(b, 'irpAmount', 1_000_000).nominalCreditIncrease, 120_000);
});
check('연금 한도·초과 납입·잔여 중복 방지', () => {
  const full = input({ pensionSaving: 6_000_000, irpAmount: 3_000_000 });
  assert.equal(calc.calcPensionCredit(full).remaining, 0);
  assert.equal(calc.compareScenario(full, 'irpAmount', 1_000_000).nominalCreditIncrease, 0);
  const over = input({ pensionSaving: 8_000_000 });
  const r = calc.calcPensionCredit(over);
  assert.equal(r.base, 6_000_000); assert.equal(r.remaining, 3_000_000); assert.equal(r.savingRemaining, 0);
  assert.equal(over.pensionSaving, 8_000_000);
  assert.equal(calc.calcPensionCredit(input({ irpAmount: 8_000_000 })).savingRemaining, 1_000_000);
});
check('5,500만원 공제율 경계', () => {
  for (const [salary, pension, rent] of [[55_000_000, 150_000, 170_000], [55_000_001, 120_000, 150_000]]) {
    const r = calc.calculate(input({ grossSalary: salary, pensionSaving: 1_000_000, monthlyRent: 1_000_000, isRenter: true, rentEligible: 'yes' }));
    assert.equal(r.pension.credit, pension); assert.equal(r.rent, rent);
  }
});
check('월세 수기값·요건·8천만원 경계', () => {
  const s = input({ monthlyRent: 7_200_000, isRenter: true, rentEligible: 'yes' });
  assert.equal(calc.calculate(s).rent, 1_224_000);
  assert.equal(calc.calculate({ ...s, rentEligible: 'unknown' }).rent, 0);
  assert.equal(calc.calculate({ ...s, isRenter: false }).rent, 0);
  assert.equal(calc.calculate({ ...s, grossSalary: 80_000_000 }).rent, 1_080_000);
  assert.equal(calc.calculate({ ...s, grossSalary: 80_000_001 }).rent, 0);
  assert.equal(calc.calculate({ ...s, monthlyRent: 20_000_000 }).rent, 1_700_000);
});
check('자녀세액공제 0~4명', () => {
  [0, 250_000, 550_000, 950_000, 1_350_000].forEach((expected, children) => assert.equal(calc.calculate(input({ dependents: children + 1, children })).child, expected));
});
check('기납부 null·0·환급·추가납부·누적 차이', () => {
  const tax = calc.calculate(defaults).finalTax;
  assert.equal(calc.calculate(input({ withheldTax: 0 })).refund, -tax);
  assert.equal(calc.calculate(input({ withheldTax: tax })).refund, 0);
  assert.equal(calc.calculate(input({ withheldTax: tax + 100_000 })).refund, 100_000);
  assert.equal(calc.calculate(input({ withheldTax: tax - 100_000 })).refund, -100_000);
  assert.equal(calc.calculate(input({ withheldTax: tax, withheldPeriod: 'ytd' })).refundScope, 'ytd');
});
check('결정세액 0이면 명목 증가와 실제 감소 분리', () => {
  const s = input({ grossSalary: 10_000_000, pensionSaving: 2_000_000 });
  assert.equal(calc.calculate(s).finalTax, 0);
  assert.equal(calc.compareScenario(s, 'irpAmount', 1_000_000).nominalCreditIncrease, 150_000);
  assert.equal(calc.compareScenario(s, 'irpAmount', 1_000_000).incomeTaxDecrease, 0);
});
check('근로소득세액공제 급여 한도·산출세액 경계', () => {
  for (const [salary, cap] of [[33_000_000, 740_000], [43_000_000, 660_000], [70_000_000, 660_000], [70_000_001, 659_999], [80_000_000, 500_000], [120_000_000, 500_000], [120_000_001, 499_999], [130_000_000, 200_000]]) assert.equal(calc.calcLaborTaxCredit(salary, 10_000_000), cap);
  assert.equal(calc.calcLaborTaxCredit(20_000_000, 1_300_000), 715_000);
  assert.equal(calc.calcLaborTaxCredit(20_000_000, 1_300_010), 715_003);
});
check('누진세율 전 구간·경계 연속성', () => {
  for (const row of rules.taxBrackets.slice(0, -1)) {
    const tax = calc.calcIncomeTax(row.max);
    assert.equal(tax, Math.floor(row.max * row.rate - row.deduction));
    assert.ok(calc.calcIncomeTax(row.max + 1) >= tax);
    assert.ok(calc.calcIncomeTax(row.max + 1) - tax <= 1);
  }
  assert.equal(calc.calcIncomeTax(1_100_000_000), 429_060_000);
});
check('표준세액공제와 특별공제의 유효 대안', () => {
  assert.equal(calc.calculate(input({ insurance: 1_000_000 })).standard, true);
  const s = input({ socialInsuranceDeduction: 2_000_000, insurance: 1_000_000 });
  const r = calc.calculate(s);
  assert.equal(r.standard, false); assert.equal(r.finalTax, 3_097_500);
  assert.equal(calc.calculate(input({ housingSubscription: 3_000_000, subscriptionEligible: 'yes' })).appliedHousing, 1_200_000);
  assert.equal(calc.calculate(input({ mortgageRepayment: 10_000_000, housingEligible: 'yes' })).appliedHousing, 4_000_000);
});
check('의료·보험 한도·교육비 인별 산정 입력', () => {
  const r = calc.calculate(input({ medicalExpense: 20_000_000, insurance: 2_000_000, educationExpense: 12_000_000 }));
  assert.equal(r.medical, 1_050_000); assert.equal(r.insurance, 120_000); assert.equal(r.education, 1_800_000);
});
check('유효성·비정상 숫자·인원 관계', () => {
  assert.deepEqual(validateInput(defaults, fields, rules), {});
  for (const raw of ['-1', '1.5', 'Infinity', 'NaN', '1e7', '10000000001']) assert.ok(parseValue(fields[0], raw, rules).error);
  assert.ok(validateInput(input({ grossSalary: 0 }), fields, rules).grossSalary);
  assert.ok(validateInput(input({ children: 1 }), fields, rules).children);
  assert.ok(validateInput(input({ dependents: 2, elderlyDependents: 2, disabledDependents: 2 }), fields, rules).children === undefined);
});
check('공유 상태 전체 왕복·빈 기납부·실제 0원', () => {
  const s = input({ creditCardAmount: 14_000_000, withheldTax: 0, rentEligible: 'yes', isRenter: true });
  assert.deepEqual(restoreState(serializeState(s, fields), defaults, fields, rules).state, s);
  assert.equal(serializeState(defaults, fields).has('wt'), false);
});
check('구버전·비정상 URL 안전 이관', () => {
  const r = restoreState(new URLSearchParams('sal=60000000&wt=0&don=1000000&chd=1&renter=oops&pen=Infinity'), defaults, fields, rules);
  assert.equal(r.state.grossSalary, 60_000_000); assert.equal(r.state.withheldTax, null);
  assert.equal(r.state.donationCreditInput, 0); assert.equal(r.state.cardLimitChildren, 0);
  assert.equal(r.state.isRenter, false); assert.equal(r.state.pensionSaving, 0);
  assert.ok(r.warnings.length >= 3);
});
check('소개 5단락·800자 이상·FAQ 6개 이상', () => {
  assert.ok(YETC_INTRO.length >= 5); assert.ok(YETC_INTRO.join('').length >= 800); assert.ok(YETC_FAQ.length >= 6);
});
console.log('연말정산 검증 완료: ' + passed + '개 사례');
