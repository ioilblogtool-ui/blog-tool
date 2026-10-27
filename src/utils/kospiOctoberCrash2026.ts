import type { KocBasePoint, KocSource } from "../data/kospiOctoberCrash2026";

export function pctChange(from: number, to: number): number | null {
  return from > 0 ? to / from - 1 : null;
}

export function recoveryNeeded(from: number, to: number): number | null {
  return to > 0 ? from / to - 1 : null;
}

// 기간 내 최저 종가
export function lowestClose(series: [string, number][], start: string, end: string): [string, number] {
  const inRange = series.filter(([d]) => d >= start && d <= end);
  if (inRange.length === 0) throw new Error(`[koc] ${start}~${end} 구간에 종가가 없습니다`);
  return inRange.reduce((min, cur) => (cur[1] < min[1] ? cur : min));
}

// 데이터 정합성 검사. 실패하면 빌드를 멈춘다.
export function validateKocData(
  series: [string, number][],
  basePoints: KocBasePoint[],
  sourceIdsInUse: string[],
  sources: KocSource[],
): void {
  for (let i = 1; i < series.length; i++) {
    if (series[i][0] <= series[i - 1][0]) throw new Error(`[koc] 날짜 순서 오류: ${series[i][0]}`);
    if (!(series[i][1] > 0)) throw new Error(`[koc] 종가 오류: ${series[i][0]}`);
  }
  const byDate = new Map(series);
  for (const bp of basePoints) {
    if (byDate.get(bp.date) !== bp.close) throw new Error(`[koc] 기준점 ${bp.id} 종가가 시계열과 다릅니다`);
  }
  const ids = new Set(sources.map((s) => s.id));
  for (const id of sourceIdsInUse) {
    if (!ids.has(id)) throw new Error(`[koc] 출처 없음: ${id}`);
  }
}

export function formatPct(value: number | null, digits = 2): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const fixed = Math.abs(value * 100).toFixed(digits);
  if (Number(fixed) === 0) return `${Number(0).toFixed(digits)}%`;
  return `${value > 0 ? "+" : "−"}${fixed}%`;
}

export function formatIndex(value: number): string {
  return value.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 억원 → "3조 6,241억원" 형태
export function formatEok(value: number): string {
  const sign = value < 0 ? "−" : value > 0 ? "+" : "";
  const abs = Math.abs(Math.round(value));
  const jo = Math.floor(abs / 10000);
  const eok = abs % 10000;
  const body = jo > 0 ? `${jo.toLocaleString("ko-KR")}조${eok > 0 ? ` ${eok.toLocaleString("ko-KR")}억` : ""}` : `${eok.toLocaleString("ko-KR")}억`;
  return `${sign}${body}원`;
}

export function formatDateKo(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${Number(m[2])}월 ${Number(m[3])}일` : iso;
}
