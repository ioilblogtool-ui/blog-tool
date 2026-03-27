# Code Skill Guide

## 목적
비교계산소에서 새 소스를 만들 때 일관된 품질로 생성하기 위한 코드 작업 기준 문서.

## 기본 생성 단위
새 도구를 추가할 때 기본적으로 아래 4개를 확인한다.

1. `src/data/tools.ts`
2. `src/pages/tools/<slug>.astro`
3. 필요 시 `public/scripts/<tool>.js` 또는 `public/scripts/tools.js`
4. 필요 시 `docs/PROJECT_MANAGEMENT.md` 업데이트

## slug 규칙
- 영어 소문자
- 하이픈 사용
- 의미가 분명해야 함
- 예: `salary`, `samsung-bonus-calculator`, `parental-leave-pay`

## 새 도구 페이지 기본 구조
- 제목
- 한 줄 설명
- ToolTabs
- 액션 바
- 입력 카드
- 요약 카드
- 상세 표
- 안내 박스

## 코드 스타일 원칙
- 기존 공통 컴포넌트 우선 재사용
- 페이지에서 반복되는 UI는 새 컴포넌트로 분리
- 계산 로직은 명확한 함수 단위로 작성
- 숫자 포맷은 기존 util 함수 흐름을 따른다
- 사용자 입력값 초기화 / 링크 복사 같은 기본 UX는 유지한다

## Chart.js 통합 패턴
차트가 필요한 계산기 페이지에 공통으로 적용하는 규칙.

### 로드 순서
Chart.js는 UMD CDN으로 먼저 동기 로드하고, 그 다음에 `type="module"` 스크립트를 로드한다.
`window.Chart`가 준비된 상태에서 모듈이 실행되어야 한다.

```html
<!-- .astro 파일 맨 아래 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/your-tool.js")}></script>
```

### 공유 모듈
`public/scripts/chart-config.js`에서 아래를 import해 쓴다.

```js
import { formatKRW, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";
```

- `formatKRW(value)` — 억/만원 단위 한국어 금액 포맷
- `buildDefaultOptions(overrides)` — 공통 Chart.js 옵션 기반 생성
- `makeLabelPlugin(formatter)` — 바 끝에 레이블 그리는 커스텀 플러그인

### 차트 종류별 규칙
| 차트 | indexAxis | 용도 | 높이 기준 |
|------|-----------|------|----------|
| 도넛 | - | 항목 구성 비율, 중앙 텍스트 총액 | 220px |
| 가로 바 | `"y"` | 직급·구간별 비교, 현재 위치 하이라이트 | 항목수 × 40px |
| 스택 바 (세로) | `"x"` | 연도별 누적 비교 | 220px |

### canvas ID 규칙
페이지 slug를 접두사로 사용한다.

```
sk-hynix-donut-chart
sk-hynix-rank-chart
sk-hynix-scenario-chart
```

### 차트 래퍼 CSS
canvas를 감싸는 wrapper div에 `position: relative`와 고정 높이를 반드시 지정한다.
`Chart.js`의 `responsive: true` + `maintainAspectRatio: false` 조합이 작동하려면 부모 높이가 확정되어야 한다.

```scss
.your-donut-wrap {
  position: relative;
  height: 220px;
  margin-bottom: 16px;
}
```

### 차트 업데이트
데이터 변경 시 애니메이션 없이 즉시 갱신하려면 `chart.update("none")`을 쓴다.

---

## 입력 UX 패턴

### 슬라이더 ↔ 숫자 입력 양방향 싱크
금액 입력이 있는 계산기에는 `<input type="range">`를 함께 제공해 터치 조작성을 높인다.

**HTML 구조 (`.astro`)**
```html
<label class="field">
  <span>연봉</span>
  <input id="selfSalaryInput" type="number" value="80000000" />
  <small id="selfSalaryHint"></small>
</label>
<div class="calc-slider-row">
  <input type="range" id="selfSalarySlider" class="calc-slider"
         min="30000000" max="300000000" step="1000000" value="80000000" />
  <span id="selfSalarySliderVal" class="calc-slider-val">8,000만원</span>
</div>
```

**JS 싱크 함수 구조**
```js
function syncSelfSalarySlider() {
  const val = Math.min(Math.max(Math.round(Number(selfSalaryInput?.value) || 0), MIN), MAX);
  if (slider) slider.value = val;
  if (valEl)  valEl.textContent = formatKoreanAmount(val);
}
// input 이벤트: 숫자 input 변경 → 슬라이더 반영
selfSalaryInput?.addEventListener("input", () => { syncSelfSalarySlider(); render(); });
// input 이벤트: 슬라이더 변경 → 숫자 input 반영
$("selfSalarySlider")?.addEventListener("input", () => {
  if (selfSalaryInput) selfSalaryInput.value = String($("selfSalarySlider").value);
  syncSelfSalarySlider();
  render();
});
```

### 라디오칩 토글 (mode-chip)
`<select>` 대신 라디오 버튼을 visually-hidden 처리하고 `<span>`을 카드처럼 스타일링해 탭·터치 친화적 토글을 만든다.

**HTML 구조**
```html
<div class="toggle-grid">
  <label class="mode-chip" id="payoutActualChip">
    <input type="radio" name="payoutMode" value="ACTUAL" checked />
    <span>2026 실제값</span>
  </label>
  <label class="mode-chip">
    <input type="radio" name="payoutMode" value="SCENARIO" />
    <span>시나리오</span>
  </label>
</div>
```

**JS에서 값 읽기**
```js
function getPayoutMode() {
  return document.querySelector('input[name="payoutMode"]:checked')?.value || "ACTUAL";
}
```

**특정 칩 비활성화 (조건부)**
```js
const actualInput = document.querySelector('input[name="payoutMode"][value="ACTUAL"]');
const actualChip  = document.getElementById("payoutActualChip");
const disable = year !== "2026";
actualInput.disabled      = disable;
actualChip.style.opacity      = disable ? "0.38" : "1";
actualChip.style.pointerEvents = disable ? "none" : "";
if (disable && actualInput.checked) { scenarioInput.checked = true; }
```

## 반응형 UI 기준
- 모바일을 기본 브레이크포인트로 먼저 설계한다.
- 핵심 입력과 핵심 결과는 모바일 첫 화면에서 최대한 빠르게 보이게 한다.
- 태블릿에서는 여백과 카드 배치를 정리해 답답하지 않게 만든다.
- PC에서는 넓어진 화면을 활용하되 과도한 빈 공간 없이 정보 밀도를 조절한다.
- 특정 환경 전용 UI보다 하나의 반응형 구조를 우선한다.

## 어떤 도구를 우선 만들 것인가
### 우선순위 높음
- 연봉 실수령
- 월급 실수령
- 성과급 계산
- 대기업 보상 계산
- 초봉 / 직급별 비교

### 우선순위 중간
- 육아 / 복지 확장 도구
- 정책성 계산기
- 비교 시뮬레이터

## SEO 관점 생성 기준
새 도구는 아래 조건을 만족하면 더 좋다.
- 검색 의도가 명확함
- 비교 의도가 존재함
- 가이드 문서로 확장 가능함
- 회사별 / 직급별 / 상황별 랜딩으로 파생 가능함

## 생성 후 체크리스트
- [ ] `src/data/tools.ts` 등록
- [ ] 도구 페이지 생성
- [ ] 제목 / 설명 / 메타 확인
- [ ] 모바일 레이아웃 점검
- [ ] 태블릿 / PC 반응형 확인
- [ ] `npm run build` 통과
- [ ] 추후 가이드 / 비교 페이지 확장 가능성 검토
- [ ] 차트가 있으면 Chart.js CDN이 모듈 `<script>` 보다 먼저 로드되는지 확인
- [ ] 슬라이더가 있으면 min/max/step이 숫자 input 범위와 일치하는지 확인

## 참고 문서
- 목표: `docs/MONTHLY_1M_GOAL.md`
- SEO: `docs/SEO_ADSENSE_ROADMAP.md`
- 운영: `docs/PROJECT_MANAGEMENT.md`
- 에이전트 기준: `AGENT.md`

## OG 이미지 생성 스크립트

비교계산소는 OG 이미지를 `public/og/` 아래 PNG로 관리한다.

### 스크립트
- 홈: `scripts/generate-og-home.py`
- 계산기/리포트: `scripts/generate-og-tools.py`

### 출력 경로
- 홈: `public/og/og-home.png`
- 계산기: `public/og/tools/<slug>.png`
- 리포트: `public/og/reports/<slug>.png`

### 실행
```bash
python scripts/generate-og-home.py
python scripts/generate-og-tools.py