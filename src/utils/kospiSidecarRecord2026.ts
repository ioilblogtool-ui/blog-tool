import type { KsrEvent, KsrSnapshot, KsrSource } from "../data/kospiSidecarRecord2026";

// 스냅샷 시계열이 서로 모순되지 않는지 빌드 시 검사한다. 실패하면 빌드를 멈춘다.
export function validateSnapshots(snapshots: KsrSnapshot[], sources: KsrSource[]): void {
  const sourceIds = new Set(sources.map((s) => s.id));
  const byMarket = new Map<string, KsrSnapshot[]>();
  for (const snap of snapshots) {
    if (!sourceIds.has(snap.sourceId)) throw new Error(`[ksr] 출처 없음: ${snap.sourceId}`);
    if (snap.total !== null && snap.sell !== null && snap.buy !== null && snap.sell + snap.buy !== snap.total) {
      throw new Error(`[ksr] ${snap.asOf} ${snap.market} 합계 불일치: ${snap.sell}+${snap.buy}≠${snap.total}`);
    }
    byMarket.set(snap.market, [...(byMarket.get(snap.market) ?? []), snap]);
  }
  for (const [market, list] of byMarket) {
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1];
      const cur = list[i];
      if (cur.asOf <= prev.asOf) throw new Error(`[ksr] ${market} 스냅샷 날짜 순서 오류: ${cur.asOf}`);
      if (prev.total !== null && cur.total !== null && cur.total < prev.total) {
        throw new Error(`[ksr] ${market} 누적 감소: ${prev.total} → ${cur.total}`);
      }
    }
  }
}

export function validateEvents(events: KsrEvent[], sources: KsrSource[]): void {
  const sourceIds = new Set(sources.map((s) => s.id));
  for (const ev of events) {
    if (!sourceIds.has(ev.sourceId)) throw new Error(`[ksr] 이벤트 출처 없음: ${ev.sourceId}`);
  }
}

export function latestSnapshot(snapshots: KsrSnapshot[], market: KsrSnapshot["market"]): KsrSnapshot | null {
  return snapshots.filter((s) => s.market === market).sort((a, b) => b.asOf.localeCompare(a.asOf))[0] ?? null;
}

export function ratio(value: number, base: number): number {
  return value / base;
}

// 직전 스냅샷 대비 증가분
export function increments(snapshots: KsrSnapshot[], market: KsrSnapshot["market"]) {
  const list = snapshots.filter((s) => s.market === market);
  return list.map((s, i) => ({
    asOf: s.asOf,
    delta: i === 0 || s.total === null || list[i - 1].total === null ? null : s.total - (list[i - 1].total as number),
  }));
}

export function formatDateKo(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${Number(m[2])}월 ${Number(m[3])}일`;
}
