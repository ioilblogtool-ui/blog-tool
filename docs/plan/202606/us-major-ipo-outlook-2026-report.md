# 2026 미국 대형 IPO 전망 리포트

## 개요
- slug: `us-major-ipo-outlook-2026`
- 형태: `/reports/` 인터랙티브 리포트 (정적 섹션, SpaceX IPO 리포트와 동일 패턴)
- 목적: 미국 비상장 대형 기업(Stripe, Databricks, Klarna, Discord, Canva, Cerebras, Plaid 등)의 추정 기업가치·사업 개요·IPO 추진 현황을 한 화면에서 비교
- 타겟: 미국 주식/IPO에 관심 있는 국내 개인 투자자

## 핵심 원칙 (REPORT_CONTENT_GUIDE 기준)
- 모든 기업가치·IPO 일정은 "추정", "보도 기준", "루머"로 명확히 라벨링
- **시점 고지 필수**: 본 리포트는 2025년 보도 자료 기준으로 작성되었으며, 실제 상장 여부·시점은 이후 변경되었을 수 있음을 InfoNotice + SeoContent에 명시
- 한국 투자자가 미국 비상장주식에 직접 투자하는 것은 사실상 불가능 → 간접 노출(상장 후 직접투자, 관련 ETF) 중심으로 안내
- 특정 종목 매수 추천 금지, 정보 제공 목적 명시

## 페이지 구성 (IA)
1. CalculatorHero
2. InfoNotice (시점 고지 + 추정치 안내)
3. KPI 그리드 (후보 기업 수, 합산 추정 밸류, 최대 밸류 기업, 핀테크 비중 등)
4. 기업별 카드 그리드 (8개사: Stripe, Databricks, Klarna, Canva, Discord, Cerebras, Plaid, Chime)
   - 섹터, 추정 밸류, 사업 요약, IPO 현황, 신뢰도 배지
5. 밸류에이션 비교 바 차트 (가로 바, 기업가치 순)
6. 섹터 분포 비교
7. IPO 현황/일정 비교 (상태별 카드 + 신뢰도 배지)
8. 한국 투자자 관점 (상장 후 직접투자 방법, 관련 ETF)
9. 관련 리포트 링크
10. SeoContent (FAQ + 작성 기준)

## 데이터/구현 파일
- `src/data/usMajorIpoOutlook.ts`
- `src/pages/reports/us-major-ipo-outlook-2026.astro`
- `src/styles/scss/pages/_us-major-ipo-outlook-2026.scss` (prefix: `uip-`)
- `src/data/reports.ts` 등록 (order ~53)
- `src/styles/app.scss` `@use` 추가
- `public/sitemap.xml` 항목 추가

## 관련 링크 후보
- `/reports/spacex-ipo-outlook-2026/`
- `/tools/etf-vs-direct-stock-10year-2026/`
- `/tools/us-stock-korean-real-return-2026/`
