# 비교계산소 웹 콘텐츠 기획서

## 미국 빅테크 2분기 실적 2026 완전 정리 리포트

> 상태: 기획 초안 (사용자 검토 대기)
> 작성일: 2026-08-07
> 작성자: 비교계산소 편집부
> 다음 산출물: `docs/design/202608/us-bigtech-q2-2026-earnings-design.md`

---

## 1. 기본 정보

| 항목 | 내용 |
| --- | --- |
| Title(안) | 미국 빅테크 2분기 실적 2026 완전 정리 \| 누가 오르고 누가 내렸나 |
| Type | report (인터랙티브 리포트, 선택→비교→해석) |
| Category | `asset` (투자·재무) |
| Slug/Path | `/reports/us-bigtech-q2-2026-earnings/` |
| 핵심 메시지 | "매출·EPS는 대부분 컨센서스를 넘겼는데, AI 설비투자(capex) 가이던스 때문에 주가는 오히려 급락한 기업이 많다" |
| 주요 타깃 | 미국 주식(나스닥) 투자자, 매그니피센트7·AI 관련주 보유자, "애플 실적", "구글 실적 주가" 등 개별 실적 검색 유입 |
| 반복 방문 포인트 | 엔비디아 실적 발표(2026-08-26) 이후 데이터 업데이트, 다음 분기(Q3 2026) 실적 시즌 재검색 |
| 내부 링크 | `semiconductor-etf-2026`, `korea-semiconductor-etf-2026`, `ai-stocks-h1-2026`, `semiconductor-stocks-h1-2026`, `bitcoin-gold-sp500-10year-comparison-2026` |
| 우선순위 | 상 — 2026-07-16~08-04 실적 시즌 직후, 검색 수요 진행 중 |

---

## 2. 배경 및 목적

### 2-1. 왜 이 콘텐츠인가

2026년 7~8월, 나스닥 시가총액 상위 빅테크 대부분이 2026년 2분기(calendar Q2, 4~6월) 실적을 발표했다. 개별 기업 실적 기사는 매체마다 흩어져 있고, 특히 아래 두 가지를 종합적으로 짚어주는 콘텐츠가 부족하다.

1. **"실적은 좋은데 왜 주가는 떨어졌나"** — 알파벳·메타·애플은 매출/EPS가 컨센서스를 상회했음에도 주가가 급락했다. 반대로 마이크로소프트는 가이던스를 유지만 했는데 주가가 급등했다. 이 엇갈림의 공통 원인(AI capex 가이던스 상향 vs 재확인)을 짚어주는 기사가 드물다.
2. **"아마존·알파벳 EPS 서프라이즈, 진짜인가"** — 아마존 EPS $5.75, 알파벳 EPS $9.11은 각각 Anthropic 지분 평가이익($534억), 지분증권 평가이익($990억)이라는 일회성·비영업 요인이 크게 반영된 수치다. 헤드라인만 보면 오해하기 쉽다.

비교계산소는 **①9개사 실적 팩트 표준화 비교 + ②주가 반응과 capex 가이던스 상관관계 해석 + ③일회성 이익 주의 표시**를 한 페이지에서 제공해 차별화한다.

### 2-2. 콘텐츠 수명

- 단기(D+0~14): 실적 시즌 직후 검색 최고조
- 중기(2026-08-26 전후): 엔비디아 실적 발표 후 데이터 추가, 9개→10개사로 갱신
- 장기: 다음 분기(Q3 2026, 10~11월 발표) 실적 시즌마다 유사 포맷으로 재사용 가능한 템플릿 리포트

### 2-3. 데이터 정확성 원칙

- 모든 수치는 각 기업의 공식 IR/보도자료, SEC 8-K, 또는 Reuters/CNBC/Bloomberg 등 1차·준1차 출처 기준으로만 기재한다.
- 엔비디아는 2026-08-07 기준 미발표(발표 예정일 2026-08-26)이므로 **수치를 절대 기재하지 않고 "발표 예정"으로만 표기**한다.
- 아마존·알파벳처럼 GAAP EPS에 일회성 지분평가이익이 크게 반영된 경우, 헤드라인 EPS와 함께 **일회성 요인 설명을 반드시 병기**한다.
- 컨센서스 대비 beat/miss는 조사 시점 기준 보도된 컨센서스 수치이며, 추후 소급 수정될 수 있다는 점을 방법론 섹션에 명시한다.

---

## 3. 검증된 데이터 (WebSearch/WebFetch 1차 소스 대조 완료)

| 기업 | 발표일 | 매출 (YoY) | 컨센서스 대비 | EPS (컨센서스 대비) | 실적 발표 후 주가 반응 | capex 가이던스 |
| --- | --- | --- | --- | --- | --- | --- |
| Apple | 2026-07-30 | $109.4B (+16%) | 매출 beat | $2.02 (beat, 컨센서스 ~$1.89) | -6.65% (시간외, 16개월래 최대 낙폭) | "AI 인프라 투자 대폭 확대" 시사(구체 수치 미공개) |
| Microsoft | 2026-07-29 | $90.01B (+18%) | 매출 beat | non-GAAP $4.74 (beat, 컨센서스 ~$4.24) | +8~9% (시간외) | FY2027 $255~260B (+35%) |
| Alphabet | 2026-07-22 | $119.8B (+24%) | 매출 beat | GAAP $9.11(일회성 지분평가익 반영) / 조정 EPS $2.85(소폭 미달) | -6%대 | 2026년 $195~205B로 상향(기존 $180~190B) |
| Amazon | 2026-07-30 | $200.6B (+20%) | 매출 beat | $5.75 (Anthropic 지분평가익 $534억 반영, 컨센서스 $1.82 상회) | +9% (시간외) | 2026년 ~$220B로 상향(기존 ~$200B) |
| Meta | 2026-07-29 | $60.8B (+28%) | 매출 beat | $6.18 (miss, 컨센서스 ~$7.22 — 소송충당금+구조조정비용) | -9.64% (시간외) | 2026년 $130~145B로 상향, FCF $7.8억으로 급감 |
| Nvidia | **미발표** (2026-08-26 예정) | — | — | — | — | — |
| Tesla | 2026-07-22 | $28.24B (+26%) | 매출 beat | $0.33 (miss, 컨센서스 $0.49) | -1.29%(정규장) / -3.92%(시간외) | 분기 약 $25B, "향후 2~3년 지속 증가" |
| Netflix | 2026-07-16 | $12.56B (+13%) | 소폭 미달($12.58B 예상) | $0.80 (근소 beat, 컨센서스 $0.79) | -9% (시간외), 익일 52주 신저가 | 별도 AI 인프라 capex 공시 없음 |
| AMD | 2026-08-04 | $11.5B (+50%, 역대 최고) | 매출 beat | non-GAAP $1.66 (beat, 컨센서스 ~$1.62) | 정규장 +7% → 시간외 -8.94% (뉴스에 팔기) | 별도 수치 공시 없음(데이터센터 매출 +107%) |

출처(대표): [Apple Newsroom](https://www.apple.com/newsroom/2026/07/apple-reports-third-quarter-results/), [Microsoft IR](https://www.microsoft.com/en-us/investor/earnings/fy-2026-q4/press-release-webcast), [Alphabet Q2 2026 Earnings Release](https://s206.q4cdn.com/479360582/files/doc_financials/2026/q2/2026q2-alphabet-earnings-release.pdf), [Amazon SEC 8-K](https://www.sec.gov/Archives/edgar/data/1018724/000101872426000024/amzn-20260630xex991.htm), [Meta Q2 2026 실적 보도(TradingKey)](https://www.tradingkey.com/analysis/stocks/us-stocks/262063667-meta-stock-crashing-after-q2-2026-earnings-eps-miss-capex-tradingkey), [Tesla Q2 2026(Electrek)](https://electrek.co/2026/07/22/tesla-tsla-q2-2026-financial-results/), [Netflix Q2 2026 Shareholder Letter](https://s22.q4cdn.com/959853165/files/doc_financials/2026/q2/FINAL-Q2-26-Shareholder-Letter.pdf), [AMD Q2 2026(Yahoo Finance)](https://finance.yahoo.com/markets/stocks/articles/amd-q2-2026-earnings-record-202927876.html), [Nvidia 실적 발표 일정(StreetInsider)](https://www.streetinsider.com/Corporate+News/Nvidia+schedules+Q2+fiscal+2027+earnings+call+for+August+26/26836264.html)

### 3-1. 시장 전체 맥락

- 실적 시즌 진행 중 나스닥100 변동성 지수가 약 14개월래 최고치 기록
- 매그니피센트7은 2026년 YTD 기준 S&P500(+9%대)을 하회하며 그룹 전체로는 약보합(-1%대)
- capex 가이던스를 **상향**한 기업(알파벳·아마존·메타)은 실적 beat에도 주가 하락, capex를 **재확인만** 한 마이크로소프트는 주가 급등 — "AI 투자 자체"보다 "가이던스가 예상보다 더 올라가는지"에 시장이 더 민감하게 반응하는 패턴
- 출처: [CNBC — Mag7 실적이 뒤흔든 한 주](https://www.cnbc.com/2026/07/31/this-weeks-earnings-scrambled-everything-we-knew-about-the-mag-7.html)

---

## 4. 콘텐츠 구성 방향

- 리포트형(계산기 아님): 기업 선택 탭/셀렉트 → 상세 실적 카드 → 종합 비교(막대바) → 패턴 해석 → FAQ
- 팩트(매출·EPS·발표일)와 해석(왜 주가가 이렇게 움직였나)을 섹션으로 명확히 분리
- 일회성 이익이 반영된 아마존·알파벳 EPS는 카드 내 별도 주의 배지로 표시
- 엔비디아는 카드에 포함하되 "발표 예정" 상태로 비활성 처리 (2026-08-26 이후 데이터 추가 예정임을 명시)

## 5. 리스크/제약

- 실적 수치는 향후 정정/컨센서스 소급 수정 가능성 있음 → "조사 시점 기준" 명시 필수
- 투자 조언으로 오인되지 않도록 InfoNotice에 "투자 판단과 책임은 본인에게 있습니다" 명문화
- 아마존/알파벳 EPS의 일회성 요인은 콘텐츠 전체에서 최소 2회(카드+FAQ) 반복 고지

---

## 6. 다음 단계

1. 사용자 검토 및 승인
2. `docs/design/202608/us-bigtech-q2-2026-earnings-design.md` 설계 문서 작성
3. 데이터 파일 → 페이지 → 스크립트 → 스타일 순으로 구현
4. `npm run build` 확인 후 `DEPLOY_CHECKLIST.md` 기준 점검
