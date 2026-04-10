# 아기 성장 백분위 계산기 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/baby-growth-percentile-calculator.md`
- 구현 대상: `아기 성장 백분위 계산기`
- 참고 계산기: `formula-cost`, `diaper-cost`, `birth-support-total`, `home-purchase-fund`

### 1-2. 전제
- 이번 페이지는 `/reports/`형 장문 콘텐츠가 아니라 `/tools/`형 실시간 계산기 구조를 따른다.
- 사용자가 한 번 입력하면 `성장 백분위`, `수유량 참고`, `발달 체크`, `예방접종`까지 한 화면에서 이어서 읽는 흐름이 핵심이다.
- 의료 진단 도구처럼 보이지 않도록 결과는 반드시 `참고`, `추정`, `상담 권장` 톤으로 표기한다.
- 첫 오픈은 0~24개월 기준 데이터를 중심으로 단순하고 신뢰 가능한 구조를 우선한다.

### 1-3. 문서 역할
- 비교계산소 기준으로 실제 구현 가능한 수준의 화면 구조, 상태 흐름, 데이터 파일 구조, 계산 로직, QA 포인트를 고정한다.
- Claude/Codex가 이 문서를 기준으로 바로 구현에 들어갈 수 있도록 한다.

### 1-4. 페이지 성격
- 계산기 + 가이드형 육아 도구
- 핵심 흐름: `입력 -> 성장 백분위 결과 -> 수유량 참고 -> 발달 체크 -> 예방접종 안내`
- 첫 화면에서 입력과 핵심 결과가 빠르게 보여야 하며, 아래로 갈수록 월령별 상세 가이드가 이어진다.

### 1-5. 권장 slug
- `baby-growth-percentile-calculator`
- URL: `/tools/baby-growth-percentile-calculator/`

### 1-6. 권장 파일 구조
- `src/data/babyGrowthPercentile.ts`
- `src/pages/tools/baby-growth-percentile-calculator.astro`
- `public/scripts/baby-growth-percentile-calculator.js`
- `src/styles/scss/pages/_baby-growth-percentile-calculator.scss`
- `public/og/tools/baby-growth-percentile-calculator.png`

---

## 2. 현재 계산기 구조 참고 기준

### 2-1. 공통 구조
현재 `/tools/` 계산기 페이지는 아래 구조를 기본으로 한다.
1. `CalculatorHero`
2. `ToolActionBar`
3. 입력 패널
4. 요약 결과 카드
5. 상세 비교/가이드 블록
6. `InfoNotice`
7. `SeoContent`

### 2-2. 이번 페이지에서 재사용할 패턴
- `formula-cost`
  - 입력값과 결과가 한 화면에서 빠르게 보이는 simple calculator 패턴
- `diaper-cost`
  - 육아 카테고리용 한국어 설명 톤, 결과 카드 밀도
- `birth-support-total`
  - 타임라인형 월령/시기 안내 섹션 구성 감각
- `home-purchase-fund`
  - 큰 숫자 입력과 실시간 카드 갱신 패턴

### 2-3. 이번 페이지에서 새롭게 필요한 것
- 성장 백분위 결과를 시각적으로 보여주는 `percentile-bar` 또는 `gauge-chip`
- 월령 기준으로 아래 안내 블록이 함께 바뀌는 구조
- `상담 권장` 같은 주의 문구를 단순 경고가 아닌 안내 카드 형태로 제공

---

## 3. 페이지 목적
- 보호자가 아기의 현재 성장 수치를 또래 대비 직관적으로 확인하게 한다.
- 같은 입력으로 수유량, 발달 체크, 예방접종까지 연속적으로 보게 해 체류 시간을 높인다.
- 검색 유입용 키워드와 도구형 UX를 함께 만족시키는 육아 허브 계산기로 만든다.

---

## 4. 핵심 사용자 시나리오

### 4-1. 성장 상태 확인
- 사용자가 성별, 생년월일, 측정일, 몸무게/키/머리둘레를 입력한다.
- 현재 월령과 각 항목 백분위를 확인한다.
- 평균 범위인지, 추세 관찰이 필요한지 한 줄 해석을 읽는다.

### 4-2. 수유량 참고 확인
- 입력된 월령과 체중 기준으로 하루 총 수유량, 1회 수유량, 하루 횟수 참고 범위를 본다.
- 이유식 시작/병행 시기 안내를 함께 본다.

### 4-3. 발달 체크 확인
- 현재 월령 기준 발달 체크리스트를 확인한다.
- 이번 달 체크 포인트와 다음 단계 미리 보기를 함께 읽는다.
- 특정 신호가 있으면 상담 권장 문구를 본다.

### 4-4. 예방접종 일정 확인
- 생년월일과 현재 시점 기준으로 현재 구간 예방접종 안내를 본다.
- 다음 예정 접종과 공식 사이트 링크를 확인한다.

---

## 5. 입력값 / 출력값 정의

### 5-1. 입력값
- `sex`
  - `male` | `female`
- `birthDate`
  - 날짜
- `measureDate`
  - 날짜, 기본값 오늘
- `weightKg`
  - 소수 입력 허용, 예: `6.8`
- `heightCm`
  - 소수 입력 허용, 예: `64.2`
- `headCircumferenceCm`
  - 소수 입력 허용, 예: `41.5`
- `useCorrectedAge`
  - boolean
- `prematureWeeks`
  - 선택 입력, 교정월령 계산 시 사용

### 5-2. 핵심 출력값
- `chronologicalMonths`
- `correctedMonths`
- `effectiveMonths`
- `weightPercentile`
- `heightPercentile`
- `headPercentile`
- `growthSummary`
- `growthFlags[]`

### 5-3. 보조 출력값
- `feedingGuide`
  - 하루 총 수유량 범위
  - 1회 수유량 범위
  - 수유 횟수 참고
  - 이유식 참고 문구
- `developmentChecklist`
  - 이번 달 체크
  - 다음 단계 미리 보기
  - 상담 권장 신호
- `vaccinationStatus`
  - 현재 권장 접종군
  - 다음 접종 예정
  - 공식 링크

---

## 6. 섹션 구조

### 6-1. 히어로
- 제목: 아기 성장 백분위 계산기
- 설명: 몸무게, 키, 머리둘레를 입력하면 또래 대비 성장 위치와 월령별 육아 체크 정보를 확인할 수 있다는 점을 한 줄로 설명

### 6-2. 입력 패널
- 성별 라디오
- 생년월일 / 측정일
- 몸무게 / 키 / 머리둘레 입력
- 교정월령 사용 체크박스
- 조산 주수 입력은 교정월령 체크 시 노출
- `계산하기` 버튼 없이 실시간 반영 구조를 기본으로 하되, 모바일 입력 완료 감각을 위해 하단에 작은 상태 문구 제공 가능

### 6-3. 결과 요약 카드
- 현재 월령
- 체중 백분위
- 키 백분위
- 머리둘레 백분위
- 한 줄 해석

### 6-4. 성장 해석 섹션
- 항목별 위치 설명
- `단일 수치보다 추세가 중요` 안내
- `이럴 땐 상담 권장` 문구
- 백분위 위치를 바 형태로 시각화

### 6-5. 수유량 가이드 섹션
- 하루 총 수유량 참고 범위
- 1회 수유량 예시
- 하루 수유 횟수 예시
- 이유식 병행 시기
- 참고용 안내 배지

### 6-6. 발달 체크 섹션
- 이번 달 체크 포인트 카드
- 다음 달 미리 보기 카드
- 상담 권장 신호 카드
- 영역별 태그: 인지/감각, 사회성, 언어, 대근육, 소근육

### 6-7. 예방접종 섹션
- 현재 시기 주요 접종 카드
- 다음 예정 접종 카드
- 확인 필요 항목
- 공식 예방접종 도우미 링크

### 6-8. 안내/주의사항
- 의료 진단이 아닌 참고용 도구라는 점
- 이상 소견, 성장 정체, 급격한 변화 시 전문 상담 권장

### 6-9. SEO 콘텐츠
- 계산 기준
- 백분위 해석법
- 수유량은 왜 참고 범위인지
- FAQ
- 관련 계산기/리포트 링크

---

## 7. 컴포넌트 구조
- `BaseLayout`
- `SiteHeader`
- `SimpleToolShell`
- `CalculatorHero`
- `ToolActionBar`
- `InfoNotice`
- `SeoContent`
- 페이지 내부 전용 블록
  - `growth-kpi-grid`
  - `percentile-bar-card`
  - `feeding-guide-card`
  - `development-check-card`
  - `vaccination-card`
  - `consult-note-card`

권장 구조:
- 좌측 또는 상단: 입력 패널
- 우측 또는 하단: 결과 카드 + 가이드 섹션
- 모바일: `입력 -> 결과 카드 -> 성장 해석 -> 수유량 -> 발달 -> 예방접종`

---

## 8. 상태 관리 포인트
- 바닐라 JS 기준 DOM 직접 조회 패턴 유지
- URL 파라미터로 입력 상태 복원
  - `sex`
  - `birth`
  - `measure`
  - `w`
  - `h`
  - `hc`
  - `corrected`
  - `preterm`
- 입력 변경 시 결과 카드와 하위 3개 가이드 섹션을 동시에 갱신
- 교정월령 체크 시 관련 필드 노출/숨김
- 숫자 범위 오류는 인라인 에러와 결과 숨김으로 처리

---

## 9. 계산 로직

### 9-1. 월령 계산
- 기본 월령은 `measureDate - birthDate` 기준 일수 차이를 개월 수로 환산
- 단순 표시용은 `개월 수 + 남은 일수` 또는 `소수 1자리 개월`
- 내부 계산용 `effectiveMonths`는 성장 테이블 참조용으로 정수 또는 반올림 값 사용

### 9-2. 교정월령 계산
- `useCorrectedAge = true` 이고 조산 주수가 입력된 경우
- `correctedDays = chronologicalDays - ((40 - gestationalWeeksAtBirth) * 7)`
- 음수면 0 처리
- 24개월 초과 시 교정월령 표시를 약화하거나 참고 문구만 유지

### 9-3. 백분위 계산
- 성별 + 월령 기준 reference table 사용
- 각 지표별 기준값에서 선형 보간 또는 구간 매칭 사용
- 1차 오픈은 퍼센타일 앵커 테이블 기반 근사 계산 허용
  - 예: P3 / P10 / P25 / P50 / P75 / P90 / P97
- 출력은 `정수 %` 또는 `5% 단위 반올림`

### 9-4. 성장 해석 규칙
- 10~90%: 평균 범위
- 3~10% 또는 90~97%: 경계 관찰 구간
- 3% 미만 또는 97% 초과: 추세 확인/상담 권장
- 세 항목 모두 정상 범위인지, 한 항목만 벗어나는지에 따라 문구 분기

### 9-5. 수유량 가이드
- 월령 구간별 기본 테이블 사용
- 체중 기반 참고 범위 보정
- 1차 오픈은 의료 계산이 아닌 범위형 가이드만 제공
  - 예: `kg당 120~150ml` 식의 월령별 참고 범위
- 이유식/분유/모유 혼합 여부는 1차에서는 입력받지 않고 월령 안내 문구로 처리

### 9-6. 발달 체크
- 월령 구간별 static checklist 데이터 사용
- 현재 월령에 맞는 섹션과 다음 월령 구간 미리 보기 반환
- 특정 경고 문구는 월령 구간별 `consultFlags` 배열로 별도 관리

### 9-7. 예방접종 안내
- 국가예방접종 표준 스케줄을 단순화한 static data 사용
- `birthDate`, `measureDate` 기준으로 현재 월령 구간에 해당하는 항목 매핑
- 실제 접종 여부 추적은 하지 않음
- 결과는 `현재 권장`, `곧 예정`, `공식 사이트 확인` 3단 구조

---

## 10. 데이터 파일 구조

권장 파일: `src/data/babyGrowthPercentile.ts`

```ts
export interface GrowthReferencePoint {
  month: number;
  p3: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p97: number;
}

export interface FeedingGuideItem {
  monthFrom: number;
  monthTo: number;
  dailyMlMin: number;
  dailyMlMax: number;
  feedsPerDay: string;
  note: string;
}

export interface DevelopmentGuideItem {
  monthFrom: number;
  monthTo: number;
  thisMonth: string[];
  nextMonth: string[];
  consultFlags: string[];
}

export interface VaccinationGuideItem {
  monthFrom: number;
  monthTo: number;
  currentShots: string[];
  nextShots: string[];
  note: string;
}
```

권장 export 구성:
- `BABY_GROWTH_DEFAULT_INPUT`
- `BABY_WEIGHT_REFERENCE_MALE`
- `BABY_WEIGHT_REFERENCE_FEMALE`
- `BABY_HEIGHT_REFERENCE_MALE`
- `BABY_HEIGHT_REFERENCE_FEMALE`
- `BABY_HEAD_REFERENCE_MALE`
- `BABY_HEAD_REFERENCE_FEMALE`
- `BABY_FEEDING_GUIDE`
- `BABY_DEVELOPMENT_GUIDE`
- `BABY_VACCINATION_GUIDE`
- `BABY_GROWTH_FAQ`
- `BABY_GROWTH_EXTERNAL_LINKS`

---

## 11. 구현 순서
1. `src/data/babyGrowthPercentile.ts` 생성
   - 기본 입력값
   - 성장 reference table
   - 수유량 / 발달 / 예방접종 static data
2. `src/pages/tools/baby-growth-percentile-calculator.astro` 생성
   - Hero, 입력 패널, 결과 카드, 가이드 섹션, InfoNotice, SeoContent
3. `public/scripts/baby-growth-percentile-calculator.js` 생성
   - 입력 파싱
   - 월령 계산
   - 백분위 계산
   - 가이드 매핑
   - URL 파라미터 저장/복원
4. `src/styles/scss/pages/_baby-growth-percentile-calculator.scss` 생성
   - percentile bar
   - 육아 가이드 카드
   - 모바일 우선 spacing
5. `src/data/tools.ts` 등록
6. `src/styles/app.scss` import 추가
7. `public/sitemap.xml` 추가
8. 빌드 및 수동 QA

---

## 12. QA 체크포인트
- 첫 진입 시 기본값으로 결과가 즉시 보이는가
- 생년월일 > 측정일 입력 시 오류 처리되는가
- 성별 전환 시 백분위 결과가 정상 변경되는가
- 교정월령 on/off 시 월령과 결과가 함께 바뀌는가
- 몸무게/키/머리둘레 미입력 시 인라인 에러가 적절한가
- 0개월, 24개월 경계값에서 계산이 깨지지 않는가
- 백분위가 0 또는 100으로 잘못 고정되지 않는가
- 수유량 / 발달 / 예방접종 섹션이 현재 월령 기준으로 같이 바뀌는가
- 결과 문구에 `정상`, `문제 없음` 같은 단정 표현이 과하지 않은가
- 의료기관 진단처럼 보이지 않도록 `참고`, `상담 권장` 고지가 보이는가
- 모바일에서 입력 패널과 결과 카드가 과하게 길어지지 않는가
- URL 공유 후 동일 입력 상태가 복원되는가
- `npm run build` 통과 여부

---

## 13. 구현 시 주의사항
- 의학적 진단·처방처럼 보이는 문구 금지
- 결과는 `참고용`, `추세 확인`, `전문가 상담 권장` 중심으로 작성
- 공식 성장곡선 원문 전체 재현보다 비교계산소에 맞는 근사 reference table 구조를 우선한다
- 출처성 문구는 `질병관리청 예방접종`, `성장곡선 참고 기준`처럼 InfoNotice에 요약 표기한다
- 입력 단위는 `kg`, `cm`를 명확히 표시하고 모바일 숫자 입력 최적화(`inputmode`)를 사용한다

---

## 14. 관련 내부 링크 권장
- `/tools/diaper-cost/`
- `/tools/formula-cost/`
- `/tools/birth-support-total/`
- 추후 육아 허브 / 성장 리포트 페이지 추가 시 연결
