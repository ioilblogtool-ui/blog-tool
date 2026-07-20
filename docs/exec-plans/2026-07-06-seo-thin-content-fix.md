# [2026-07-06] 구글 색인 미생성 — SeoContent 얇은 콘텐츠 보강 실행 계획

> **상태: 보류 (2026-07-06) — 원인 이론 반박됨, 자연 색인 대기 중.** 아래 "최종 결론" 참고.

## 목표
구글 Search Console에서 "크롤링됨 - 현재 색인이 생성되지 않음" 246개 페이지 문제를, `docs/GOOGLE_SEO_RULES.md` 기준(intro 5문단·800자 이상, FAQ 5개 이상)에 맞춰 SeoContent를 보강해 해결한다. **→ (2026-07-06 재검증 결과) 이 원인 가설은 데이터로 반박됨. 아래 "최종 결론" 참고.**

## 최종 결론 (2026-07-06, 3차 재검증)

색인된 페이지군과 미색인 페이지군의 SeoContent 분량을 직접 비교한 결과:

| 그룹 | 평균 글자수 | 평균 문단수 |
|---|---|---|
| 색인됨 (GSC "색인 생성됨" 20개 중 측정 가능 17개) | 634자 | 3.8문단 |
| 색인 안 됨 (246개 중 측정 가능 229개) | 647자 | 4.08문단 |

**거의 동일 — 오히려 미색인 그룹이 근소하게 더 높음.** `teacher-salary-2026`(329자·3문단)처럼 매우 얇은 페이지도 색인이 되는 반면, 600~1200자짜리 페이지들이 다수 미색인 상태. **즉 "SeoContent가 얇아서 색인이 안 된다"는 가설은 이 사이트의 실제 데이터로 반박된다.**

대신 근거 있는 대안 가설: 미색인 246개는 "최종 크롤링" 날짜가 최근(6/29~6/30)에 몰려있고, 색인된 20개는 크롤링 날짜가 더 오래전(5월~6월 초)까지 넓게 퍼져있음 — **콘텐츠 품질보다 "최근에 크롤링됐지만 아직 색인 평가 큐를 못 돈 시간차(크롤 예산 적체)" 문제일 가능성이 높음.** 사이트에 계산기·리포트가 300개 넘고 계속 늘어나는 중이라 크롤 예산이 페이지 생성 속도를 못 따라가는 것으로 추정.

### 결정 (사용자, 2026-07-06)
**"기다려 보자"** — 지금 당장 콘텐츠 보강 작업에 들어가지 않고, 자연스럽게 크롤 큐가 소화되며 색인되는지 지켜보기로 함. 아래 우선순위 목록·작업 순서는 참고용으로 남겨두되 **당장 실행하지 않음**.

향후 재검토 시점: 며칠~몇 주 후 GSC에서 "크롤링됨-미색인" 246개 수치 변화를 다시 확인하고, 줄어들지 않으면 그때 콘텐츠 보강 또는 GSC 수동 색인 요청을 고려.

## 배경 / 진단
- 전체 tools/reports 페이지 326개를 스캔한 결과 **297개(91%)가 기준 미달**(intro 5문단 미만 또는 800자 미만)
- 사용자가 캡처한 GSC "크롤링됨-미색인" 246개 목록 중 242개를 매칭해보니 **213개(88%)가 정확히 이 thin-content 문제와 일치**
- 예외 22개는 800자·5문단을 이미 넘기는데도 미색인 — 유사 템플릿 리포트 반복(예: "X vs Y 비교" 시리즈)으로 인한 중복 콘텐츠 신호일 가능성, 별도 이슈로 관리
- 원인: 계산기·차트는 JS 렌더링이라 구글 크롤러가 못 읽고, 실제로 읽는 텍스트는 `SeoContent` 컴포넌트의 `intro`/`faq`뿐인데 대부분 3~4문장(300~500자)만 채워져 있었음
- 작업 중 새로 만든 `samsung-q2-earnings-bonus-outlook-2026` 리포트도 122자·1문단으로 동일 문제가 있어 즉시 5문단·947자로 수정함 (참고 사례)

## 범위 (In Scope)
- 아래 우선순위 목록(구글 실제 클릭수 TOP 30 기준)의 SeoContent `intro`를 각 페이지 데이터에 있는 실제 수치를 근거로 2~3문단 추가 보강
- 문단은 복사-붙여넣기 padding이 아니라 페이지별 실제 데이터(순위, 격차, 비율, 금액) 기반으로 작성
- 보강 후 `npm run build` 통과 확인, 가능하면 브라우저 렌더링 확인

## 범위 아님
- 246개 전체 일괄 처리 (규모상 여러 세션에 걸쳐 진행)
- "유사 템플릿 중복 콘텐츠" 22개 건 — 별도 분석 필요, 이번 배치에는 미포함
- Google Search Console 재색인 요청 직접 수행 (사용자 소관)

## 우선순위 — 구글 실제 클릭수 TOP 30 (2026-07-06 기준)

정렬 기준: 클릭수 내림차순 (검색 웹문서 TOP 30, PC+Mobile). `상태`는 2026-07-06 기준 코드 스캔 결과.

| # | URL | 클릭 | 노출 | CTR% | 상태 | 현재 분량 | 파일 |
|---|---|---|---|---|---|---|---|
| 1 | [x] `/reports/teacher-salary-2026/` | 1434 | 31320 | 4.6 | **이미 색인됨 — 대상 아님** | 329자 3문단, 콘텐츠는 얇지만 색인 문제 아님 | `src/pages/reports/teacher-salary-2026.astro` |
| 2 | [ ] `/tools/samsung-bonus/` | 636 | 13545 | 4.7 | THIN | 647자 4문단 | `src/pages/tools/samsung-bonus.astro` |
| 3 | [x] `/reports/construction-salary-bonus-comparison-2026/` | 365 | 3886 | 9.4 | **이미 색인됨 — 대상 아님** | 609자 4문단, 콘텐츠는 얇지만 색인 문제 아님 | `src/pages/reports/construction-salary-bonus-comparison-2026.astro` |
| 4 | [ ] `/reports/samsung-ds-bonus-calculation-guide/` | 332 | 10179 | 3.3 | THIN | 709자 4문단 | `src/pages/reports/samsung-ds-bonus-calculation-guide.astro` |
| 5 | [ ] `/tools/minimum-wage-2026/` | 331 | 58848 | 0.6 | THIN | 709자 4문단 | `src/pages/tools/minimum-wage-2026.astro` |
| 6 | [ ] `/compare/bonus/` | 318 | 10349 | 3.1 | THIN | 689자 5문단 | `src/pages/compare/bonus/index.astro` (데이터: `src/data/compareBonus.ts` `BONUS_COMPARE_SEO_INTRO`) |
| 7 | [ ] `/tools/apartment-holding-tax/` | 306 | 8854 | 3.5 | THIN | 911자 4문단 (문단 수 부족) | `src/pages/tools/apartment-holding-tax.astro` |
| 8 | [x] `/reports/worldcup-squad-salary-total-comparison-2026/` | 302 | 4432 | 6.8 | **이미 색인됨 — 대상 아님** | 370자 4문단, 콘텐츠는 얇지만 색인 문제 아님 | `src/pages/reports/worldcup-squad-salary-total-comparison-2026.astro` |
| 9 | [x] `/reports/sk-hynix-shuttle-real-estate-2026/` | 273 | 6325 | 4.3 | OK | 856자 5문단 — 기준 충족, 재검토 불필요 | `src/pages/reports/sk-hynix-shuttle-real-estate-2026.astro` |
| 10 | [ ] `/tools/bonus-after-tax-calculator/` | 270 | 5808 | 4.6 | THIN | 1105자 4문단 (문단 수 부족) | `src/pages/tools/bonus-after-tax-calculator.astro` |
| 11 | [ ] `/tools/teacher-salary-calculator/` | 256 | 5512 | 4.6 | THIN | 681자 4문단 | `src/pages/tools/teacher-salary-calculator.astro` |
| 12 | [ ] `/reports/professor-salary-2026/` | 254 | 1888 | 13.5 | THIN | 528자 4문단 | `src/pages/reports/professor-salary-2026.astro` |
| 13 | [x] `/reports/national-assembly-wealth-2026/` | 237 | 472 | 50.2 | **이미 색인됨 — 대상 아님** | 739자 5문단, 콘텐츠는 약간 부족하지만 색인 문제 아님 | `src/pages/reports/national-assembly-wealth-2026.astro` |
| 14 | [ ] `/reports/local-election-seoul-2026/` | 229 | 2265 | 10.1 | THIN | 459자 8문단 (글자수 부족, 문단은 충분) | `src/pages/reports/local-election-seoul-2026.astro` |
| 15 | [ ] `/reports/seoul-mayor-candidate-assets-2026/` | 213 | 2004 | 10.6 | THIN | 579자 5문단 (글자수 부족) | `src/data/seoulMayorCandidateAssets2026.ts` `seoIntro` |
| 16 | [x] `/tools/sk-hynix-bonus/` | 211 | 3568 | 5.9 | **이미 색인됨 — 대상 아님** | 622자 4문단, 콘텐츠는 얇지만 색인 문제 아님 | `src/pages/tools/sk-hynix-bonus.astro` |
| 17 | [ ] `/reports/police-salary-2026/` | 209 | 4977 | 4.2 | THIN | 473자 4문단 | `src/pages/reports/police-salary-2026.astro` |
| 18 | [ ] `/reports/military-salary-2026/` | 207 | 5460 | 3.8 | THIN | 444자 4문단 | `src/pages/reports/military-salary-2026.astro` |
| 19 | [ ] `/tools/overtime-pay-calculator/` | 194 | 6076 | 3.2 | THIN | 1219자 4문단 (문단 수 부족) | `src/pages/tools/overtime-pay-calculator.astro` |
| 20 | [ ] `/reports/lee-kang-in-psg-salary-2026/` | 187 | 21478 | 0.9 | THIN | 695자 5문단 (글자수 부족) | `src/pages/reports/lee-kang-in-psg-salary-2026.astro` |
| 21 | [ ] `/reports/stock-brokerage-fee-comparison-2026/` | 183 | 6798 | 2.7 | THIN | 640자 4문단 | `src/pages/reports/stock-brokerage-fee-comparison-2026.astro` |
| 22 | [x] `/reports/baby-formula-brand-cost-comparison-2026/` | 176 | 2159 | 8.2 | OK | 840자 5문단 — 기준 충족, 유사 템플릿 이슈만 별도 확인 | `src/pages/reports/baby-formula-brand-cost-comparison-2026.astro` |
| 23 | [ ] `/reports/kleague-salary-comparison-2026/` | 175 | 15219 | 1.1 | THIN | 373자 3문단 | `src/pages/reports/kleague-salary-comparison-2026.astro` |
| 24 | [ ] `/reports/kbo-salary-comparison-2026/` | 170 | 1167 | 14.6 | THIN | 381자 3문단 | `src/pages/reports/kbo-salary-comparison-2026.astro` |
| 25 | [ ] `/reports/samsung-shuttle-real-estate-2026/` | 165 | 1931 | 8.5 | THIN | 682자 4문단 | `src/pages/reports/samsung-shuttle-real-estate-2026.astro` |
| 26 | [ ] `/reports/korea-football-legends-salary-comparison-2026/` | 150 | 17339 | 0.9 | THIN | 674자 4문단 | `src/pages/reports/korea-football-legends-salary-comparison-2026.astro` |
| 27 | [ ] `/reports/new-employee-salary-2026/` | 138 | 3352 | 4.1 | THIN | 532자 4문단 | `src/pages/reports/new-employee-salary-2026.astro` |
| 28 | [ ] `/reports/corporate-bonus-comparison-2026/` | 127 | 7485 | 1.7 | THIN | 518자 4문단 | `src/pages/reports/corporate-bonus-comparison-2026.astro` |
| 29 | [ ] `/reports/sk-hynix-bonus-2027/` | 127 | 1826 | 7.0 | THIN | 534자 4문단 | `src/pages/reports/sk-hynix-bonus-2027.astro` |
| 30 | [ ] `/tools/real-estate-acquisition-tax/` | 113 | 2328 | 4.9 | THIN | 556자 5문단 (글자수 부족) | `src/pages/tools/real-estate-acquisition-tax.astro` |

**요약 (수정됨, 2026-07-06 2차): 30개 중 실제 "색인 미생성" 대상은 23개.**
- 2개(#9, #22)는 콘텐츠 기준 충족 + 이미 색인됨 → 이 작업 대상 아님
- 5개(#1, #3, #8, #13, #16)는 사용자가 GSC "색인 생성됨" 탭에서 직접 확인 — 원래 246개 미색인 목록에도 없었던 항목으로, 클릭 순위 목록에서 그대로 가져오면서 재필터링을 안 해 잘못 포함시켰음 (아래 메모 참고)
- 나머지 23개만 실제 작업 대상

## 작업 순서 (보류 중 — 참고용)
1. [ ] (보류) 위 목록 순서대로(클릭 많은 것부터) 각 페이지의 intro에 실제 데이터 기반 문단 2~3개 추가해 5문단·800자 이상으로 보강
2. [ ] (보류) 보강할 때마다 `npm run build`로 에러 확인
3. [ ] (보류) 246개 목록 재확인 시점에 수치 변화 없으면 재개
4. [ ] #9, #22 등 "OK인데 미색인" 페이지는 별도로 유사 템플릿/중복 콘텐츠 여부 검토 (여전히 유효한 별도 관찰 포인트)

## 완료 기준 (보류 해제 시 적용)
- [ ] 며칠~몇 주 후 GSC "크롤링됨-미색인" 246개 수치 재확인 — 자연 감소 여부 확인
- [ ] 감소하지 않으면: 목록 재개해 intro 5문단·800자 이상으로 보강
- [ ] 보강 시 `npm run build` 통과 확인

## 메모
- 2026-07-06: 진단 확정, GSC 클릭 TOP 30 기준 우선순위 목록 작성. 아직 실제 보강 작업은 시작 전 (사용자 요청으로 "기록만" 진행).
- 2026-07-06 (2차): 사용자가 GSC "색인 생성됨" 20개 목록을 제시하며 `teacher-salary-2026`, `sk-hynix-bonus`, `construction-salary-bonus-comparison-2026`이 이미 색인됐음을 확인시켜줌. 재검증 결과 이 3개 + `worldcup-squad-salary-total-comparison-2026`, `national-assembly-wealth-2026`까지 총 5개가 애초 246개 "크롤링됨-미색인" 목록에 없었던 항목으로 확인됨.
  - 원인: TOP 30 우선순위 표를 만들 때 "구글 실제 클릭수" 리스트(Search Performance 리포트)를 그대로 썼고, 이 목록을 원래의 246개 미색인 리스트와 다시 교차 검증하지 않음. 클릭이 있다는 것 자체가 이미 색인됐다는 신호인데 이를 놓침.
  - 조치: 위 표에서 5개 항목을 "이미 색인됨 — 대상 아님"으로 표시. 실제 작업 대상은 23개로 축소.
  - 교훈: 앞으로 우선순위 목록은 항상 원본 "크롤링됨-미색인" 246개 목록에 포함되는지 먼저 필터링한 뒤 클릭수로 정렬할 것.
- 2026-07-06 (3차, 최종): 사용자 질문("색인된 애랑 안 된 애 차이 있어?")을 계기로 색인됨 20개 vs 미색인 246개의 SeoContent 분량을 직접 비교. 두 그룹 평균이 634자/3.8문단 vs 647자/4.08문단으로 거의 동일해 **thin-content 가설 자체가 반박됨**. 크롤링 날짜 패턴상 "크롤 예산 적체(시간차)" 가설이 더 설득력 있음. 사용자 결정: "기다려 보자" — 작업 보류, 며칠~몇 주 후 GSC 수치 재확인 후 재검토.
