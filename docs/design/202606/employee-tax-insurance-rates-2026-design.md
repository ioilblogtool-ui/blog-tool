# 2026 직장인 세금·4대보험 요율표 설계 문서

> 작성일: 2026-06-03  
> 콘텐츠 유형: `/reports/` 리포트 + `/tools/` 계산기 패키지  
> 목표: 직장인이 급여명세서에서 빠지는 4대보험, 근로소득세, 지방소득세를 한 번에 이해하고 본인 월급 기준으로 예상 공제액을 계산하게 한다.

---

## 1. 콘텐츠 개요

- 리포트명: `2026 직장인 세금·4대보험 요율표`
- 리포트 URL: `/reports/employee-tax-insurance-rates-2026/`
- 계산기명: `4대보험 계산기 2026`
- 계산기 URL: `/tools/four-insurance-calculator/`
- 카테고리: 연봉·직장인 / 세금·4대보험
- 핵심 검색 의도: "내 월급에서 왜 이만큼 빠지는지", "2026년 4대보험 요율이 얼마인지", "급여명세서 공제 항목을 어떻게 읽는지"
- 우선 제작 순서: 리포트 선배포 후 계산기 연결, 또는 리포트와 계산기 동시 배포

---

## 2. 타깃 키워드

### 메인 키워드

- 2026 4대보험 요율
- 직장인 세금 4대보험
- 급여명세서 공제 항목
- 월급 4대보험 계산
- 직장인 실수령액 세금

### 보조 키워드

- 국민연금 요율 2026
- 건강보험료율 2026
- 장기요양보험료율 2026
- 고용보험료율
- 산재보험료율
- 근로소득세 간이세액표
- 지방소득세 계산
- 급여명세서 보는 법

### 롱테일 키워드

- 월급 300만원 4대보험
- 월급 400만원 세금 4대보험
- 급여명세서 국민연금 건강보험 차이
- 산재보험 근로자 부담 여부
- 4대보험 회사 부담 근로자 부담
- 근로소득세 부양가족 차이

---

## 3. 사용자 문제 정의

검색 사용자는 세법 전문 설명보다 급여명세서의 실제 의미를 알고 싶어 한다.

- "월급에서 4대보험이 왜 이렇게 많이 빠졌지?"
- "국민연금과 건강보험은 각각 몇 퍼센트일까?"
- "장기요양보험은 건강보험과 별도인가?"
- "산재보험도 내 월급에서 빠지는 금액인가?"
- "소득세는 왜 같은 월급이어도 사람마다 다를까?"
- "회사 부담분은 내 월급에서 빠지는 금액인가?"

따라서 본문은 공식 요율표를 단순 나열하기보다 `급여명세서 해석 -> 요율표 -> 월급 예시 -> 계산기 CTA` 흐름으로 설계한다.

---

## 4. 리포트 페이지 IA

파일: `src/pages/reports/employee-tax-insurance-rates-2026.astro`

1. Hero
   - H1: `2026 직장인 세금·4대보험 요율표`
   - 설명: `국민연금, 건강보험, 장기요양보험, 고용보험, 근로소득세, 지방소득세가 월급에서 어떻게 빠지는지 급여명세서 기준으로 정리합니다.`
   - 상단 CTA: `내 월급 4대보험 계산하기`

2. 핵심 요약
   - 월급 공제는 크게 `4대보험 + 근로소득세 + 지방소득세`
   - 산재보험은 원칙적으로 근로자 부담이 아니라 회사 부담
   - 소득세는 부양가족 수, 비과세 금액, 간이세액표 선택률에 따라 달라짐
   - 국민연금은 기준소득월액 상한·하한 적용

3. 2026년 4대보험 요율표
   - 국민연금
   - 건강보험
   - 장기요양보험
   - 고용보험
   - 산재보험
   - 근로자 부담 / 회사 부담 구분

4. 급여명세서 공제 항목 읽는 법
   - 국민연금
   - 건강보험
   - 장기요양보험
   - 고용보험
   - 소득세
   - 지방소득세

5. 월급별 예시
   - 월급 300만원
   - 월급 400만원
   - 월급 500만원
   - 비과세 20만원 적용 예시 별도 표시

6. 세금과 4대보험의 차이
   - 4대보험은 사회보험료
   - 근로소득세는 소득에 대한 세금
   - 지방소득세는 근로소득세의 10%

7. 실수령액이 사람마다 다른 이유
   - 비과세 식대
   - 부양가족 수
   - 자녀 수
   - 상여·성과급 포함 여부
   - 국민연금 상한액 적용 여부

8. 계산기 CTA
   - `내 월급 기준으로 4대보험 계산하기`
   - `/tools/four-insurance-calculator/`

9. 관련 계산기·리포트
   - `/tools/salary/`
   - `/tools/retirement/`
   - `/tools/year-end-tax-refund-calculator/`
   - `/tools/national-pension-calculator/`
   - `/reports/new-employee-salary-2026/`
   - `/reports/teacher-salary-2026/`
   - `/reports/public-servant-salary-2026/`

10. FAQ
   - 4대보험은 세금인가요?
   - 산재보험도 월급에서 공제되나요?
   - 건강보험과 장기요양보험은 다른 항목인가요?
   - 국민연금은 월급이 높으면 계속 늘어나나요?
   - 소득세가 지난달과 다른 이유는 무엇인가요?

---

## 5. 계산기 페이지 IA

파일: `src/pages/tools/four-insurance-calculator.astro`

### 입력값

- 월 급여
- 비과세 금액
- 부양가족 수
- 20세 이하 자녀 수
- 국민연금 적용 여부
- 고용보험 적용 여부
- 회사 부담분 표시 여부
- 산재보험 업종 선택 또는 평균값 보기

### 결과값

- 국민연금 근로자 부담
- 건강보험 근로자 부담
- 장기요양보험
- 고용보험 근로자 부담
- 4대보험 합계
- 예상 근로소득세
- 예상 지방소득세
- 예상 총 공제액
- 예상 실수령액
- 회사 부담 참고액

### 결과 카드 구성

1. 예상 실수령액
2. 월 4대보험 합계
3. 예상 세금 합계
4. 회사 부담 참고액

### 계산기 안내 문구

- `이 계산기는 급여명세서 이해를 돕기 위한 모의 계산입니다. 실제 공제액은 회사의 급여 기준, 비과세 처리, 간이세액표 선택률, 공단 정산 결과에 따라 달라질 수 있습니다.`

---

## 6. 데이터 모델

파일: `src/data/employeeTaxInsuranceRates2026.ts`

```ts
export interface InsuranceRateItem {
  id: string;
  name: string;
  base: string;
  employeeRate: number | null;
  employerRate: number | null;
  note: string;
}

export interface SalaryExample {
  monthlySalary: number;
  taxFreeAmount: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  estimatedIncomeTax: number;
  estimatedLocalTax: number;
  estimatedNetPay: number;
}

export interface PayrollFaq {
  question: string;
  answer: string;
}
```

파일: `src/data/fourInsuranceCalculator.ts`

```ts
export interface FourInsuranceInput {
  monthlySalary: number;
  taxFreeAmount: number;
  dependents: number;
  childrenUnder20: number;
  applyNationalPension: boolean;
  applyEmploymentInsurance: boolean;
  showEmployerShare: boolean;
}

export interface FourInsuranceResult {
  taxableMonthlyPay: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  totalInsurance: number;
  estimatedIncomeTax: number;
  estimatedLocalTax: number;
  totalDeduction: number;
  estimatedNetPay: number;
  employerShareTotal: number;
}
```

---

## 7. 2026 기준값 확인 항목

구현 전 최신 공식 자료로 재확인한다.

- 국민연금 보험료율: 2026년 총 9.5%, 사업장가입자 근로자 4.75% / 사용자 4.75%
- 국민연금 기준소득월액: 2026년 적용 상한·하한 확인
- 건강보험료율: 2026년 총 7.19%, 직장가입자 근로자 3.595% / 사용자 3.595%
- 장기요양보험료율: 건강보험료 대비 13.14%
- 고용보험료율: 근로자 부담 0.9% 기준 재확인
- 산재보험료율: 업종별 상이, 근로자 부담 없음
- 근로소득세: 국세청 근로소득 간이세액표 기준
- 지방소득세: 근로소득세의 10%

### 공식 출처 후보

- 국민연금 보험료율: https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0016M0.do
- 국민연금 기준소득월액 상·하한액: https://www.nps.or.kr/pnsgdnc/newgdnc/getOHAE0001M1.do?pstId=ZZ202600000000000147
- 국세청 근로소득 안내·간이세액표: https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7875&mi=6439
- 고용노동부 2026 산재보험료율 고시: https://www.moel.go.kr/info/lawinfo/instruction/view.do?bbs_seq=20251201757
- 국민건강보험공단 2026 건강보험료율 안내: https://www.nhis.or.kr/english/wbheaa02500m01.do

---

## 8. SEO 설계

### 리포트 메타

- title: `2026 직장인 세금·4대보험 요율표 | 급여명세서 공제 항목 정리`
- description: `2026년 국민연금, 건강보험, 장기요양보험, 고용보험 요율과 근로소득세·지방소득세가 월급에서 어떻게 공제되는지 급여명세서 기준으로 정리했습니다.`
- canonical: `https://bigyocalc.com/reports/employee-tax-insurance-rates-2026/`

### 계산기 메타

- title: `4대보험 계산기 2026 | 월급 국민연금·건강보험·고용보험 공제액`
- description: `월급과 비과세 금액을 입력해 2026년 기준 국민연금, 건강보험, 장기요양보험, 고용보험 공제액과 예상 실수령액을 계산합니다.`
- canonical: `https://bigyocalc.com/tools/four-insurance-calculator/`

### 구조화 데이터

리포트:

- `Article`
- `BreadcrumbList`
- `FAQPage`

계산기:

- `SoftwareApplication`
- `BreadcrumbList`
- `FAQPage`

---

## 9. 내부링크 전략

### 이 페이지로 들어오는 링크

- `/tools/salary/`: 연봉 실수령액 계산 후 4대보험 세부 CTA
- `/tools/retirement/`: 퇴직 전 급여명세서 공제 이해 CTA
- `/tools/year-end-tax-refund-calculator/`: 소득세·지방소득세 설명 CTA
- `/tools/national-pension-calculator/`: 국민연금 요율표 CTA
- `/reports/new-employee-salary-2026/`: 신입사원 급여명세서 읽기 CTA
- `/reports/teacher-salary-2026/`: 교사 월급 공제 항목 CTA
- `/reports/public-servant-salary-2026/`: 공무원 급여 공제 항목 CTA

### 이 페이지에서 나가는 링크

- 리포트 -> 계산기: `내 월급 4대보험 계산하기`
- 계산기 -> 리포트: `2026 요율표와 급여명세서 해설 보기`
- 계산기 -> 연봉 계산기: `연봉 실수령액으로 다시 보기`
- 계산기 -> 연말정산 계산기: `연말정산 환급액 계산하기`

---

## 10. 구현 파일 목록

```text
src/
  data/
    employeeTaxInsuranceRates2026.ts
    fourInsuranceCalculator.ts
  pages/
    reports/
      employee-tax-insurance-rates-2026.astro
    tools/
      four-insurance-calculator.astro
  styles/
    scss/
      pages/
        _employee-tax-insurance-rates-2026.scss
        _four-insurance-calculator.scss

public/
  scripts/
    four-insurance-calculator.js
```

등록 필요:

- `src/data/reports.ts`
- `src/data/tools.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

선택:

- `public/og/reports/employee-tax-insurance-rates-2026.png`
- `public/og/tools/four-insurance-calculator.png`

---

## 11. UI 방향

### 리포트

- 표 중심, 카드 과사용 금지
- 급여명세서 샘플처럼 행 단위로 스캔하기 쉬운 레이아웃
- 근로자 부담과 회사 부담을 색상보다 라벨로 명확히 구분
- "공식 요율"과 "예상 계산"을 시각적으로 분리

### 계산기

- 입력은 월 급여와 비과세 금액을 가장 먼저 배치
- 결과는 실수령액보다 공제 항목별 금액을 더 잘 보이게 구성
- 모바일에서는 입력 -> 결과 -> 해석 순서 유지
- 금액은 원 단위 표시, 요율은 소수점 3자리까지 필요한 경우만 표시

추천 class prefix:

- 리포트: `etir-`
- 계산기: `fic-`

---

## 12. 주의사항

- 2026 요율은 반드시 공식 출처 기준으로 확인 후 반영한다.
- 공식 확정 전 항목은 `예정`, `고시 기준`, `확인 필요` 라벨을 붙인다.
- 산재보험은 근로자 월급에서 공제되는 항목처럼 표현하지 않는다.
- 근로소득세는 간이세액표 기반 예상값이며 실제 연말정산 결과와 다를 수 있음을 명시한다.
- 건강보험 정산, 보수월액 변경, 성과급 반영 등으로 실제 급여명세서와 차이가 날 수 있음을 안내한다.

---

## 13. QA 체크리스트

- [ ] 리포트와 계산기 모두 한국어 메타 title/description 적용
- [ ] `reports.ts`, `tools.ts` 등록
- [ ] `app.scss` 스타일 등록
- [ ] `sitemap.xml` URL 등록
- [ ] 공식 출처 링크 본문 또는 하단에 표시
- [ ] JSON-LD 유효성 확인
- [ ] 월급 300만/400만/500만 예시 계산값 검산
- [ ] 모바일 390px에서 표 가로 스크롤 또는 반응형 처리 확인
- [ ] `npm run build` 성공

