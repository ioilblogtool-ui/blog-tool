# 신생아 초기 용품 풀세트 비용 계산기 설계 문서

> 기획 원문: `docs/plan/202606/newborn-essentials-fullset-cost-calculator.md`
> 작성일: 2026-06-27
> 구현 기준: 비교계산소 `/tools/` 단일형 계산기 구조를 기준으로 Codex/Claude가 바로 구현 가능한 수준으로 정리

---

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202606/newborn-essentials-fullset-cost-calculator.md`
- 구현 대상: `신생아 초기 용품 풀세트 비용 계산기`
- 권장 slug: `newborn-essentials-fullset-cost-2026`
- URL: `/tools/newborn-essentials-fullset-cost-2026/`

### 1-2. 참고 계산기 / 리포트
- `breastfeeding-vs-formula-cost`
  - `SimpleToolShell` + `aside` 입력 패널 + 본문 결과 섹션 구조 참고
- `baby-cost-guide-first-year` (리포트)
  - 가성비/평균/프리미엄 3단계 톤과 품목별 1줄 비교(`itemRows`) 참고. 라벨은 이 계산기에서 "가성비/중급/프리미엄"으로 표기하되, 리포트의 "평균"과 같은 단계임을 안내 문구로 명시한다.
- `child-tutoring-cost-calculator`
  - 체크박스로 항목을 켜고 끄는 다항목 합산 UX 참고

### 1-3. 페이지 역할
출산 준비물 체크리스트에 오르는 대형·소형 용품을 품목별로 켜고 끄고, 등급(가성비/중급/프리미엄)을 선택하면 풀세트 총비용을 즉시 합산해 보여준다. `baby-cost-guide-first-year` 리포트가 품목당 1줄 비교로 다루는 내용을 품목별 세부 합산으로 확장하는 보완 콘텐츠다.

### 1-4. 구현 전제
- 품목은 10개로 고정한다: 카시트, 유모차, 아기침대, 젖병+소독기, 아기띠, 범퍼침대/범퍼, 모빌, 기저귀교환대, 보행기/바운서, 목욕용품 세트.
- 등급은 3단계: `frugal`(가성비), `mid`(중급), `premium`(프리미엄). `baby-cost-guide-first-year`의 `frugal/average/premium`과 동일 개념이나, 이 계산기에서는 "중급"으로 표기하고 안내 문구로 동일 단계임을 밝힌다.
- 모든 품목은 기본 체크 상태로 시작한다.
- "둘째 출산 모드" 토글을 켜면 대형 용품(카시트, 유모차, 아기침대) 3개의 체크가 자동 해제된다. 다시 끄면 원래 체크 상태로 복원하지 않고 그대로 둔다(사용자가 직접 재선택).
- 안전 관련 품목(카시트)은 가성비 등급도 KC 인증 기준 가격으로 책정했다는 안내를 별도로 노출한다.
- 가격은 평균값 기준 추정이며 실제 구매가와 다를 수 있다는 고지를 포함한다.

### 1-5. 권장 파일 구조
- `src/data/newbornEssentialsFullsetCost2026.ts`
- `src/pages/tools/newborn-essentials-fullset-cost-2026.astro`
- `public/scripts/newborn-essentials-fullset-cost-2026.js`
- `src/styles/scss/pages/_newborn-essentials-fullset-cost-2026.scss`
- `public/og/tools/newborn-essentials-fullset-cost-2026.png`

---

## 2. 페이지 목적
- 품목을 켜고 끄고 등급을 고르는 것만으로 출산 준비물 풀세트 총비용을 즉시 계산하게 한다.
- 가성비/중급/프리미엄 전체 합계를 동시에 보여줘 등급 선택의 기준점을 제공한다.
- 둘째 출산 가정이 대형 용품을 재사용할 때 절감되는 금액을 바로 체감하게 한다.
- `baby-cost-guide-first-year` 리포트와 양방향 링크로 이어지는 입구 콘텐츠 역할을 한다.

---

## 3. 핵심 사용자 시나리오

### 3-1. 처음부터 모든 품목을 준비하는 예비 부모
- 기본 체크 상태(전체 선택) 그대로 두고 품목별 등급만 조정한다.
- 상단 KPI에서 현재 선택 총합계와 전체 프리미엄 합계 차이를 바로 확인한다.

### 3-2. 일부 품목을 생략하려는 부모
- 보행기/바운서, 목욕용품 세트처럼 선택적인 품목의 체크를 해제한다.
- 합계가 즉시 줄어드는 것을 확인한다.

### 3-3. 둘째를 출산하는 부모
- "둘째 출산 모드"를 켠다.
- 카시트·유모차·아기침대가 자동으로 체크 해제되고, 절약 가능액이 즉시 커지는 것을 확인한다.

### 3-4. 등급별 비용 감을 잡으려는 부모
- 등급별 합계 막대차트에서 가성비/중급/프리미엄 전체 합계를 비교한다.
- 현재 선택 조합이 어느 등급 사이에 위치하는지 확인한다.

---

## 4. 입력값 / 출력값 정의

### 4-1. 입력값
- `checkedItems: Record<ItemId, boolean>` — 품목별 체크 여부, 기본 전체 `true`
- `itemGrades: Record<ItemId, Grade>` — 품목별 선택 등급, 기본값은 품목별로 `mid`
- `secondChildMode: boolean` — 둘째 출산 모드, 기본 `false`

```ts
type ItemId =
  | 'carSeat' | 'stroller' | 'crib' | 'bottleSterilizer' | 'babyCarrier'
  | 'bumperBed' | 'mobile' | 'changingTable' | 'walkerBouncer' | 'bathSet';
type Grade = 'frugal' | 'mid' | 'premium';
```

### 4-2. 출력값
- `itemCostByGrade(item, grade)` — 품목×등급 단가 (정적 테이블 조회)
- `selectedTotal` — 현재 체크/등급 조합 합계
- `tierTotal: Record<Grade, number>` — 체크된 품목만 대상으로 한 등급별 전체 합계 (가성비 전체, 중급 전체, 프리미엄 전체)
- `savingVsPremium` — `tierTotal.premium - selectedTotal`
- `largeItemsSavedAmount` — 둘째 출산 모드에서 대형 용품 3종을 제외해 절감된 금액 (선택 해제 전후 비교용, UI 보조 문구에만 사용)

---

## 5. 섹션 구조

### 5-1. 히어로
- 컴포넌트: `CalculatorHero`
- 카피
  - eyebrow: `출산 준비 비용`
  - title: `신생아 용품 풀세트 비용 계산기`
  - description: `카시트부터 젖병 세척기까지, 등급만 고르면 출산 준비물 풀세트 총비용이 바로 나옵니다.`
- 보조 배지: `출산 준비물`, `가성비·중급·프리미엄`, `둘째 출산 모드`

### 5-2. 액션 바
- 컴포넌트: `ToolActionBar` (초기화, 공유 링크 복사)

### 5-3. 둘째 출산 모드 토글
- 상단 고정 토글 스위치 1개
- 켜면 대형 용품 3종(카시트·유모차·아기침대) 체크 해제 + 안내 문구 노출
  - "카시트·유모차·아기침대는 첫째 때 쓰던 것을 재사용하는 경우가 많아 기본 해제했습니다. 필요하면 다시 체크하세요."

### 5-4. 품목 체크리스트 (aside 또는 입력 패널)
- 품목 카드 10개, 각 카드 구성:
  - 체크박스 + 품목명
  - 가성비/중급/프리미엄 3단 라디오 (세그먼트 버튼 형태)
  - 카시트 카드에는 "가성비 등급도 KC 인증 기준" 보조 문구 고정 표시

### 5-5. 상단 요약 카드
`SummaryCards` 3칸
- 현재 선택 총합계
- 전체 프리미엄 합계
- 절약 가능액 (프리미엄 대비)

### 5-6. 등급별 합계 차트
- 가성비 전체 / 중급 전체 / 프리미엄 전체 막대 3개
- 현재 선택 총합계는 별도 라인 또는 강조 막대로 표시해 어느 구간에 위치하는지 보여줌

### 5-7. 품목별 결과 테이블
- 열: 품목, 체크 여부, 선택 등급, 비용, 제휴 링크
- 체크 해제된 품목은 회색 처리하고 비용 0원으로 표시(합계 미포함 명시)

### 5-8. 안내 / 정책 박스
`InfoNotice`
- 가격은 평균값 기준 추정이며 실제 구매가와 다를 수 있음
- 카시트 가성비 등급도 기본 안전 인증 기준
- 등급 라벨은 `baby-cost-guide-first-year` 리포트의 가성비/평균/프리미엄과 동일 단계

### 5-9. SEO / FAQ / 관련 링크
`SeoContent`
- 관련 링크
  - `/reports/baby-cost-guide-first-year/` (첫 1년 육아비 전체 가이드)
  - 출산축하금/지원금 계산기 (`birth-support-total` 등 확정된 슬러그로 연결)

---

## 6. 컴포넌트 구조
- `BaseLayout`, `SiteHeader`, `CalculatorHero`, `ToolActionBar`, `SummaryCards`, `InfoNotice`, `SeoContent`
- 권장 쉘: `SimpleToolShell` (`resultFirst={false}`, aside에 체크리스트, 본문에 결과)

### 6-1. 페이지 전용 블록
- `nefc-second-child-toggle`
- `nefc-item-card`
- `nefc-grade-segment`
- `nefc-kpi-grid`
- `nefc-tier-chart`
- `nefc-item-table`
- `nefc-affiliate-card`

### 6-2. 모바일 우선 구조
- `둘째 출산 토글 -> 빠른 요약 카드 -> 품목 체크리스트(아코디언 또는 세로 카드) -> 차트 -> 결과 테이블 -> FAQ`

---

## 7. 상태 관리 포인트
- 바닐라 JS + DOM 직접 갱신
- URL query param 복원
  - `second` (둘째 모드 on/off)
  - 체크 해제된 품목만 `off=carSeat,stroller` 형태로 직렬화 (기본 전체 체크이므로 off 목록만 저장하면 충분)
  - 품목별 등급은 `grades=carSeat:premium,stroller:mid` 형태 또는 품목 약어 매핑으로 압축
- 입력 변경 시 동시 갱신 대상
  - 요약 카드, 등급별 차트, 품목별 결과 테이블
- 잘못된 입력 방어
  - 모든 품목이 체크 해제된 경우 합계 0원과 함께 "최소 1개 품목을 선택하세요" 안내

---

## 8. 계산 로직

### 8-1. 품목×등급 단가 조회
```ts
function itemCostByGrade(item: ItemId, grade: Grade): number {
  return ITEM_PRICE_TABLE[item][grade];
}
```

### 8-2. 현재 선택 총합계
```ts
const selectedTotal = ITEM_IDS
  .filter((item) => checkedItems[item])
  .reduce((sum, item) => sum + itemCostByGrade(item, itemGrades[item]), 0);
```

### 8-3. 등급별 전체 합계 (체크된 품목 기준)
```ts
const tierTotal = { frugal: 0, mid: 0, premium: 0 };
ITEM_IDS.filter((item) => checkedItems[item]).forEach((item) => {
  (['frugal', 'mid', 'premium'] as Grade[]).forEach((grade) => {
    tierTotal[grade] += itemCostByGrade(item, grade);
  });
});
```

### 8-4. 절약 가능액
```ts
const savingVsPremium = tierTotal.premium - selectedTotal;
```

### 8-5. 둘째 출산 모드 토글
```ts
function applySecondChildMode(checkedItems: Record<ItemId, boolean>) {
  return {
    ...checkedItems,
    carSeat: false,
    stroller: false,
    crib: false,
  };
}
```
> 토글을 끌 때는 자동으로 이전 상태를 복원하지 않는다. 사용자가 직접 다시 체크하도록 둔다(예측 가능한 단방향 동작).

---

## 9. 데이터 파일 구조

### 9-1. `src/data/newbornEssentialsFullsetCost2026.ts`
포함 항목
- 페이지 메타
- 품목 목록 + 라벨 + 카테고리(대형/소형)
- 품목×등급 가격 테이블
- 둘째 출산 모드 대상 품목 목록
- FAQ
- 제휴 링크(품목별)
- 관련 링크 (`baby-cost-guide-first-year` 리포트 포함)

예시 타입
```ts
export type ItemId =
  | "carSeat" | "stroller" | "crib" | "bottleSterilizer" | "babyCarrier"
  | "bumperBed" | "mobile" | "changingTable" | "walkerBouncer" | "bathSet";
export type Grade = "frugal" | "mid" | "premium";

export interface ItemMeta {
  id: ItemId;
  label: string;
  isLargeItem: boolean;
  note?: string;
}

export const ITEM_PRICE_TABLE: Record<ItemId, Record<Grade, number>> = {
  carSeat: { frugal: 150000, mid: 350000, premium: 700000 },
  stroller: { frugal: 120000, mid: 400000, premium: 900000 },
  crib: { frugal: 100000, mid: 300000, premium: 600000 },
  bottleSterilizer: { frugal: 30000, mid: 80000, premium: 180000 },
  babyCarrier: { frugal: 20000, mid: 60000, premium: 150000 },
  bumperBed: { frugal: 30000, mid: 70000, premium: 150000 },
  mobile: { frugal: 15000, mid: 40000, premium: 90000 },
  changingTable: { frugal: 20000, mid: 60000, premium: 130000 },
  walkerBouncer: { frugal: 30000, mid: 80000, premium: 180000 },
  bathSet: { frugal: 15000, mid: 35000, premium: 70000 },
};

export const SECOND_CHILD_RESET_ITEMS: ItemId[] = ["carSeat", "stroller", "crib"];
```
> 실제 구현 시 위 가격은 쿠팡/네이버쇼핑 카테고리 평균가 샘플링 결과로 교체한다.

### 9-2. 재사용 참고
- 등급 라벨 톤은 `babyCostGuideFirstYear.ts`의 `tiers` 정의를 참고해 일관성 유지
- 관련 링크에 `/reports/baby-cost-guide-first-year/` 고정 포함

---

## 10. 구현 순서
1. `breastfeeding-vs-formula-cost`, `child-tutoring-cost-calculator` 마크업/스크립트 구조 재확인
2. `src/data/newbornEssentialsFullsetCost2026.ts` 작성 (가격 테이블 포함)
3. 품목 체크리스트 + 등급 세그먼트 입력 UI 구현
4. 둘째 출산 모드 토글 구현
5. 요약 카드(현재 합계/프리미엄 합계/절약액) 구현
6. 등급별 합계 차트 구현
7. 품목별 결과 테이블 + 제휴 링크 구현
8. 안내 문구 / FAQ / 관련 링크(`baby-cost-guide-first-year`) 연결
9. query param 및 공유 링크 반영
10. 모바일 카드 UX 및 에지케이스(전체 해제) 점검

---

## 11. QA 체크포인트

### 11-1. 계산
- 체크 해제 품목이 `selectedTotal`에서 정확히 빠지는지
- `tierTotal`이 체크된 품목만 대상으로 계산되는지 (해제 품목은 전체 합계에서도 제외)
- 둘째 출산 모드 토글 시 대형 용품 3종만 정확히 해제되는지
- 모든 품목 해제 시 0원 + 안내 문구가 뜨는지

### 11-2. UX
- 품목 카드에서 체크와 등급 선택이 즉시 합계에 반영되는지
- 둘째 출산 모드 토글이 단방향(끌 때 자동 복원 없음)으로 동작하는지 의도대로 안내되는지
- 모바일에서 10개 품목 카드가 과도하게 길어지지 않는지(아코디언/그리드 검토)

### 11-3. 콘텐츠 / SEO
- 타이틀/설명에 `신생아 용품 풀세트 비용`, `출산 준비물 리스트 비용` 키워드 포함 여부
- 카시트 안전 인증 관련 고지 문구 노출 여부
- `baby-cost-guide-first-year` 리포트로의 내부 링크 및 리포트에서 본 계산기로의 역방향 링크 추가 필요성 확인

---

## 12. 최종 구현 방향 정리
이 계산기는 `baby-cost-guide-first-year` 리포트의 품목당 1줄 비교를 보완하는 상세 합산 도구로 구현한다.

사용자 흐름:
- 기본 전체 체크 상태에서 품목별 등급을 조정 → 실시간 합계 확인
- 불필요한 품목 체크 해제 → 합계 즉시 감소
- 둘째 출산이면 모드 토글 → 대형 용품 자동 해제, 절약액 체감
- 등급별 합계 차트로 현재 선택이 어느 구간에 있는지 확인
- 필요 시 `baby-cost-guide-first-year` 리포트로 이동해 기저귀·분유·병원비까지 포함한 1년 전체 그림 확인
