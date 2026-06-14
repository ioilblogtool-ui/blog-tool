# 미국 빅테크 6개사 직급별 연봉 계산기 + 비교 리포트 기획 (2026)

## 1. 배경 및 목적

- **계기**: levels.fyi 기준 엔비디아·애플·아마존·마이크로소프트·테슬라·오라클의 직급(레벨)별 연봉 데이터를 한국 사용자에게 원화로 환산해 제공
- **목적**:
  1. "OO 연봉 레벨", "OO 이직 연봉", "엔비디아 연봉 계산기" 등 회사명 + 연봉 키워드 SEO 트래픽 확보
  2. 빅테크 이직/취업 준비자, 미국 취업 관심층, IT 업계 종사자의 비교 콘텐츠 수요 충족
  3. 기존 `IT_TOP10`(국내 IT 기업) 콘텐츠와 자연스럽게 연결되는 "글로벌 vs 국내 연봉 비교" 내부 링크 허브 형성
- **타겟 사용자**: 미국 빅테크 이직 준비자, 해외 취업 관심 개발자/엔지니어, "내 연봉이 글로벌 기준 어느 정도인지" 궁금한 국내 IT 종사자

## 2. 전체 구조 (총 8페이지 + 공유 데이터 1개)

| 유형 | 슬러그 | 설명 |
|---|---|---|
| 계산기(Tool) | `tools/us-bigtech-salary-by-level-calculator` | 회사 + 레벨 선택 → 총보상(Base/Stock/Bonus) 원화 환산 |
| 리포트 | `reports/nvidia-salary-by-level-2026` | 엔비디아 레벨별 연봉 정리 |
| 리포트 | `reports/apple-salary-by-level-2026` | 애플 레벨별 연봉 정리 |
| 리포트 | `reports/amazon-salary-by-level-2026` | 아마존 레벨별 연봉 정리 |
| 리포트 | `reports/microsoft-salary-by-level-2026` | 마이크로소프트 레벨별 연봉 정리 |
| 리포트 | `reports/tesla-salary-by-level-2026` | 테슬라 레벨별 연봉 정리 |
| 리포트 | `reports/oracle-salary-by-level-2026` | 오라클 레벨별 연봉 정리 |
| 허브 리포트 | `reports/us-bigtech-salary-comparison-2026` | 6개사 동급 레벨 비교 + 전체 허브 |

- 데이터 파일: `src/data/usBigTechSalaryByLevel.ts` 1개에 6개사 공통 스키마로 관리
- 6개 회사 리포트는 동일 템플릿(컴포넌트 구조 공유) + 회사별 데이터만 다르게 렌더링 → 유지보수 비용 최소화

## 3. 공통 데이터 스키마 (`usBigTechSalaryByLevel.ts`)

```ts
export type BigTechCompanyId =
  | "nvidia" | "apple" | "amazon" | "microsoft" | "tesla" | "oracle";

export type CompTier = "entry" | "mid" | "senior" | "staff" | "principal" | "distinguished";

export interface BigTechLevelEntry {
  tier: CompTier;                 // 통일 비교용 등급 (회사간 비교 기준)
  levelLabel: string;             // 회사 자체 레벨 표기 (예: "L5", "ICT4", "63")
  roleExample: string;            // 예시 직무 (예: "Senior Software Engineer")
  yearsExperience: string;        // 참고 연차 범위 (예: "5~8년")
  baseUsd: number;                // 기본급 (연, USD)
  stockUsd: number;               // RSU 등 주식 보상 (연 환산, USD)
  bonusUsd: number;                // 보너스 (연, USD)
  totalUsd: number;                // 총보상 (USD) = base+stock+bonus
  totalKrw: number;                // 원화 환산 (환율 1,400원 기준)
}

export interface BigTechCompanyConfig {
  id: BigTechCompanyId;
  name: string;                   // "엔비디아"
  nameEn: string;                 // "NVIDIA"
  logoSlug?: string;
  industrySummary: string;        // 회사/보상 구조 한줄 설명
  stockNote: string;               // 스톡 베스팅 구조 설명 (4년 베스팅 등)
  levels: BigTechLevelEntry[];     // 레벨별 데이터 (5~7개 행)
  sourceNote: string;              // "levels.fyi 2025년 하반기 데이터 기준"
  caution: string;                 // 회사별 주의사항
  detailHref: string;              // 해당 회사 리포트 경로
}

export const EXCHANGE_RATE_KRW = 1400; // 1 USD = 1,400원 가정 (사이트 공통 기준)

export const COMP_TIER_LABELS: Record<CompTier, string> = {
  entry: "엔트리 (신입~1~2년)",
  mid: "미드 (3~5년)",
  senior: "시니어 (5~8년)",
  staff: "스태프 (8~12년)",
  principal: "프린시플 (12년+)",
  distinguished: "디스팅귀시드/펠로우 (최상위)",
};

export const BIGTECH_COMPANIES: BigTechCompanyConfig[] = [ /* 6개사 데이터 */ ];
```

### 3-1. 레벨 매핑 가이드 (구현 시 levels.fyi 최신 데이터로 검증 필요)

회사마다 레벨 체계가 달라 `tier`(통일 등급)로 비교 기준을 맞추고, `levelLabel`에 회사 고유 표기를 남긴다.

| tier | NVIDIA | Apple | Amazon | Microsoft | Tesla | Oracle |
|---|---|---|---|---|---|---|
| entry | IC2 | ICT2 | L4 (SDE I) | 59 | Engineer | IC2 |
| mid | IC3 | ICT3 | L5 (SDE II) | 61 | Senior Engineer | IC3 |
| senior | IC4 | ICT4 | L6 (Senior SDE) | 62 | Staff Engineer | IC4 |
| staff | IC5 | ICT5 | L7 (Principal) | 63~64 | Senior Staff | IC5 |
| principal | IC6 | ICT6 | L8 (Senior Principal) | 65~66 | Principal | IC6 |
| distinguished | IC7+ | (드묾) | L10+ | 67+ | Distinguished | (드묾) |

> **주의**: 테슬라·오라클은 levels.fyi 표본이 적고 레벨 체계가 비공식적이라 "entry~principal" 4단계만 채우고 distinguished는 생략하거나 "데이터 부족" 처리. 실제 구현 단계에서 levels.fyi 최신 페이지를 확인해 `baseUsd`/`stockUsd`/`bonusUsd` 수치를 갱신한다.

## 4. 페이지별 상세 IA

### 4-1. 회사별 리포트 페이지 (6개, 동일 템플릿)

레이아웃: `TimelineToolShell` 또는 일반 리포트 레이아웃(`report-page` + `SeoContent`) — IPO 리포트 패턴 참고

1. CalculatorHero — "{회사명} 연봉 레벨별 정리 2026"
2. InfoNotice — "levels.fyi 등 공개 데이터 기반 추정치, 실제 오퍼는 협상/시기/환율에 따라 다름" + 환율 1,400원 기준 고지
3. KPI 그리드 — 최저~최고 총보상(원화), 평균 스톡 비중(%), 레벨 단계 수, 환율 기준일
4. 레벨별 비교 테이블 — `levelLabel`, `roleExample`, `yearsExperience`, Base/Stock/Bonus/Total (USD+원화)
5. 레벨별 보상 구성 바 차트 (Stacked Bar: Base/Stock/Bonus 비율)
6. 보상 구조 설명 섹션 — `stockNote`(RSU 베스팅 등), 회사 특이사항
7. 계산기로 이동 CTA — `/tools/us-bigtech-salary-by-level-calculator/?company={id}`
8. 다른 회사 리포트 링크 (5개사) + 허브 리포트 링크
9. 국내 IT 연봉과 비교 CTA — `/reports/it-salary-top10/` (있다면) 또는 관련 계산기 연결
10. SeoContent — FAQ (예: "엔비디아 신입 연봉은 얼마인가요?", "스톡옵션은 어떻게 계산하나요?")

### 4-2. 통합 계산기 (`tools/us-bigtech-salary-by-level-calculator`)

레이아웃: `SimpleToolShell`

- **입력**:
  - 회사 선택 (라디오/셀렉트, 6개사)
  - 레벨(tier) 선택 — 선택한 회사의 `levels` 배열 기준으로 동적 옵션 구성
  - (옵션) 환율 직접 입력 슬라이더 (기본 1,400원, 1,200~1,600원 범위) — "환율 변동 시 원화 총보상 변화" 체험
- **출력**:
  - 총보상 (USD / KRW) KPI 카드
  - Base / Stock / Bonus 구성 비율 (도넛 또는 바 차트)
  - 월 환산 금액 (총보상 ÷ 12)
  - "한국 동급 연차 대비" 참고 문구 (국내 IT_TOP10 데이터 활용 가능 시)
- URL 파라미터: `?company=nvidia&tier=senior&fx=1400` — 회사별 리포트에서 직접 진입 가능
- 결과 하단: 회사별 리포트 링크 + 허브 리포트 링크

### 4-3. 허브 비교 리포트 (`reports/us-bigtech-salary-comparison-2026`)

레이아웃: 리포트 (인터랙티브, IPO 리포트 패턴)

1. CalculatorHero — "엔비디아 vs 애플 vs 아마존 vs MS vs 테슬라 vs 오라클 연봉 비교 2026"
2. InfoNotice — 환율/추정치 고지
3. KPI 그리드 — 6개사 중 총보상 최고/최저 기업, 평균 스톡 비중, 환율 기준
4. **동급 레벨 비교 차트** (탭/토글로 tier 선택: entry/mid/senior/staff/principal) — 6개사 막대 그래프, 선택한 tier에서 6개사 총보상(원화) 비교
5. 회사별 전체 레벨 테이블 (접기/펼치기, 6개 섹션)
6. 보상 구성 비교 (Base vs Stock 비중 — 회사별 스톡 의존도 차이 인사이트)
7. 6개 회사별 리포트 카드 그리드 (각 리포트로 링크)
8. 계산기 CTA
9. 국내 IT 연봉과의 비교 (선택, 있다면)
10. SeoContent — FAQ (예: "빅테크 중 연봉이 가장 높은 회사는?", "스톡 비중이 가장 큰 회사는?")

## 5. SEO 키워드 매핑

| 페이지 | 1차 키워드 | 2차 키워드 |
|---|---|---|
| nvidia-salary-by-level-2026 | 엔비디아 연봉 | 엔비디아 레벨, 엔비디아 이직 연봉 |
| apple-salary-by-level-2026 | 애플 연봉 | 애플 레벨 연봉, 애플 ICT4 연봉 |
| amazon-salary-by-level-2026 | 아마존 연봉 | 아마존 SDE 연봉, 아마존 L6 연봉 |
| microsoft-salary-by-level-2026 | 마이크로소프트 연봉 | MS 연봉 레벨, MS 63 연봉 |
| tesla-salary-by-level-2026 | 테슬라 연봉 | 테슬라 엔지니어 연봉 |
| oracle-salary-by-level-2026 | 오라클 연봉 | 오라클 IC4 연봉 |
| us-bigtech-salary-by-level-calculator | 미국 빅테크 연봉 계산기 | 해외 연봉 계산기, 연봉 원화 환산 |
| us-bigtech-salary-comparison-2026 | 빅테크 연봉 비교 | 엔비디아 애플 연봉 비교 |

## 6. 구현 파일 목록

- `src/data/usBigTechSalaryByLevel.ts` — 공통 스키마 + 6개사 데이터 + 환율 상수
- `src/pages/tools/us-bigtech-salary-by-level-calculator.astro`
- `public/scripts/us-bigtech-salary-by-level-calculator.js`
- `src/styles/scss/pages/_us-bigtech-salary-by-level-calculator.scss` (prefix: `ubg-`)
- `src/pages/reports/nvidia-salary-by-level-2026.astro` ~ `oracle-salary-by-level-2026.astro` (6개, 공유 컴포넌트/스타일)
- `src/styles/scss/pages/_us-bigtech-salary-report.scss` (6개 리포트 공유, prefix: `ubr-`)
- `src/pages/reports/us-bigtech-salary-comparison-2026.astro`
- `public/scripts/us-bigtech-salary-comparison-2026.js` (탭/차트 인터랙션)
- `src/styles/scss/pages/_us-bigtech-salary-comparison-2026.scss` (prefix: `ubc-`)
- 등록: `src/data/tools.ts`, `src/data/reports.ts`, `src/styles/app.scss`, `public/sitemap.xml`, `src/pages/index.astro` (topicBySlug/reportMetaBySlug), `src/pages/reports/index.astro`

## 7. 구현 순서 (단계별)

1. **데이터 검증 (사전 작업)**: levels.fyi에서 6개사 최신 레벨/보상 데이터 확인·정리 → `usBigTechSalaryByLevel.ts` 초안 작성 (이 단계는 "추정/참고" 명시 전제로 합리적 범위값 사용 가능)
2. **파일럿 1개사**: 애플(요청 시 제시된 levels.fyi 링크 기준) 리포트 페이지 + 공유 SCSS/컴포넌트 구조 확정
3. **계산기 구현**: 통합 계산기(`us-bigtech-salary-by-level-calculator`) — 애플 데이터로 먼저 동작 검증
4. **나머지 5개사 리포트**: 엔비디아 → 아마존 → 마이크로소프트 → 테슬라 → 오라클 순으로 데이터 추가 + 페이지 생성 (템플릿 재사용)
5. **허브 비교 리포트**: 6개사 데이터 모두 준비된 후 마지막 작성
6. **내부 링크 정리**: 6개 리포트 ↔ 계산기 ↔ 허브 ↔ 기존 IT_TOP10/연봉 관련 콘텐츠 상호 링크
7. **등록/배포**: `tools.ts`/`reports.ts`/`sitemap.xml`/`index.astro` 일괄 반영 → `npm run build` → QA → 배포

## 8. QA 체크포인트

- 환율 가정(1,400원) 명시 여부 및 모든 원화 표시에 "추정" 배지 적용
- 레벨 매핑(tier ↔ 회사별 levelLabel) 일관성 — 허브 비교 차트에서 동일 tier 비교 시 오해 소지 없는지
- 모바일에서 6개사 비교 차트/테이블 가독성 (가로 스크롤 또는 탭 전환)
- 6개 리포트 + 허브 + 계산기 간 상호 링크 누락 없는지
- `DEPLOY_CHECKLIST.md` 기준 최종 점검

## 9. 리스크 / 고려사항

- levels.fyi 데이터는 시점/표본에 따라 변동이 크므로 "조사 시점" 명시 필수, 추후 데이터 갱신 주기 고려
- 테슬라·오라클은 레벨 표본이 적어 데이터 신뢰도가 낮음 → "참고용" 강조, 가능하면 범위(range)로 표기
- 6개 리포트 + 허브 + 계산기 = 8페이지 규모이므로 한 번에 전부 구현하지 않고 파일럿(애플) → 계산기 → 순차 확장 방식으로 리스크 분산
