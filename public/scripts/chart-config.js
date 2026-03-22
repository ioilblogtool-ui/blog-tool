/**
 * chart-config.js — Chart.js 공통 설정 & 헬퍼
 *
 * CDN (사용 페이지의 <head> 또는 모듈 스크립트 직전에 삽입):
 *   https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js
 *
 * 이 파일을 import 하는 .js는 type="module"로 로드해야 합니다.
 * Chart 생성자는 window.Chart (UMD CDN) 를 통해 접근합니다.
 */

// ── 브랜드 색상 팔레트 ────────────────────────────────────────────────────────
export const CHART_COLORS = {
  brand:   "#1D9E75",  // 메인 브랜드 (Teal) — 삼성전자용
  accent:  "#534AB7",  // 리포트 강조 (보라) — SK하이닉스용
  warning: "#BA7517",  // 추정값 amber     — 현대차용
  gray:    "#888780",  // 비활성 / 데이터 없음
};

// ── 폰트 패밀리 헬퍼 ─────────────────────────────────────────────────────────
// CSS --font-sans 변수를 읽거나, 없으면 시스템 폰트 fallback
function getFontFamily() {
  try {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-sans")
      .trim();
    return v || '"Pretendard", "Noto Sans KR", system-ui, sans-serif';
  } catch {
    return '"Pretendard", "Noto Sans KR", system-ui, sans-serif';
  }
}

// ── 숫자 포맷: 한국식 짧은 단위 ──────────────────────────────────────────────
/**
 * formatKRW(n) — 금액을 읽기 쉬운 단위로 변환
 *   100,000,000 이상 → '1.2억'
 *   10,000 이상      → '3,400만'
 *   10,000 미만      → '200원'
 */
export function formatKRW(n) {
  const num = Math.round(Number(n) || 0);
  if (num >= 100_000_000) {
    return `${(num / 100_000_000).toFixed(1)}억`;
  }
  if (num >= 10_000) {
    return `${Math.round(num / 10_000).toLocaleString("ko-KR")}만`;
  }
  return `${num.toLocaleString("ko-KR")}원`;
}

// ── 공통 Chart.js 기본 옵션 빌더 ─────────────────────────────────────────────
/**
 * buildDefaultOptions(overrides?)
 *   animation 400ms, responsive, 시스템 폰트 등 공통값 반환.
 *   overrides는 얕은 병합 (plugins 등 깊은 키는 직접 추가).
 */
export function buildDefaultOptions(overrides = {}) {
  return {
    animation: { duration: 400 },
    responsive: true,
    maintainAspectRatio: false,
    font: { family: getFontFamily(), size: 12 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(23,32,51,0.88)",
        titleFont:  { size: 12, weight: "600", family: getFontFamily() },
        bodyFont:   { size: 11, family: getFontFamily() },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    ...overrides,
  };
}

// ── 막대 끝 인라인 레이블 플러그인 ───────────────────────────────────────────
/**
 * makeLabelPlugin(formatFn)
 *   Chart.js 4.x용 인라인 데이터 레이블 플러그인.
 *   datalabels CDN 없이 afterDatasetsDraw 훅으로 직접 그립니다.
 *
 *   formatFn: (rawValue: number) => string
 *   - 가로 bar (indexAxis:'y') → 막대 오른쪽 끝 바깥에 표시
 *   - 세로 bar              → 막대 상단 바깥에 표시
 */
export function makeLabelPlugin(formatFn) {
  return {
    id: "inlineLabel",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const isHorizontal = chart.options.indexAxis === "y";
      const font = `500 11px ${getFontFamily()}`;

      chart.data.datasets.forEach((dataset, dsIdx) => {
        const meta = chart.getDatasetMeta(dsIdx);
        meta.data.forEach((bar, i) => {
          const raw = dataset.data[i];
          if (!raw) return;

          const label = formatFn(raw);
          ctx.save();
          ctx.font = font;
          ctx.fillStyle = "#172033";

          if (isHorizontal) {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(label, bar.x + 6, bar.y);
          } else {
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(label, bar.x, bar.y - 4);
          }

          ctx.restore();
        });
      });
    },
  };
}
