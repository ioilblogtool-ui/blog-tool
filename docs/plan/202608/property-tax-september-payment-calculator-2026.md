# 비교계산소 웹 콘텐츠 기획서
## 재산세 9월분 납부액 계산기 2026

> 상태: 기획 초안  
> 작성일: 2026-07-23  
> 콘텐츠 유형: `/tools/` 세금 납부액 계산기  
> 핵심 주의: 재산세는 지방세 고지세목이다. 계산기는 고지서 확인 전 예산 추정용이며, 실제 납부액은 지방자치단체 고지서와 위택스·이택스에서 확인해야 한다.

---

## 1. 기본 정보

| 항목 | 내용 |
|---|---|
| 콘텐츠명 | 재산세 9월분 납부액 계산기 2026 |
| 추천 slug | `property-tax-september-payment-calculator-2026` |
| 추천 URL | `/tools/property-tax-september-payment-calculator-2026/` |
| 콘텐츠 유형 | 9월 재산세 납부액 계산기 |
| 카테고리 | 부동산·세금 |
| 1차 키워드 | 재산세 9월, 9월 재산세 납부, 재산세 2기분 계산기 |
| 2차 키워드 | 주택분 재산세 9월, 토지분 재산세, 재산세 납부기간 9월, 재산세 7월 9월 차이, 재산세 고지서 계산 |
| 검색 수요 판단 | 8월 말~9월 30일 집중. 7월 재산세 납부 후 9월 2기분 검색으로 이어짐 |
| 핵심 메시지 | "9월 재산세는 주택 2기분과 토지분이 핵심이다. 7월 고지액을 알면 9월 주택분 예산을 빠르게 추정할 수 있다." |
| 주요 대상 | 주택 소유자, 토지 소유자, 7월 재산세를 납부한 사람, 9월 납부 예산을 미리 잡는 사용자 |
| 내부 연결 | 재산세 납부기간 리포트, 아파트 보유세 계산기, 부동산 취득세 계산기, 다주택자 세금 리포트 |
| 구현 우선순위 | 높음 |

---

## 2. 기획 의도

비교계산소는 7월 재산세·보유세 검색 수요를 이미 받고 있다. 9월에는 주택 2기분과 토지분 재산세 검색이 다시 발생한다. 사용자는 고지서가 오기 전 `9월에 또 얼마 내야 하나`, `7월에 냈는데 왜 9월에도 나오나`, `토지분은 언제 내나`를 찾는다.

이 계산기는 복잡한 지방세 정밀 산출기보다 **9월 납부 예산을 빠르게 잡는 도구**로 설계한다. 특히 주택 사용자는 7월 고지액을 이미 알고 있는 경우가 많으므로, `7월 주택분 납부액 입력 → 9월 예상 주택분 추정` 경로를 1차 UX로 둔다. 토지 사용자는 과세표준과 토지 유형을 입력해 대략적인 본세를 계산하되, 종합합산·별도합산·분리과세 구분을 반드시 확인하도록 안내한다.

---

## 3. 공식 기준 요약

| 항목 | 기준 |
|---|---|
| 과세기준일 | 매년 6월 1일 소유자 기준 |
| 토지 납기 | 매년 9월 16일 ~ 9월 30일 |
| 건축물 납기 | 매년 7월 16일 ~ 7월 31일 |
| 주택 납기 | 연세액의 1/2은 7월 16일~7월 31일, 나머지 1/2은 9월 16일~9월 30일 |
| 주택 소액 일시부과 | 해당 연도 부과세액이 20만 원 이하이면 조례에 따라 7월에 한꺼번에 부과 가능 |
| 일반 주택 세율 | 과세표준 6천만 원 이하 0.1%, 6천만~1.5억 구간 6만 원+초과분 0.15%, 1.5억~3억 구간 19.5만 원+초과분 0.25%, 3억 초과 57만 원+초과분 0.4% |
| 1세대 1주택 특례 | 시가표준액 9억 원 이하 등 요건 충족 시 완화 세율 적용 가능. 2026년 12월 28일까지 성립한 납세의무에 한정 |
| 토지 종합합산 세율 | 5천만 원 이하 0.2%, 5천만~1억 구간 10만 원+초과분 0.3%, 1억 초과 25만 원+초과분 0.5% |
| 토지 별도합산 세율 | 2억 원 이하 0.2%, 2억~10억 구간 40만 원+초과분 0.3%, 10억 초과 280만 원+초과분 0.4% |

> 구현 전 지방세법, 지방세법 시행령, 지방자치단체 조례, 지방교육세·지역자원시설세 적용 기준을 재확인한다.

---

## 4. 계산기 범위

### 4-1. MVP 계산 모드

| 모드 | 설명 | 추천 우선순위 |
|---|---|---:|
| 주택 7월 고지액 기준 | 7월 주택분 재산세를 입력하면 9월 2기분을 같은 금액으로 추정 | 1 |
| 주택 공시가격 기준 | 공시가격, 공정시장가액비율, 1세대 1주택 여부로 연세액과 9월분 추정 | 2 |
| 토지 과세표준 기준 | 과세표준과 토지 유형으로 토지분 본세 추정 | 3 |
| 직접 고지액 합산 | 주택 2기분, 토지분, 지방교육세 등 사용자가 직접 입력해 총 납부액 계산 | 4 |

### 4-2. MVP에서 하지 않을 것

- 공시가격을 주소로 자동 조회하지 않는다.
- 모든 감면·조례 특례를 자동 반영하지 않는다.
- 지역자원시설세와 지방교육세를 정밀 산출하지 않는다. 단, 선택 입력 또는 추정 옵션은 제공한다.
- 종합부동산세까지 합산하지 않는다. 관련 링크로 연결한다.

---

## 5. 입력값 설계

### 5-1. 주택 7월 고지액 기준 모드

| 입력값 | 기본값 | 설명 |
|---|---:|---|
| 7월 주택분 재산세 본세 | 250,000원 | 고지서의 재산세 본세 또는 총 납부액 입력 선택 |
| 입력 기준 | 총 납부액 | 본세만 / 총 납부액 |
| 9월 동일 부과 여부 | 예 | 대부분 주택분은 1/2씩 부과 |
| 7월 일시부과 여부 | 아니오 | 연세액 20만 원 이하 등으로 7월에 한꺼번에 납부한 경우 |
| 토지분 추가 여부 | 없음 | 토지 고지서가 별도로 있다면 추가 |
| 납부 예정일 | 2026-09-30 | 납기 안내용 |

### 5-2. 주택 공시가격 기준 모드

| 입력값 | 기본값 | 설명 |
|---|---:|---|
| 주택 공시가격 | 600,000,000원 | 공동주택가격 또는 개별주택가격 |
| 공정시장가액비율 | 60% | 구현 전 2026년 기준 확인 필요 |
| 1세대 1주택 특례 | 예 | 시가표준액 9억 원 이하 여부 확인 |
| 연세액 분할 | 7월/9월 반반 | 9월분 산출 |
| 지방교육세 추정 | 선택 | 재산세 본세의 일정 비율 추정 옵션 |

### 5-3. 토지 과세표준 기준 모드

| 입력값 | 기본값 | 설명 |
|---|---:|---|
| 토지 과세 유형 | 종합합산 | 종합합산 / 별도합산 / 분리과세 |
| 과세표준 | 100,000,000원 | 고지서 또는 세무 자료 기준 |
| 분리과세 세율 | 일반 0.2% | 전답·임야, 골프장 등은 별도 선택 |
| 지방교육세 추정 | 선택 | 본세 외 부가세목은 고지서 확인 안내 |

---

## 6. 계산 로직

### 6-1. 주택 7월 고지액 기준

```ts
if (paidAllInJuly) {
  septemberHousingTax = 0;
} else {
  septemberHousingTax = julyHousingTax;
}

septemberTotal = septemberHousingTax + landTax + localEducationTax + regionalResourceFacilityTax;
```

### 6-2. 일반 주택 본세

```ts
taxBase = publicPrice * fairMarketValueRatio;
annualPropertyTax = calcHousingPropertyTax(taxBase, isSingleHomeSpecial);
septemberHousingTax = annualPropertyTax / 2;
```

### 6-3. 일반 주택 세율표

| 과세표준 | 일반 세율 계산 |
|---:|---:|
| 6천만 원 이하 | 과세표준 × 0.1% |
| 6천만 원 초과~1억5천만 원 이하 | 60,000원 + 6천만 원 초과분 × 0.15% |
| 1억5천만 원 초과~3억 원 이하 | 195,000원 + 1억5천만 원 초과분 × 0.25% |
| 3억 원 초과 | 570,000원 + 3억 원 초과분 × 0.4% |

### 6-4. 1세대 1주택 특례 세율표

| 과세표준 | 특례 세율 계산 |
|---:|---:|
| 6천만 원 이하 | 과세표준 × 0.05% |
| 6천만 원 초과~1억5천만 원 이하 | 30,000원 + 6천만 원 초과분 × 0.1% |
| 1억5천만 원 초과~3억 원 이하 | 120,000원 + 1억5천만 원 초과분 × 0.2% |
| 3억 원 초과 | 420,000원 + 3억 원 초과분 × 0.35% |

### 6-5. 토지 세율

| 유형 | 과세표준 | 세율 계산 |
|---|---:|---:|
| 종합합산 | 5천만 원 이하 | 과세표준 × 0.2% |
| 종합합산 | 5천만~1억 원 | 100,000원 + 5천만 원 초과분 × 0.3% |
| 종합합산 | 1억 원 초과 | 250,000원 + 1억 원 초과분 × 0.5% |
| 별도합산 | 2억 원 이하 | 과세표준 × 0.2% |
| 별도합산 | 2억~10억 원 | 400,000원 + 2억 원 초과분 × 0.3% |
| 별도합산 | 10억 원 초과 | 2,800,000원 + 10억 원 초과분 × 0.4% |
| 분리과세 일반 | 전체 | 과세표준 × 0.2% |

---

## 7. 결과 카드

| 카드 | 표시값 |
|---|---|
| 9월 예상 납부액 | 주택 2기분 + 토지분 + 선택 부가세목 합계 |
| 주택 2기분 | 주택분 9월 납부 예상액 |
| 토지분 | 토지분 재산세 예상액 |
| 납부 기한 | 2026년 9월 16일~9월 30일 |
| 7월 대비 | 7월 입력액 대비 9월 증감 |

### 해석 문구 예시

```text
7월 주택분 재산세를 25만 원 납부했고 일시부과 대상이 아니라면, 9월 주택분도 약 25만 원으로 예상됩니다.
토지분 고지서가 별도로 있다면 9월 납부액은 더 커질 수 있습니다.
```

---

## 8. 화면 구성

1. H1 / 9월 재산세 핵심 설명
2. 납부기간 안내: 9월 16일~9월 30일
3. 빠른 모드 선택: 7월 고지액 기준 / 공시가격 기준 / 토지 기준
4. 계산기 입력
5. 9월 예상 납부액 결과
6. 주택 7월·9월 차이 설명
7. 토지분 재산세 설명
8. 20만 원 이하 일시부과 안내
9. 납부 전 체크리스트
10. FAQ
11. 공식 출처
12. 관련 계산기

### 디자인 방향

- 결과 영역은 `9월 예상 납부액`을 크게 보여주고, 주택·토지·부가세목을 분해한다.
- 납부기한은 D-day 배지처럼 표시한다.
- 7월 고지액 기준 모드는 입력이 적어야 하므로 상단 기본값으로 둔다.
- 공시가격 기준 모드는 `추정` 배지를 붙인다.
- 고지서와 다를 수 있다는 안내는 결과 바로 아래에 둔다.

---

## 9. SEO 전략

### 권장 SEO 타이틀

```text
재산세 9월분 납부액 계산기 2026 | 주택 2기분·토지분 재산세
```

### 메타 디스크립션

```text
2026년 9월 재산세 납부액을 계산합니다. 7월 주택분 고지액으로 9월 2기분을 추정하고, 토지분 재산세와 납부기간까지 함께 확인하세요.
```

### H1

```text
재산세 9월분 납부액 계산기 2026
```

### H2 구조

1. 9월 재산세는 주택 2기분과 토지분이 핵심입니다
2. 2026년 9월 재산세 납부기간
3. 7월 고지액으로 9월 주택분 계산
4. 공시가격으로 주택분 재산세 추정
5. 토지분 재산세 계산
6. 7월에 한 번만 냈다면 왜 9월 고지서가 없을까
7. 납부 전 확인할 것
8. FAQ

### 키워드 매핑

| 키워드 | 노출 위치 |
|---|---|
| 재산세 9월 | title, H1, 첫 문단 |
| 9월 재산세 납부 | 납부기간 안내 |
| 재산세 2기분 | 주택 7월/9월 섹션 |
| 주택분 재산세 9월 | 결과 카드, FAQ |
| 토지분 재산세 | 토지 계산 모드 |
| 재산세 납부기간 9월 | title, FAQ |
| 재산세 7월 9월 차이 | 설명 섹션 |

---

## 10. FAQ 초안

### 7월에 냈는데 9월에도 재산세가 나오나요?

주택분 재산세는 원칙적으로 연세액의 절반을 7월에, 나머지 절반을 9월에 냅니다. 다만 해당 연도 부과세액이 20만 원 이하인 경우에는 조례에 따라 7월에 한 번에 부과될 수 있습니다.

### 9월 재산세 납부기간은 언제인가요?

토지는 매년 9월 16일부터 9월 30일까지 납부합니다. 주택 2기분도 9월 16일부터 9월 30일까지 납부합니다.

### 토지분 재산세는 왜 9월에 나오나요?

지방세법상 토지 재산세 납기는 매년 9월 16일부터 9월 30일까지입니다. 주택과 별도로 토지를 보유하고 있으면 9월 고지액이 커질 수 있습니다.

### 7월 고지액과 9월 고지액은 항상 같나요?

주택분만 보면 대체로 절반씩 나뉘지만, 실제 고지서에는 지방교육세, 지역자원시설세, 감면, 조례, 수시부과 등이 반영될 수 있습니다. 9월에는 토지분이 함께 나올 수도 있습니다.

### 공시가격으로 계산한 값과 고지서가 다른 이유는 무엇인가요?

공정시장가액비율, 세부담 상한, 감면, 공동소유, 지자체 조례, 부가세목이 반영되면 단순 계산값과 달라질 수 있습니다. 최종 납부액은 고지서와 위택스·이택스에서 확인해야 합니다.

---

## 11. 납부 전 체크리스트

- 2026년 6월 1일 기준 소유 여부
- 7월에 주택분이 일시부과되었는지
- 9월 주택 2기분 고지서가 있는지
- 토지분 고지서가 별도로 있는지
- 공동명의 지분별 고지 여부
- 감면·세부담 상한 적용 여부
- 지방교육세·지역자원시설세 포함 여부
- 자동이체·전자송달 세액공제 여부
- 위택스·이택스·간편결제 납부 가능 여부
- 납부 마감일이 9월 30일인지 확인

---

## 12. 관련 콘텐츠 연결

| 콘텐츠 | 연결 이유 |
|---|---|
| `/reports/property-tax-payment-2026/` | 재산세 납부기간 리포트 |
| `/tools/apartment-holding-tax/` | 보유세 전체 계산 |
| `/tools/real-estate-acquisition-tax/` | 부동산 세금 클러스터 |
| `/reports/multi-house-tax-2026/` | 다주택자 세금 해설 |
| `/reports/seoul-apartment-price-2026/` | 아파트 가격·보유세 관심 연결 |

---

## 13. 구현 체크리스트

- [ ] `src/data/propertyTaxSeptemberPaymentCalculator2026.ts` 생성
- [ ] `/tools/property-tax-september-payment-calculator-2026/` 페이지 생성
- [ ] 클라이언트 스크립트 생성
- [ ] 7월 고지액 기준 모드 구현
- [ ] 주택 공시가격 기준 모드 구현
- [ ] 토지 과세표준 기준 모드 구현
- [ ] 일시부과 여부 토글
- [ ] 납부기한 안내 배지
- [ ] `추정` 및 `고지서 확인` 배지
- [ ] FAQ 및 SeoContent 구성
- [ ] `src/data/tools.ts` 등록
- [ ] 홈/도구 인덱스 topic mapping 등록
- [ ] `public/sitemap.xml` 등록
- [ ] `npm run build` 성공 확인

---

## 14. 상세 설계

### 14-1. 사용자 문제 정의

| 사용자 상황 | 실제 질문 | 계산기가 해결해야 할 것 |
|---|---|---|
| 7월 재산세를 납부한 주택 소유자 | "9월에도 같은 금액이 나오나?" | 7월 고지액 기준으로 9월 주택 2기분 추정 |
| 고지서 받기 전 예산을 잡는 사용자 | "9월 말까지 얼마를 준비해야 하나?" | 주택분·토지분·부가세목을 합산한 예산 표시 |
| 7월에 한 번만 낸 사용자 | "왜 9월 고지서가 안 나오지?" | 20만 원 이하 일시부과 가능성 설명 |
| 토지를 보유한 사용자 | "토지분은 어떻게 계산되나?" | 종합합산·별도합산·분리과세 모드 제공 |
| 공시가격 기준으로 미리 보는 사용자 | "고지서 전 대략 얼마일까?" | 공시가격·공정시장가액비율 기반 추정 |

이 계산기의 중심은 정밀 세무 신고가 아니라 `9월 납부 예산 추정`이다. 따라서 첫 화면의 기본 모드는 가장 간단한 `7월 고지액 기준`으로 두고, 공시가격·토지 과세표준 방식은 고급 모드처럼 단계적으로 열어준다.

### 14-2. 핵심 UX 흐름

1. 사용자는 상단에서 계산 모드를 선택한다.
2. 기본값은 `7월 고지액 기준`이며, 7월에 낸 주택분 금액만 입력하면 9월 예상액이 바로 나온다.
3. 7월 일시부과 여부를 켜면 9월 주택분은 0원으로 표시된다.
4. 토지분이 있으면 추가 입력 섹션을 펼쳐 토지 유형과 과세표준을 넣는다.
5. 공시가격 기준 모드는 `추정` 배지를 명확히 표시한다.
6. 결과는 `9월 예상 납부액`을 가장 크게 보여주고, 주택 2기분·토지분·부가세목을 분해한다.
7. 결과 하단에는 `납부기간 2026년 9월 16일~9월 30일`을 고정 표시한다.
8. 마지막에는 위택스·이택스·지자체 고지서 확인 안내로 마무리한다.

### 14-3. 계산 모드별 우선 화면

| 모드 | 첫 화면 노출 | 사용 난이도 | 설명 |
|---|---|---:|---|
| 7월 고지액 기준 | 기본 선택 | 낮음 | 가장 많은 사용자가 바로 이해 가능 |
| 공시가격 기준 | 탭 또는 세그먼트 | 중간 | 공시가격과 비율을 알아야 함 |
| 토지 과세표준 기준 | 접힌 고급 영역 | 높음 | 토지 과세 유형 판단 필요 |
| 직접 합산 | 보조 모드 | 낮음 | 고지서 금액을 항목별 합산 |

### 14-4. URL 파라미터 설계

| 파라미터 | 타입 | 예시 | 설명 |
|---|---|---:|---|
| `mode` | string | `july` | `july`, `house`, `land`, `manual` |
| `july` | number | `250000` | 7월 주택분 입력액 |
| `basis` | string | `total` | `base`, `total` |
| `paidAll` | boolean | `0` | 7월 일시부과 여부 |
| `land` | boolean | `1` | 토지분 추가 여부 |
| `landType` | string | `general` | `general`, `separate`, `special` |
| `landBase` | number | `100000000` | 토지 과세표준 |
| `publicPrice` | number | `600000000` | 주택 공시가격 |
| `fmv` | number | `60` | 공정시장가액비율 |
| `single` | boolean | `1` | 1세대 1주택 특례 적용 선택 |
| `edu` | number | `0` | 지방교육세 직접 입력 또는 추정액 |
| `resource` | number | `0` | 지역자원시설세 직접 입력 |
| `credit` | number | `0` | 전자송달·자동이체 공제 등 |

URL 공유 시 `공시가격 기준 추정`과 `고지액 기준 추정`을 제목 또는 배지로 구분해 사용자가 계산 근거를 알 수 있게 한다.

### 14-5. 데이터 모델

```ts
type PropertyTaxMode = 'july' | 'house' | 'land' | 'manual';
type JulyInputBasis = 'baseTax' | 'totalPayment';
type LandTaxType = 'aggregate' | 'separate' | 'specialGeneral' | 'specialHighRate';

interface PropertyTaxSeptemberInput {
  mode: PropertyTaxMode;
  julyHousingAmount: number;
  julyInputBasis: JulyInputBasis;
  paidAllInJuly: boolean;
  includeLandTax: boolean;
  landTaxType: LandTaxType;
  landTaxBase: number;
  housingPublicPrice: number;
  fairMarketValueRatio: number;
  useSingleHomeSpecialRate: boolean;
  localEducationTax: number;
  regionalResourceFacilityTax: number;
  taxCreditAmount: number;
}

interface PropertyTaxSeptemberResult {
  septemberTotal: number;
  septemberHousingTax: number;
  landPropertyTax: number;
  estimatedAnnualHousingTax: number;
  julyComparisonAmount: number;
  localEducationTax: number;
  regionalResourceFacilityTax: number;
  taxCreditAmount: number;
  dueDateLabel: string;
  modeLabel: string;
  estimateLevel: 'simple' | 'estimated' | 'manual';
  insight: string;
}
```

### 14-6. 상수 설계

| 상수 | 값 | 설명 |
|---|---:|---|
| `PROPERTY_TAX_DUE_START_2026` | `2026-09-16` | 9월 납부 시작일 |
| `PROPERTY_TAX_DUE_END_2026` | `2026-09-30` | 9월 납부 마감일 |
| `SMALL_HOUSING_ANNUAL_TAX_THRESHOLD` | `200000` | 주택분 일시부과 가능 기준 |
| `DEFAULT_FAIR_MARKET_VALUE_RATIO` | 구현 전 확인 | 2026년 주택 공정시장가액비율 |
| `LOCAL_EDUCATION_TAX_RATE_HINT` | 선택 | 단순 추정용. 구현 전 기준 확인 |
| `DEFAULT_JULY_HOUSING_AMOUNT` | `250000` | 예시 입력값 |
| `MAX_PUBLIC_PRICE` | `10000000000` | 오입력 방지용 UX 상한 |
| `MAX_TAX_BASE` | `10000000000` | 오입력 방지용 UX 상한 |

공정시장가액비율, 지방교육세, 지역자원시설세는 구현 전 최신 기준 확인이 필요하다. 확인 전에는 기본 자동 계산보다 직접 입력을 우선하고, 추정 옵션은 명확히 라벨링한다.

### 14-7. 세율 테이블 데이터 구조

```ts
interface ProgressiveTaxBracket {
  minExclusive: number;
  maxInclusive: number | null;
  baseTax: number;
  marginalRate: number;
}

const HOUSING_GENERAL_BRACKETS: ProgressiveTaxBracket[] = [
  { minExclusive: 0, maxInclusive: 60_000_000, baseTax: 0, marginalRate: 0.001 },
  { minExclusive: 60_000_000, maxInclusive: 150_000_000, baseTax: 60_000, marginalRate: 0.0015 },
  { minExclusive: 150_000_000, maxInclusive: 300_000_000, baseTax: 195_000, marginalRate: 0.0025 },
  { minExclusive: 300_000_000, maxInclusive: null, baseTax: 570_000, marginalRate: 0.004 },
];

const HOUSING_SINGLE_HOME_SPECIAL_BRACKETS: ProgressiveTaxBracket[] = [
  { minExclusive: 0, maxInclusive: 60_000_000, baseTax: 0, marginalRate: 0.0005 },
  { minExclusive: 60_000_000, maxInclusive: 150_000_000, baseTax: 30_000, marginalRate: 0.001 },
  { minExclusive: 150_000_000, maxInclusive: 300_000_000, baseTax: 120_000, marginalRate: 0.002 },
  { minExclusive: 300_000_000, maxInclusive: null, baseTax: 420_000, marginalRate: 0.0035 },
];
```

### 14-8. 계산 함수 상세

```ts
function calcProgressiveTax(taxBase: number, brackets: ProgressiveTaxBracket[]) {
  const bracket = brackets.find((item) => {
    if (taxBase <= item.minExclusive) return false;
    if (item.maxInclusive === null) return true;
    return taxBase <= item.maxInclusive;
  });

  if (!bracket) return 0;
  return bracket.baseTax + (taxBase - bracket.minExclusive) * bracket.marginalRate;
}

function calcHousingAnnualTax(input: PropertyTaxSeptemberInput) {
  const taxBase = input.housingPublicPrice * (input.fairMarketValueRatio / 100);
  const brackets = input.useSingleHomeSpecialRate
    ? HOUSING_SINGLE_HOME_SPECIAL_BRACKETS
    : HOUSING_GENERAL_BRACKETS;
  return calcProgressiveTax(taxBase, brackets);
}

function calcSeptemberHousingByJulyAmount(input: PropertyTaxSeptemberInput) {
  if (input.paidAllInJuly) return 0;
  return input.julyHousingAmount;
}

function calcSeptemberTotal(input: PropertyTaxSeptemberInput) {
  const septemberHousingTax = input.mode === 'july'
    ? calcSeptemberHousingByJulyAmount(input)
    : calcHousingAnnualTax(input) / 2;

  const landPropertyTax = input.includeLandTax
    ? calcLandPropertyTax(input.landTaxBase, input.landTaxType)
    : 0;

  return Math.max(
    0,
    septemberHousingTax
      + landPropertyTax
      + input.localEducationTax
      + input.regionalResourceFacilityTax
      - input.taxCreditAmount
  );
}
```

### 14-9. 입력 검증 규칙

| 입력값 | 허용 범위 | 오류 처리 |
|---|---:|---|
| 7월 고지액 | 0~50,000,000원 | 0이면 주택분 0원, 안내 문구 표시 |
| 공시가격 | 0~10,000,000,000원 | 0이면 공시가격 기준 결과 비활성 |
| 공정시장가액비율 | 1~100% | 범위 밖이면 오류 표시 |
| 토지 과세표준 | 0~10,000,000,000원 | 토지 포함 시 0이면 입력 요청 |
| 지방교육세 | 0~10,000,000원 | 선택 입력. 음수 불가 |
| 지역자원시설세 | 0~10,000,000원 | 선택 입력. 음수 불가 |
| 세액공제 | 0~납부액 합계 | 합계보다 크면 최종 0원 처리 |

모든 금액 입력은 쉼표 입력을 허용하고 내부에서는 숫자만 파싱한다. 사용자가 `만원` 단위로 착각하지 않도록 입력 라벨에 `원`을 명확히 표시한다.

### 14-10. 상태별 화면

| 상태 | 조건 | 화면 |
|---|---|---|
| 기본 상태 | 최초 진입 | 7월 고지액 기준, 25만 원 예시 |
| 7월 일시부과 | `paidAllInJuly=true` | 9월 주택분 0원, 일시부과 설명 강조 |
| 토지 포함 | `includeLandTax=true` | 토지분 결과 카드 활성 |
| 공시가격 추정 | `mode=house` | `추정` 배지와 고지서 확인 안내 |
| 직접 합산 | `mode=manual` | 사용자가 입력한 항목 합계만 표시 |
| 납부기한 임박 | 현재 날짜가 9월 16~30일 | D-day 또는 `납부기간 중` 배지 |
| 납부기한 경과 | 현재 날짜가 10월 이후 | `2026년 납부기간은 지났습니다` 안내 |

### 14-11. 결과 인사이트 규칙

| 조건 | 문구 방향 |
|---|---|
| 7월 고지액 기준, 일시부과 아님 | 9월 주택분도 7월과 비슷하게 예상된다는 표현 |
| 7월 일시부과 | 9월 주택분 고지서가 없을 수 있다는 표현 |
| 토지분 포함 | 9월에는 토지분 때문에 7월보다 커질 수 있다는 표현 |
| 공시가격 기준 | 단순 추정이며 세부담 상한·감면 반영 전이라는 표현 |
| 세액공제 입력 | 전자송달·자동이체 등 공제 적용 후 예산이라는 표현 |
| 결과 0원 | 입력값 또는 일시부과 여부 확인 안내 |

### 14-12. 접근성 설계

- 계산 모드는 탭처럼 보이더라도 버튼 그룹으로 구현하고 선택 상태를 `aria-pressed`로 표시한다.
- 결과 총액은 `aria-live="polite"`로 갱신한다.
- 날짜와 납부기간은 색상뿐 아니라 텍스트로도 상태를 전달한다.
- `추정`, `고지서 확인`, `일시부과 가능` 배지는 텍스트 라벨을 포함한다.
- 표의 세율 구간은 모바일에서 카드형으로 전환하거나 가로 스크롤을 허용하되, 첫 열이 잘리지 않게 한다.
- 금액 입력 필드는 모바일 숫자 키패드가 뜨도록 `inputmode="numeric"`을 사용한다.

### 14-13. 컴포넌트 구조 제안

| 영역 | 컴포넌트/마크업 역할 |
|---|---|
| Hero | H1, 납부기간 요약, 핵심 CTA |
| DueNotice | 9월 16일~9월 30일 납부기간 안내 |
| ModeSelector | 7월 고지액 / 공시가격 / 토지 / 직접 합산 |
| JulyAmountForm | 7월 고지액, 입력 기준, 일시부과 토글 |
| HousingEstimateForm | 공시가격, 공정시장가액비율, 특례 선택 |
| LandTaxForm | 토지 유형, 과세표준 |
| AdditionalTaxForm | 지방교육세, 지역자원시설세, 세액공제 |
| ResultSummary | 9월 예상 납부액 메인 카드 |
| ResultBreakdown | 주택·토지·부가세목 분해 |
| PaymentGuide | 위택스·이택스·지자체 고지서 확인 |
| TaxRateTables | 주택·토지 세율표 |
| Checklist | 납부 전 확인 |
| FAQ | 자주 묻는 질문 |
| Sources | 공식 출처 |

### 14-14. 파일 구조 제안

```text
src/data/propertyTaxSeptemberPaymentCalculator2026.ts
src/pages/tools/property-tax-september-payment-calculator-2026.astro
public/scripts/property-tax-september-payment-calculator-2026.js
src/styles/scss/pages/_property-tax-september-payment-calculator-2026.scss
```

세금 계산기는 세율표와 안내 문구가 길기 때문에 전용 SCSS 파일 분리를 권장한다. 단, 기존 계산기 공통 컴포넌트 스타일이 있으면 입력 폼·결과 카드·FAQ는 공통 클래스를 우선 재사용한다.

### 14-15. 데이터 파일 내보내기 항목

```ts
export const PROPERTY_TAX_SEPTEMBER_META = {};
export const PROPERTY_TAX_SEPTEMBER_DUE_DATES = {};
export const HOUSING_GENERAL_BRACKETS = [];
export const HOUSING_SINGLE_HOME_SPECIAL_BRACKETS = [];
export const LAND_AGGREGATE_BRACKETS = [];
export const LAND_SEPARATE_BRACKETS = [];
export const PROPERTY_TAX_SEPTEMBER_FAQ = [];
export const PROPERTY_TAX_SEPTEMBER_CHECKLIST = [];
export const PROPERTY_TAX_SEPTEMBER_RELATED_TOOLS = [];
export function calculatePropertyTaxSeptemberPayment(input) {}
```

### 14-16. JSON-LD 설계

페이지에는 기본 `SoftwareApplication` 또는 `WebApplication` 구조화 데이터를 넣고, FAQ가 충분하면 `FAQPage` JSON-LD를 추가한다.

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "재산세 9월분 납부액 계산기 2026",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "inLanguage": "ko-KR"
}
```

FAQPage는 실제 페이지에 노출된 질문·답변과 완전히 일치해야 한다.

### 14-17. 예시 시나리오

| 시나리오 | 입력 | 기대 결과 방향 |
|---|---|---|
| 주택 기본형 | 7월 고지액 25만 원, 일시부과 아님 | 9월 주택분 약 25만 원 |
| 일시부과형 | 7월 고지액 18만 원, 일시부과 예 | 9월 주택분 0원 가능성 안내 |
| 토지 포함형 | 7월 고지액 25만 원 + 토지 과세표준 1억 원 | 주택분과 토지분 합산 표시 |
| 공시가격형 | 공시가격 6억 원, 비율 60%, 1세대 1주택 | 특례 세율 기준 연세액과 9월분 추정 |
| 직접 합산형 | 주택·토지·지방교육세 직접 입력 | 입력 항목 합계와 공제 반영 |

### 14-18. QA 체크리스트

- [ ] 7월 일시부과 토글을 켜면 9월 주택분이 0원으로 바뀐다.
- [ ] 토지 포함 토글을 꺼도 기존 토지 입력값이 최종 합계에 남지 않는다.
- [ ] 공시가격 0원일 때 세율 계산이 NaN으로 나오지 않는다.
- [ ] 공정시장가액비율 60 입력 시 60%로 계산되고 0.6과 혼동하지 않는다.
- [ ] 주택 일반 세율과 1세대 1주택 특례 세율이 각각 다른 결과를 낸다.
- [ ] 과세표준이 정확히 구간 경계값일 때 올바른 구간이 적용된다.
- [ ] 지방교육세·지역자원시설세 직접 입력이 합계에 반영된다.
- [ ] 세액공제가 합계보다 커도 최종 납부액이 음수가 되지 않는다.
- [ ] 모바일에서 세율표와 결과 금액이 넘치지 않는다.
- [ ] URL 파라미터로 공유한 값이 새로고침 후 유지된다.
- [ ] `추정`, `고지서 확인` 배지가 결과 영역에 노출된다.
- [ ] `npm run build`가 통과한다.

### 14-19. 출시 전 리스크

| 리스크 | 영향 | 대응 |
|---|---|---|
| 공정시장가액비율 최신 기준 미확인 | 공시가격 기준 결과 오차 | 구현 직전 공식 확인, 기본값 출처 표시 |
| 지방교육세·지역자원시설세 단순화 | 고지서와 차이 발생 | 직접 입력 우선, 자동 추정은 선택 옵션 |
| 지자체 조례 차이 | 일시부과·감면 차이 발생 | `지자체 고지서 확인` 안내 강화 |
| 토지 과세 유형 오선택 | 토지분 결과 크게 달라짐 | 유형 설명과 고지서 기준 확인 문구 |
| 세부담 상한 미반영 | 공시가격 기준 과대 추정 | 결과에 `세부담 상한·감면 미반영` 표시 |

### 14-20. 출시 후 개선 아이디어

- 7월 고지액을 입력하면 9월 자동이체 납부일 캘린더 문구 생성
- 주택·토지·상가를 가진 사용자를 위한 `9월 지방세 예산표`
- 위택스 납부 전 체크리스트 PDF 또는 이미지 저장
- 7월 재산세 페이지와 9월 재산세 페이지 간 상호 내부링크 강화
- 지역별 이택스·위택스 안내 분기

---

## 15. 공식 확인 출처

- 지방세법 제115조 납기: https://law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0115&lsiSeq=282559&urlMode=lsScJoRltInfoR
- 지방세법 제111조 세율: https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0111&lsiSeq=282559&urlMode=lsScJoRltInfoR
- 지방세법 제111조의2 1세대 1주택 세율 특례: https://www.law.go.kr/lsSideInfoP.do?chrClsCd=010202&docCls=jo&joBrNo=02&joNo=0111&lsId=&lsiSeq=282559&urlMode=lsScJoRltInfoR

구현 전 추가 확인:

- 2026년 공정시장가액비율
- 지방교육세·지역자원시설세 적용 기준
- 지자체별 조례와 감면 기준
- 위택스·이택스 납부 안내 최신 문구
