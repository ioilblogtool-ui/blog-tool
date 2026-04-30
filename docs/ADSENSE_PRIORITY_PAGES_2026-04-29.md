# 애드센스 재검토 우선 수정 페이지 목록 (2026-04-29)

기준일: 2026-04-29  
판정 이슈: `가치가 별로 없는 콘텐츠`  
목표: 재검토 요청 전 "허브 신뢰도 + 얇은 계산기 보강"을 우선 처리

## 우선순위 선정 기준
- 허브 성격 페이지(전체 품질 인상에 영향이 큼)
- 텍스트 밀도/해설 밀도가 상대적으로 낮은 계산기
- FAQ/해설/내부 링크 확장 여지가 큰 페이지
- 정책/제도형 주제로 해석 가이드가 특히 중요한 페이지

## P0 (즉시 수정, 1차 재검토 전 필수)
1. `/`
2. `/tools/`
3. `/reports/`
4. `/about/`
5. `/tools/national-pension-calculator/` (현재 `SeoContent` 블록 없음)
6. `/tools/negotiation/`
7. `/tools/birth-support-total/`
8. `/tools/retirement/`
9. `/tools/parental-leave/`
10. `/tools/parental-leave-pay/`
11. `/tools/salary/`
12. `/tools/six-plus-six/`
13. `/tools/single-parental-leave-total/`
14. `/tools/hyundai-bonus/`
15. `/tools/sk-hynix-bonus/`
16. `/tools/samsung-bonus/`

## P1 (P0 완료 직후)
1. `/tools/ai-automation-hourly-roi/`
2. `/tools/formula-cost/`
3. `/tools/diaper-cost/`
4. `/tools/irp-pension-calculator/`
5. `/tools/domestic-stock-capital-gains-tax/`
6. `/tools/fetal-insurance-calculator/`
7. `/tools/apt-cheonyak-gajum-calculator/`
8. `/tools/retirement-fund-depletion/`
9. `/tools/savings-vs-etf-retirement/`
10. `/tools/household-income/`

## 페이지별 필수 보강 항목
아래 6개를 P0/P1 모든 페이지에 공통 적용한다.

1. 도입 2문단 이상 (누가, 어떤 결정을 위해 쓰는지)
2. 계산 기준/가정/기준일 명시
3. 결과 해석 섹션 신설 또는 확장
4. 예시 2개 이상
5. FAQ 3개 이상
6. 내부 링크 3개 이상 + 출처 명시

## 실행 순서 (실무 권장)
1. 허브 4개(`/`, `/tools/`, `/reports/`, `/about/`) 먼저 보강
2. 정책/제도형 계산기(`national-pension`, `parental-leave*`, `six-plus-six`) 보강
3. 급여/보너스형 계산기(`salary`, `negotiation`, `*bonus`) 보강
4. 각 페이지 수정 후 `npm run build`로 즉시 확인
5. P0 완료 후 내부 링크 순환 점검(고립 페이지 제거)

## 재검토 요청 전 최종 체크
- P0 페이지 전부에 공통 6항목 반영
- 미완성 문구, 임시 문구, 빈 섹션 없음
- 모바일에서 본문 가독성/광고 간섭 없음
- 사이트 소개/문의/정책 페이지 접근 동선 확보

## 작업 진행 상태 표기 가이드

작업자는 아래 상태값으로 각 페이지의 진행 상황을 표시한다.

| 상태 | 의미 | 다음 액션 |
|---|---|---|
| `대기` | 아직 검토 또는 수정 전 | 파일 위치와 기존 콘텐츠 구조 확인 |
| `진행중` | 콘텐츠 또는 UI 수정 중 | 필수 보강 6항목을 순서대로 반영 |
| `검수필요` | 수정 완료, 빌드/모바일/링크 검수 전 | `npm run build` 및 화면 확인 |
| `완료` | 빌드와 페이지 검수까지 통과 | 다음 우선순위 페이지 진행 |
| `보류` | 자료 부족, 정책 확인 필요, 구조 충돌 등으로 중단 | 보류 사유와 필요한 결정을 기록 |

완료 처리 기준:
- 도입, 기준/가정, 결과 해석, 예시, FAQ, 내부 링크가 모두 보강되어 있다.
- 공식값과 추정값이 배지 또는 문장으로 구분되어 있다.
- 사용자 facing 텍스트가 모두 자연스러운 한국어다.
- `npm run build`가 성공한다.
- 주요 CTA, 관련 링크, 출처 링크가 깨지지 않는다.

## P0 작업 진행 목록

| 우선순위 | URL | 작업 성격 | 상태 | 메모 |
|---:|---|---|---|---|
| 1 | `/` | 허브 신뢰도 보강 | `검수필요` | 사이트 소개 2문단, 기준/해석, 활용 예시 2개, FAQ, JSON-LD 보강. `npm run build` 통과 |
| 2 | `/tools/` | 계산기 허브 보강 | `검수필요` | 기준/해석, 활용 예시 2개, FAQ, 운영 기준 링크 보강. `npm run build` 통과 |
| 3 | `/reports/` | 리포트 허브 보강 | `검수필요` | 작성 기준/해석, 활용 예시 2개, FAQ, JSON-LD 보강. `npm run build` 통과 |
| 4 | `/about/` | 사이트 신뢰도 보강 | `검수필요` | 운영 목적, 공식/참고/시뮬레이션 기준, 작업 절차, 활용 예시 2개, 정책 링크, FAQ, JSON-LD 보강. `npm run build` 통과 |
| 5 | `/tools/national-pension-calculator/` | 정책형 계산기 | `대기` | `SeoContent` 블록 추가 필요 |
| 6 | `/tools/negotiation/` | 급여형 계산기 | `대기` | 협상 결과 해석과 예시 보강 |
| 7 | `/tools/birth-support-total/` | 정책형 계산기 | `대기` | 지원금 기준일과 지역 차이 설명 보강 |
| 8 | `/tools/retirement/` | 장기 추정 계산기 | `대기` | 은퇴자금 가정과 민감도 해석 보강 |
| 9 | `/tools/parental-leave/` | 정책형 계산기 | `대기` | 제도 기준과 급여 해석 보강 |
| 10 | `/tools/parental-leave-pay/` | 정책형 계산기 | `대기` | 급여 산식, 상한/하한 설명 보강 |
| 11 | `/tools/salary/` | 급여형 계산기 | `대기` | 공제 기준과 실수령 해석 보강 |
| 12 | `/tools/six-plus-six/` | 정책형 계산기 | `대기` | 6+6 제도 조건과 예외 설명 보강 |
| 13 | `/tools/single-parental-leave-total/` | 정책형 계산기 | `대기` | 한부모 조건과 총액 예시 보강 |
| 14 | `/tools/hyundai-bonus/` | 보너스형 계산기 | `대기` | 추정값 표시와 비교 예시 보강 |
| 15 | `/tools/sk-hynix-bonus/` | 보너스형 계산기 | `대기` | 추정값 표시와 비교 예시 보강 |
| 16 | `/tools/samsung-bonus/` | 보너스형 계산기 | `대기` | 추정값 표시와 비교 예시 보강 |

## P1 작업 진행 목록

| 우선순위 | URL | 작업 성격 | 상태 | 메모 |
|---:|---|---|---|---|
| 1 | `/tools/ai-automation-hourly-roi/` | ROI 추정 계산기 | `대기` | 가정값과 회수기간 해석 보강 |
| 2 | `/tools/formula-cost/` | 육아비 계산기 | `대기` | 월령별 예시와 비용 범위 보강 |
| 3 | `/tools/diaper-cost/` | 육아비 계산기 | `대기` | 사용량 가정과 브랜드 차이 설명 보강 |
| 4 | `/tools/irp-pension-calculator/` | 연금/세제 계산기 | `대기` | 세액공제 기준과 한도 설명 보강 |
| 5 | `/tools/domestic-stock-capital-gains-tax/` | 세금 계산기 | `대기` | 과세 기준과 예외 설명 보강 |
| 6 | `/tools/fetal-insurance-calculator/` | 보험 비교 계산기 | `대기` | 보장 범위와 납입 예시 보강 |
| 7 | `/tools/apt-cheonyak-gajum-calculator/` | 부동산 정책 계산기 | `대기` | 청약 가점 항목별 기준 보강 |
| 8 | `/tools/retirement-fund-depletion/` | 장기 추정 계산기 | `대기` | 인출률, 수익률 민감도 해석 보강 |
| 9 | `/tools/savings-vs-etf-retirement/` | 투자 비교 계산기 | `대기` | 예금/ETF 가정과 위험 설명 보강 |
| 10 | `/tools/household-income/` | 소득 기준 계산기 | `대기` | 기준 중위소득 출처와 적용 예시 보강 |

## 페이지별 작업 체크리스트

각 페이지를 수정할 때 아래 순서로 진행한다.

- [ ] 현재 페이지 구조 확인: Astro, 데이터, 스크립트, SCSS 연결 상태 확인
- [ ] 도입 2문단 추가 또는 보강
- [ ] 계산 기준/가정/기준일 문단 추가
- [ ] 결과 해석 섹션 추가 또는 확장
- [ ] 현실적인 예시 2개 이상 추가
- [ ] FAQ 3개 이상 추가
- [ ] 내부 링크 3개 이상 추가
- [ ] 공식/시뮬레이션/참고 출처 표기 확인
- [ ] 모바일에서 긴 문장, 표, 카드 overflow 확인
- [ ] `npm run build` 성공 확인

## 권장 작업 배치

1회 작업 단위는 3~4페이지로 제한한다. 한 번에 너무 많은 페이지를 수정하면 빌드 실패나 내부 링크 누락 원인을 추적하기 어렵다.

권장 배치:
- 배치 1: `/`, `/tools/`, `/reports/`, `/about/`
- 배치 2: `/tools/national-pension-calculator/`, `/tools/parental-leave/`, `/tools/parental-leave-pay/`, `/tools/six-plus-six/`
- 배치 3: `/tools/single-parental-leave-total/`, `/tools/birth-support-total/`, `/tools/retirement/`, `/tools/salary/`
- 배치 4: `/tools/negotiation/`, `/tools/hyundai-bonus/`, `/tools/sk-hynix-bonus/`, `/tools/samsung-bonus/`
- 배치 5 이후: P1 목록 순서대로 3~4페이지씩 진행
