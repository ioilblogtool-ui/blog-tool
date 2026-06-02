# 비교표 CTA 2차 확산 설계 문서

> 기준 문서: `docs/design/202606/compare-cta-integration-design.md`  
> 선행 구현: `src/components/CompareCta.astro`, `/compare/`, `/compare/bonus/`, `/compare/welfare/`  
> 작성일: 2026-06-01  
> 구현 목표: 성과급 관련 계산기·리포트에서 `/compare/bonus/`로 이어지는 내부 이동 경로 확장

---

## 1. 목적

1차 CTA 통합은 성과급 핵심 계산기 5개, 지원금 핵심 페이지 5개, 인덱스 2개에 비교표 이동 경로를 붙이는 단계였다.

2차는 성과급 카테고리 전체를 `/compare/bonus/` 중심으로 묶는 단계다. 사용자가 회사별 계산기, 업종별 성과급 계산기, 성과급 리포트 중 어느 페이지로 들어와도 다음 행동으로 "다른 업종·회사와 비교"를 선택할 수 있게 만든다.

---

## 2. 2차 적용 범위

### 2-1. 우선 적용

| 우선순위 | 구분 | 페이지 | 연결 CTA |
| --- | --- | --- | --- |
| 1 | 업종별 계산기 | `/tools/auto-bonus-comparison/` | `/compare/bonus/` |
| 2 | 업종별 계산기 | `/tools/shipbuilding-bonus-comparison/` | `/compare/bonus/` |
| 3 | 업종별 계산기 | `/tools/finance-bonus-comparison/` | `/compare/bonus/` |
| 4 | 업종별 계산기 | `/tools/oil-refinery-bonus-comparison/` | `/compare/bonus/` |
| 5 | 업종별 계산기 | `/tools/it-platform-bonus-comparison/` | `/compare/bonus/` |

### 2-2. 다음 적용

| 우선순위 | 구분 | 페이지 | 연결 CTA |
| --- | --- | --- | --- |
| 6 | 회사별 계산기 | `/tools/hyundai-bonus/` | `/compare/bonus/` |
| 7 | 회사별 계산기 | `/tools/lg-bonus/` | `/compare/bonus/` |

### 2-3. 리포트 적용

| 우선순위 | 구분 | 페이지 | 연결 CTA |
| --- | --- | --- | --- |
| 8 | 리포트 | `/reports/corporate-bonus-comparison-2026/` | `/compare/bonus/` |
| 9 | 리포트 | `/reports/sk-hynix-bonus-2027/` | `/compare/bonus/` |
| 10 | 리포트 | `/reports/samsung-ds-bonus-calculation-guide/` | `/compare/bonus/` |
| 11 | 리포트 | `/reports/insurance-salary-bonus-comparison-2026/` | `/compare/bonus/` |
| 12 | 리포트 | `/reports/construction-salary-bonus-comparison-2026/` | `/compare/bonus/` |

---

## 3. 적용 원칙

### 3-1. CTA 위치

| 페이지 유형 | 권장 위치 | 이유 |
| --- | --- | --- |
| 업종별 비교 계산기 | 기존 관련 계산기 섹션 바로 앞 또는 바로 뒤 | 계산 결과와 업종 설명을 본 뒤 "다른 업종도 비교" 니즈가 생김 |
| 회사별 계산기 | 기존 다음 계산기·관련 계산기 섹션 근처 | 회사 단일 결과에서 업종·대기업 비교로 확장 |
| 리포트 | 본문 주요 비교표 이후, `SeoContent` 이전 | 리포트를 읽은 뒤 계산기/비교표로 이동하는 흐름이 자연스러움 |

Hero 바로 아래에는 넣지 않는다. 검색 유입 사용자는 먼저 현재 페이지의 핵심 계산·비교 결과를 확인해야 하므로, CTA는 중후반부에 배치한다.

### 3-2. CTA 개수

한 페이지당 `CompareCta`는 1개만 추가한다.

기존 관련 계산기 카드가 이미 많으므로, CTA 안의 버튼은 2개 이하를 기본으로 한다.

권장 버튼:

1. `성과급 비교표 보기` → `/compare/bonus/`
2. 보조 링크 → `/compare/` 또는 현재 맥락의 상세 계산기

### 3-3. 구현 방식

기존 1차에서 만든 공통 컴포넌트를 사용한다.

```astro
import CompareCta from "../../components/CompareCta.astro";

<CompareCta
  variant="bonus"
  title="다른 업종 성과급도 같은 기준으로 비교해보세요"
  description="반도체, 자동차, 금융권, 조선업, 정유사 성과급 구조를 한 화면에서 이어서 볼 수 있습니다."
  links={[
    { href: "/compare/bonus/", label: "성과급 비교표 보기" },
    { href: "/compare/", label: "전체 비교표 허브" },
  ]}
/>
```

---

## 4. 페이지별 CTA 문안

### 4-1. 업종별 비교 계산기 5개

#### `/tools/auto-bonus-comparison/`

| 항목 | 내용 |
| --- | --- |
| title | 자동차 성과급을 다른 업종과 비교해보세요 |
| description | 현대차·기아·현대모비스 성과급 구조를 확인했다면 반도체, 금융권, 조선업, 정유사 성과급과도 같은 기준으로 이어서 비교할 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 전체 비교표 허브 → `/compare/` |

#### `/tools/shipbuilding-bonus-comparison/`

| 항목 | 내용 |
| --- | --- |
| title | 조선업 성과급을 다른 업종과 비교해보세요 |
| description | HD현대중공업, 한화오션, 삼성중공업 성과급 구조를 본 뒤 반도체·자동차·금융권 성과급과 보상 차이를 이어서 확인할 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 전체 비교표 허브 → `/compare/` |

#### `/tools/finance-bonus-comparison/`

| 항목 | 내용 |
| --- | --- |
| title | 금융권 성과급을 제조업·플랫폼 업종과 비교해보세요 |
| description | 은행, 증권, 보험 성과급 구조를 확인한 뒤 반도체, 자동차, IT 플랫폼, 조선업 성과급과 같은 화면에서 비교할 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 전체 비교표 허브 → `/compare/` |

#### `/tools/oil-refinery-bonus-comparison/`

| 항목 | 내용 |
| --- | --- |
| title | 정유사 성과급을 다른 고성과 업종과 비교해보세요 |
| description | S-OIL, GS칼텍스, HD현대오일뱅크, SK이노베이션 성과급을 본 뒤 반도체·자동차·금융권과 보상 구조를 비교할 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 전체 비교표 허브 → `/compare/` |

#### `/tools/it-platform-bonus-comparison/`

| 항목 | 내용 |
| --- | --- |
| title | IT 플랫폼 성과급을 전통 대기업과 비교해보세요 |
| description | 네이버, 카카오, 쿠팡 성과급 구조를 확인한 뒤 반도체, 자동차, 금융권, 조선업 성과급과 보상 방식 차이를 이어서 볼 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 전체 비교표 허브 → `/compare/` |

---

## 5. 회사별 계산기 2개

### `/tools/hyundai-bonus/`

| 항목 | 내용 |
| --- | --- |
| title | 현대차 성과급을 다른 대기업과 비교해보세요 |
| description | 현대차 성과급 계산 결과를 확인했다면 자동차 업종뿐 아니라 반도체, 금융권, 조선업 성과급 구조와도 이어서 비교할 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 세후 실수령 계산 → `/tools/bonus-after-tax-calculator/` |

### `/tools/lg-bonus/`

| 항목 | 내용 |
| --- | --- |
| title | LG전자 성과급을 다른 대기업과 비교해보세요 |
| description | LG전자 성과급 계산 결과를 본 뒤 반도체, 자동차, 금융권, IT 플랫폼 성과급과 같은 기준으로 이어서 비교할 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 세후 실수령 계산 → `/tools/bonus-after-tax-calculator/` |

---

## 6. 성과급 리포트 5개

리포트는 계산기보다 CTA를 덜 강하게 둔다. 본문을 읽은 사용자가 "표로 다시 정리"하거나 "직접 계산"으로 이동하도록 설계한다.

### `/reports/corporate-bonus-comparison-2026/`

| 항목 | 내용 |
| --- | --- |
| title | 리포트 내용을 비교표 허브에서 다시 정리해보세요 |
| description | 대기업 성과급 흐름을 읽은 뒤 업종별 비교표와 회사별 계산기로 이어서 보면 내 조건에 맞는 판단이 쉬워집니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 대기업 성과급 계산 → `/tools/bonus-simulator/` |

### `/reports/sk-hynix-bonus-2027/`

| 항목 | 내용 |
| --- | --- |
| title | 하이닉스 성과급 전망을 삼성전자·반도체 업종과 비교해보세요 |
| description | 2027 성과급 전망을 확인했다면 같은 연봉 기준의 반도체 성과급 계산기와 전체 성과급 비교표로 이어서 볼 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 하이닉스 성과급 계산 → `/tools/sk-hynix-bonus/` |

### `/reports/samsung-ds-bonus-calculation-guide/`

| 항목 | 내용 |
| --- | --- |
| title | 삼성전자 DS 성과급 기준을 다른 회사와 비교해보세요 |
| description | TAI·OPI 구조를 이해한 뒤 SK하이닉스, DB하이텍, 자동차·금융권 성과급과 비교하면 보상 구조 차이가 더 잘 보입니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 삼성전자 성과급 계산 → `/tools/samsung-bonus/` |

### `/reports/insurance-salary-bonus-comparison-2026/`

| 항목 | 내용 |
| --- | --- |
| title | 보험사 성과급을 금융권 전체와 비교해보세요 |
| description | 보험사 연봉·성과급 흐름을 확인했다면 은행·증권을 포함한 금융권 성과급 계산기와 전체 성과급 비교표를 함께 볼 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 금융권 성과급 계산 → `/tools/finance-bonus-comparison/` |

### `/reports/construction-salary-bonus-comparison-2026/`

| 항목 | 내용 |
| --- | --- |
| title | 건설업 성과급을 다른 업종과 비교해보세요 |
| description | 건설사 연봉·성과급 흐름을 확인한 뒤 반도체, 자동차, 조선업, 금융권 성과급과 비교해 보상 위치를 파악할 수 있습니다. |
| primary | 성과급 비교표 보기 → `/compare/bonus/` |
| secondary | 전체 비교표 허브 → `/compare/` |

---

## 7. 구현 체크리스트

### 7-1. 파일 수정

각 대상 페이지에서 다음을 수행한다.

- [ ] `CompareCta` import 추가
- [ ] 기존 관련 계산기 또는 본문 하단 근처에 `<CompareCta />` 추가
- [ ] CTA 버튼은 1~2개로 제한
- [ ] `/compare/bonus/` 링크가 primary로 들어갔는지 확인
- [ ] 이미 1차 CTA가 있는 페이지와 중복되지 않는지 확인

### 7-2. 검증

- [ ] `npm run build`
- [ ] 빌드 산출물에서 대상 페이지별 `compare-cta` 포함 여부 확인
- [ ] 대표 페이지 3개 이상 화면 확인
  - `/tools/auto-bonus-comparison/`
  - `/tools/hyundai-bonus/`
  - `/reports/corporate-bonus-comparison-2026/`
- [ ] 모바일 폭에서 CTA 버튼 줄바꿈 및 가로 스크롤 여부 확인

---

## 8. 2차 이후 남는 일

2차 구현 후에는 성과급 카테고리의 내부 링크 구조가 꽤 단단해진다. 다음 단계는 성과급 외 영역으로 확장한다.

1. 지원금 2차 CTA
   - 출산·육아 계산기, 산후조리비, 임신검진비, 부모급여 관련 페이지

2. 부동산 비교표 CTA
   - 셔틀권 부동산, 청약 가점, 전월세 전환, 주택자금 계산기

3. 투자 비교표 CTA
   - ETF, 월배당, 적립식 투자, 미국주식 환차손익 계산기

4. `/compare/bonus/` 자체 강화
   - "업종별 계산기 바로가기" 영역을 더 상단으로 올릴지 검토
   - 성과급 관련 리포트 묶음 추가 검토
