// 코스피 레버리지 ETF 계산기: 빌드 시 원금 회복 비교표를 만드는 순수 함수.
// 클라이언트 JS(public/scripts/kospi-leverage-etf-calculator.js)의 같은 이름 함수와 산식이 같아야 한다.

export type KlcRecoveryRow = {
  dropPct: number;
  days: number;
  leverageValue: number;
  etfRecoveryNeeded: number;
  indexRecoveryNeeded: number | null;
};

export function splitDaily(totalReturn: number, days: number): number[] {
  return Array(days).fill(Math.pow(1 + totalReturn, 1 / days) - 1);
}

export function leveragedValue(returns: number[], multiple: number): number {
  return returns.reduce((acc, r) => acc * (1 + Math.max(multiple * r, -1)), 1);
}

// 레버리지 누적 가치 L에서 원금 1로 돌아가기 위해, days일 균등 반등을 가정할 때 필요한 지수 총 상승률
export function indexRecoveryNeeded(L: number, multiple: number, days: number): number | null {
  if (L >= 1) return 0;
  if (L <= 0) return null;
  const target = 1 / L;
  const lev = (T: number) => leveragedValue(splitDaily(T, days), multiple);
  let lo = 0;
  let hi = 10;
  if (lev(hi) < target) return null;
  for (let i = 0; i < 200 && hi - lo > 1e-12; i++) {
    const mid = (lo + hi) / 2;
    if (lev(mid) >= target) hi = mid;
    else lo = mid;
  }
  return hi;
}

export function buildRecoveryRows(drops: number[], splits: number[], multiple = 2): KlcRecoveryRow[] {
  return drops.flatMap((dropPct) =>
    splits.map((days) => {
      const leverageValue = leveragedValue(splitDaily(-dropPct / 100, days), multiple);
      return {
        dropPct,
        days,
        leverageValue,
        etfRecoveryNeeded: 1 / leverageValue - 1,
        indexRecoveryNeeded: indexRecoveryNeeded(leverageValue, multiple, days),
      };
    }),
  );
}
