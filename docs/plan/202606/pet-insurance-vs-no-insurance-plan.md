# 펫보험 vs 비보험 손익 계산기 기획

## 1. 배경 및 목적

- **계기**: 펫보험 가입률은 약 1% 수준이지만 최근 빠르게 성장 중. "펫보험 가입해야 하나", "펫보험 손해인가" 등 검색 수요 증가. 보험 비교 콘텐츠는 CPC 단가가 높아 수익성 우수
- **목적**:
  1. "펫보험 비교", "펫보험 가입 손익" 키워드 SEO 확보
  2. 보험 관련 광고 노출 → 단가 높은 금융·보험 카테고리 애드센스 수익
  3. 월 양육비 계산기·품종별 비용 비교와 3종 세트 연결 → 내부링크 허브
- **타겟 사용자**: 펫보험 가입 검토 중인 반려인, 기존 가입자 갱신 판단, 입양 예정자

---

## 2. 콘텐츠 성격

- 계산기형 도구 (`/tools/` 계열)
- 입력: 월 보험료, 예상 연간 병원비, 보장 범위(%)
- 출력: N년 후 보험 vs 비보험 누적 비용 비교, 손익분기점 연수

---

## 3. 페이지 구조

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/pet-insurance-calculator` | 펫보험 vs 비보험 손익분기 계산기 |

레이아웃: `SimpleToolShell`

---

## 4. 계산 로직

### 입력값

```
[보험 설정]
- 월 보험료 (원)           기본값: 30,000원
- 보장 한도 (연, 원)       기본값: 3,000,000원
- 자기부담금 비율 (%)       기본값: 20%
- 보장 범위 (%)            기본값: 80%

[병원비 시나리오]
- 연 예상 병원비            기본값: 500,000원
  ├ 일반진료 (월)
  ├ 예방접종·검진 (연)
  └ 응급·수술 발생 확률 (%) 기본값: 15%
    └ 예상 수술비          기본값: 1,500,000원

[분석 기간]
- 비교 기간 (년)           기본값: 10년 (슬라이더 1~15년)
```

### 계산식

```
// 보험 가입 시 연간 지출
annualInsuranceCost = monthlyPremium × 12

// 보험 가입 시 실제 병원비 부담
coveredAmount = min(annualHospitalBill, coverageLimit) × coverageRate
selfPay = annualHospitalBill - coveredAmount + deductible
insuranceTotalAnnual = annualInsuranceCost + selfPay

// 비보험 시 연간 지출
noInsuranceAnnual = annualHospitalBill
  + (emergencyProbability × emergencyCost)  // 응급 기대비용

// 손익분기점
breakEvenYear = 보험 누적 지출 < 비보험 누적 지출 교차 시점

// N년 누적 비교
insuranceCumulative[year] = insuranceTotalAnnual × year
noInsuranceCumulative[year] = noInsuranceAnnual × year
```

---

## 5. 출력 결과

```
[KPI 카드 — 4개]
- 보험 가입 시 10년 총비용
- 비보험 시 10년 총비용 (기대값)
- 손익분기점 (N년 후 / "가입 유리" or "비보험 유리")
- 10년 절감액 (또는 추가부담)

[누적 비용 라인 차트]
- X축: 연수 (1~15년)
- Y축: 누적 비용
- 보험 라인(파랑) vs 비보험 라인(주황)
- 교차점 강조 = 손익분기점

[시나리오 비교]
- 건강한 경우 (병원비 적음): 비보험 유리
- 보통 경우 (평균): N년 후 보험 유리
- 큰 수술 발생 시: 보험 압도적 유리

[결론 텍스트]
"입력하신 조건에서는 [보험 가입/비보험]이 유리합니다."
"응급 수술 1회 발생 시 보험이 약 N만원 절감됩니다."
```

---

## 6. UI/IA 상세

1. CalculatorHero — "펫보험 vs 비보험 손익 계산기 2026"
2. InfoNotice — "보험사별 상품 조건이 다름. 실제 가입 전 약관 확인 필수"
3. 입력 패널 — 보험 설정 + 병원비 시나리오 + 분석 기간
4. KPI 4개
5. 라인 차트 — 누적 비용 교차 시각화
6. 시나리오 3종 요약 카드
7. 결론 텍스트 박스
8. 주요 펫보험 상품 안내 섹션 (메리츠·현대해상·삼성화재 링크) — 제휴 기회
9. SeoContent + FAQ

---

## 7. SEO 키워드

| 1차 키워드 | 2차 키워드 |
|---|---|
| 펫보험 손익 계산기 | 펫보험 가입 해야하나, 펫보험 비교 |
| 강아지 보험 비교 | 강아지 보험 필요한가, 고양이 보험 |
| 펫보험 손익분기 | 펫보험 본전, 펫보험 환급 |

---

## 8. 구현 파일 목록

- `src/data/petInsuranceCalculator2026.ts`
- `src/pages/tools/pet-insurance-calculator.astro`
- `public/scripts/pet-insurance-calculator.js`
- `src/styles/scss/pages/_pet-insurance-calculator.scss` (prefix: `pic-`)
- 등록: `tools.ts`, `app.scss`, `sitemap.xml`, `index.astro`

---

## 9. 수익화 포인트

- 보험 관련 애드센스 CPC 단가 높음 (금융 카테고리)
- 향후 메리츠·현대해상·삼성화재 펫보험 제휴 링크 추가 가능
- "펫보험 추천" 비교 리포트로 확장 가능

---

## 10. QA/리스크

- 손익분기 계산이 틀리면 사용자 신뢰 하락 → 수식 이중 검증
- "보험 가입 권유" 오해 방지 → 중립 표현 + "실제 가입 전 약관 확인" 고지
- 보험료·보장범위 기본값은 실제 시중 상품 기준으로 설정 (메리츠 기준 참고)
- 응급 발생 확률은 "참고용 설정값"으로 사용자가 0~50% 직접 조정 가능하게
