# AdSense 페이지 등급표 1차 분류

기준일: 2026-04-17

## 문서 목적
- 현재 `bigyocalc.com` 실제 페이지를 `A / B / C / D`로 1차 분류합니다.
- 이 분류는 `가치가 별로 없는 콘텐츠` 대응을 위한 실행 우선순위용입니다.
- 이번 판정은 저장소에서 확인 가능한 구조 신호를 기준으로 한 `정적 리뷰`입니다.

## 판정 기준
- `A`: 구조와 설명 밀도가 충분하고, 현재 상태로도 사이트 품질을 끌어올릴 가능성이 높음
- `B`: 기본 구조는 좋지만, 해설·예시·신뢰 문구·내부링크 보강이 필요함
- `C`: 허브/정책 페이지처럼 존재는 필요하지만 현재는 얇거나 디렉터리 느낌이 강함
- `D`: 삭제 또는 `noindex`를 우선 검토해야 할 수준

## 이번 1차 분류에서 본 구조 신호
- `SeoContent` 존재 여부
- `InfoNotice` 존재 여부
- FAQ/관련 링크 존재 여부
- `updatedAt`, `jsonLd`, `SummaryCards`, `ToolActionBar` 등 보조 신호
- 파일 길이와 섹션 밀도

## 요약
- `A`: 29개
- `B`: 28개
- `C`: 6개
- `D`: 0개

`D` 등급은 이번 정적 리뷰에서는 발견되지 않았습니다. 다만 `C` 등급 허브 페이지와 `B` 등급 구형 계산기 페이지가 누적되면 사이트 전체 인상에 불리할 수 있습니다.

---

## 1. 루트 / 신뢰 페이지

| 페이지 | 등급 | 이유 | 권장 조치 |
| --- | --- | --- | --- |
| `/` | B | 허브 기능과 신뢰 링크는 있으나, 사이트 목적·편집 기준·대표 진입 흐름 설명이 약함 | 홈 소개 문단과 대표 시나리오 큐레이션 강화 |
| `/about/` | B | 존재 자체는 좋지만 운영 기준과 데이터 검수 방식이 더 구체적이면 신뢰 신호가 강해짐 | 운영 목적, 업데이트 기준, 작성 원칙 추가 |
| `/contact/` | B | 필수 페이지로서 역할은 충분하지만 설명 밀도는 낮음 | 문의 유형, 응답 범위, 광고/제휴 문의 구분 보강 |
| `/privacy/` | B | 기본 정책 페이지 역할 수행 | 사용 중인 도구/쿠키/광고 고지 문구 구체화 |
| `/disclaimer/` | B | 참고용 계산 결과라는 점은 잘 드러남 | 공식 기준 확인 필요 상황 예시 추가 |
| `/404/` | C | 콘텐츠 품질과 직접 연관은 적지만 UX 차원에서 최소 안내 수준 | 관련 허브 링크 추가 정도면 충분 |

---

## 2. 허브 페이지

| 페이지 | 등급 | 이유 | 권장 조치 |
| --- | --- | --- | --- |
| `/tools/` | C | 계산기 수가 많지만 현재는 목록/검색 중심 성격이 강함 | 카테고리별 추천 흐름, 입문용 가이드, 대표 페이지 묶음 추가 |
| `/reports/` | C | 시리즈 정리는 좋지만 디렉터리형 인상이 남음 | 주제별 안내 문단, 대표 리포트 선정 이유, 내부 진입 경로 강화 |

---

## 3. 계산기 페이지

| 페이지 | 등급 | 이유 | 권장 조치 |
| --- | --- | --- | --- |
| `/tools/ai-stack-cost-calculator/` | A | 구조, FAQ, 안내, 관련 링크, 시나리오 구성이 강함 | 직군별 예시만 추가 보강 |
| `/tools/baby-growth-percentile-calculator/` | A | 정보 구조와 해설 밸런스가 좋음 | 해석 예시 1~2개 추가 |
| `/tools/birth-support-total/` | B | 유용하지만 페이지 길이와 해설 밀도가 비교적 얇음 | 실제 사례, 정책 예외사항, 관련 링크 강화 |
| `/tools/bonus-simulator/` | A | 비교 흐름과 결과 요약이 잘 잡혀 있음 | 기준일 표기 강화 |
| `/tools/child-tutoring-cost-calculator/` | A | FAQ와 관련 링크를 포함한 완성도가 높음 | 학년별 예시 보강 |
| `/tools/coin-tax-calculator/` | A | 세금 계산기 특성상 설명 구조가 잘 갖춰져 있음 | 예외 케이스 예시 추가 |
| `/tools/dca-investment-calculator/` | A | 입력-결과-해설 흐름이 안정적임 | 장기/단기 시나리오 예시 보강 |
| `/tools/diaper-cost/` | A | 실사용성, 비교 구조, 안내 요소가 좋음 | 브랜드 비교 해석 문단 보강 |
| `/tools/fetal-insurance-calculator/` | A | 정보 밀도와 안내 구조가 좋음 | 가입 시기별 사례 추가 |
| `/tools/fire-calculator/` | A | 분량과 섹션 밀도가 충분함 | 보수/공격 시나리오 예시 보강 |
| `/tools/formula-cost/` | A | 기저귀 계산기와 유사하게 실사용성이 높음 | 브랜드 선택 팁 강화 |
| `/tools/home-purchase-fund/` | A | 실전형 계산기로서 가치가 충분함 | 지역/주택 유형 사례 추가 |
| `/tools/household-income/` | A | 비교와 해석 포인트가 살아 있음 | 분포 읽는 법 보강 |
| `/tools/hyundai-bonus/` | B | 구조는 좋지만 회사별 보너스 페이지는 템플릿 반복 인상 위험이 있음 | 회사별 변수 설명과 사례 강화 |
| `/tools/national-pension-calculator/` | B | 내용은 풍부하지만 `SeoContent` 표준 구조와 관련 링크 연결이 약함 | 관련 계산기 링크, 결과 해석 문단, FAQ 재정리 |
| `/tools/negotiation/` | B | 핵심 기능은 명확하지만 짧고 구형 도구 느낌이 있음 | 협상 시나리오 2개, 결과 해석 보강 |
| `/tools/overseas-travel-cost/` | A | 입력과 결과 활용 가치가 크고 구조도 좋음 | 여행 유형별 예시 추가 |
| `/tools/parental-leave/` | B | 지원금 계산기로 유용하지만 설명 밀도는 더 키울 수 있음 | 지급 구조 설명과 예시 강화 |
| `/tools/parental-leave-pay/` | B | 기본 정보는 있으나 깊이는 다소 얕음 | 상한/하한 사례와 FAQ 보강 |
| `/tools/parental-leave-short-work-calculator/` | A | 대표 정책형 계산기로 구조 완성도가 높음 | 자주 틀리는 입력 안내 추가 |
| `/tools/pregnancy-birth-cost/` | A | 길이와 구성 모두 우수함 | 상황별 예산 예시 보강 |
| `/tools/retirement/` | B | 오래된 핵심 계산기지만 설명과 맥락은 더 필요함 | 퇴직금 해석, 세후/세전 차이 안내 추가 |
| `/tools/salary/` | B | 핵심 계산기이나 현재는 기능 중심 인상이 강함 | 인상률별 실수령 해석, 예시 추가 |
| `/tools/salary-tier/` | A | 차별화 포인트가 분명하고 구조가 좋음 | 데이터 범위와 한계 명시 강화 |
| `/tools/samsung-bonus/` | B | 페이지 품질은 나쁘지 않지만 반복 템플릿 위험이 있음 | 회사 고유 변수, 해석 예시 보강 |
| `/tools/single-parental-leave-total/` | B | 실사용성은 높지만 해설층이 더 두꺼워질 필요 | 현금흐름 읽는 법, 사례 추가 |
| `/tools/six-plus-six/` | B | 유용하지만 짧은 정책 계산기 인상 | 일반 육아휴직과의 선택 기준 강화 |
| `/tools/sk-hynix-bonus/` | B | 구조는 좋지만 템플릿 반복 리스크 존재 | 회사별 해석 포인트 보강 |
| `/tools/wedding-budget-calculator/` | A | 예산형 계산기로 완성도가 높음 | 예식 규모별 사례 보강 |
| `/tools/wedding-gift-break-even-calculator/` | A | 실사용성과 설명 밀도가 높음 | 지역/하객 규모 예시 추가 |

---

## 4. 리포트 페이지

| 페이지 | 등급 | 이유 | 권장 조치 |
| --- | --- | --- | --- |
| `/reports/baby-cost-2016-vs-2026/` | B | 구조는 좋지만 비교 해석을 더 밀도 있게 만들 수 있음 | 지원금 반영 해석 강화 |
| `/reports/baby-cost-guide-first-year/` | B | 유용한 가이드지만 대표 리포트로는 조금 더 두꺼워질 필요 | 시나리오 예시와 기준일 보강 |
| `/reports/bitcoin-gold-sp500-10year-comparison-2026/` | B | 흥미롭고 비교 가치가 높지만 해설 층을 더 키울 여지 | 투자 성향별 읽는 법 추가 |
| `/reports/construction-salary-bonus-comparison-2026/` | A | 구조, 분량, 해설 모두 강함 | 유지 |
| `/reports/elementary-school-ready-cost-2026/` | A | 분량과 실사용 가이드 측면에서 강함 | 유지 |
| `/reports/fetal-insurance-guide-2026/` | A | 대표 리포트급으로 구조가 좋음 | 출처 문구만 조금 더 강화 |
| `/reports/firefighter-salary-2026/` | A | 직업형 리포트로 완성도가 높음 | 유지 |
| `/reports/insurance-salary-bonus-comparison-2026/` | A | 비교와 해석이 잘 결합됨 | 유지 |
| `/reports/it-salary-top10/` | A | 공개 데이터 기반 비교 리포트로 가치가 높음 | 유지 |
| `/reports/it-si-sm-salary-comparison-2026/` | A | 세부 비교가 잘 살아 있음 | 유지 |
| `/reports/korean-movie-break-even-profit/` | B | 흥미롭지만 사이트 핵심 주제와의 연결성은 다소 약함 | 관련 투자/산업 해설 링크 보강 |
| `/reports/korea-rich-top10-assets/` | A | 차별화와 인터랙션이 좋음 | 출처 배지 더 명확히 |
| `/reports/large-company-salary-growth-by-years-2026/` | A | 연차별 비교가 실사용적이고 설명 밀도도 충분 | 유지 |
| `/reports/lee-jaemyung-government-officials-assets-salary-2026/` | A | 독자 가치가 분명한 비교 리포트 | 유지 |
| `/reports/national-pension-generational-comparison-2026/` | A | 정책성과 해설성이 함께 있음 | 유지 |
| `/reports/new-employee-salary-2026/` | A | 검색 수요와 리포트 품질 모두 높음 | 유지 |
| `/reports/nurse-salary-2026/` | A | 직업형 리포트로 구조가 잘 잡힘 | 유지 |
| `/reports/overseas-travel-cost-compare-2026/` | A | 실사용성, 도시 비교, FAQ까지 강함 | 유지 |
| `/reports/police-salary-2026/` | A | 공무원 계급형 리포트로 강함 | 유지 |
| `/reports/postpartum-center-cost-2026/` | B | 주제 가치는 매우 높지만 더 두꺼워질 여지가 있음 | 지역/등급 선택 기준과 사례 보강 |
| `/reports/salary-asset-2016-vs-2026/` | B | 흥미로운 비교지만 해설 밀도를 더 키울 수 있음 | 연봉 대비 체감 해석 보강 |
| `/reports/semiconductor-etf-2026/` | A | 구조와 차별성이 좋음 | 유지 |
| `/reports/semiconductor-value-chain/` | B | 설명형 가치가 높지만 투자/산업 연결 가이드를 더 키울 수 있음 | 초보자용 해설 보강 |
| `/reports/seoul-84-apartment-prices/` | A | 부동산 체감 비교가 강함 | 유지 |
| `/reports/seoul-apartment-jeonse-report/` | A | 실수요 관점 해설이 좋음 | 유지 |
| `/reports/seoul-housing-2016-vs-2026/` | B | 비교 리포트로서 기본은 좋으나 대표성은 더 키울 수 있음 | 체감 사례와 행동 가이드 보강 |
| `/reports/teacher-salary-2026/` | A | 분량과 구조 모두 강함 | 유지 |
| `/reports/us-rich-top10-patterns/` | A | 비교/패턴 분석 성격이 뚜렷함 | 출처 표시 보강 |
| `/reports/wedding-cost-2016-vs-2026/` | B | 읽을 가치는 충분하지만 선택 가이드가 더 필요 | 예산 등급별 행동 팁 추가 |

---

## 5. 우선 실행 순서

### 바로 보강할 `C`
1. `/tools/`
2. `/reports/`

### 바로 보강할 `B` 중 핵심
1. `/`
2. `/about/`
3. `/tools/national-pension-calculator/`
4. `/tools/salary/`
5. `/tools/retirement/`
6. `/tools/parental-leave-pay/`
7. `/reports/postpartum-center-cost-2026/`
8. `/reports/seoul-housing-2016-vs-2026/`
9. `/reports/salary-asset-2016-vs-2026/`
10. `/reports/wedding-cost-2016-vs-2026/`

## 6. 해석 메모
- 이번 1차 분류에서는 `도구/리포트 상세 페이지` 자체보다 `허브 페이지`가 더 취약하게 보였습니다.
- 계산기와 리포트 대부분은 이미 `B 이하로 떨어질 정도로 약한 상태`는 아닙니다.
- 따라서 전체 전략은 `얇은 상세 페이지를 대량 삭제`보다 `허브와 대표 B 페이지를 A로 끌어올리는 방식`이 더 적합합니다.
