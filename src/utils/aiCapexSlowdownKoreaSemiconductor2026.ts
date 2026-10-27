import type {
  AcsBadge,
  AcsCapexRow,
  AcsExposure,
  AcsMetric,
  AcsScenario,
  AcsSource,
} from "../data/aiCapexSlowdownKoreaSemiconductor2026";

export function shareOf(part: number, total: number): number {
  return part / total;
}

export function monthsOfExports(delta: number, monthly: number): number {
  return Math.abs(delta) / monthly;
}

// 원문을 확인하지 못한 값은 "공식"으로 보이지 않게 "참고"로 낮춘다.
export function resolveBadge(badge: AcsBadge, confirmed: boolean): AcsBadge {
  return badge === "공식" && !confirmed ? "참고" : badge;
}

export function validateAcsData(
  metrics: AcsMetric[],
  scenarios: AcsScenario[],
  capex: AcsCapexRow[],
  exposure: AcsExposure[],
  sources: AcsSource[],
): void {
  const ids = new Set(sources.map((s) => s.id));
  const check = (id: string, where: string) => {
    if (!ids.has(id)) throw new Error(`[acs] 출처 없음: ${id} (${where})`);
  };
  metrics.forEach((m) => m.sourceIds.forEach((id) => check(id, m.id)));
  scenarios.forEach((s) => s.sourceIds.forEach((id) => check(id, s.id)));
  capex.forEach((c) => check(c.sourceId, c.company));
  exposure.forEach((e) => e.facts.forEach((f) => f.sourceIds.forEach((id) => check(id, e.company))));
  const order = scenarios.map((s) => s.id).join(",");
  if (order !== "base,slow,bear") throw new Error(`[acs] 시나리오 순서 오류: ${order}`);
}

export type AcsScenarioView = {
  label: string;
  definition: string;
  exportText: string;
  monthsText: string | null;
  gdpText: string;
  badge: AcsBadge;
  footnotes: string[];
  barRatio: number;
};

export function buildScenarioViews(scenarios: AcsScenario[], monthlySemiExport: number) {
  const maxDelta = Math.max(...scenarios.map((s) => Math.abs(s.exportDeltaUsd100m)));
  return Object.fromEntries(
    scenarios.map((s) => {
      const footnotes = [...s.assumptions];
      let gdpText: string;
      let badge = s.badge;
      if (s.gdpDeltaPp === 0) {
        gdpText = "기본 전망 유지";
      } else if (s.id === "slow" && !s.gdpConfirmed) {
        // 우리 선형 계산값은 한국은행 원문 확인 전에는 노출하지 않는다.
        gdpText = "원문 확인 후 제공";
      } else if (s.gdpDeltaPp !== null) {
        gdpText = `약 ${s.gdpDeltaPp < 0 ? "−" : "+"}${Math.abs(s.gdpDeltaPp).toFixed(1)}%p`;
        if (!s.gdpConfirmed) {
          badge = resolveBadge(s.badge, false);
          footnotes.push("성장률 영향은 로이터 보도 인용(한국은행 원문 미확인)");
        }
      } else {
        gdpText = "—";
      }
      const months = s.exportDeltaUsd100m === 0 ? null : monthsOfExports(s.exportDeltaUsd100m, monthlySemiExport);
      return [
        s.id,
        {
          label: s.label,
          definition: s.definition,
          exportText: s.exportDeltaUsd100m === 0 ? "변화 없음" : `−${Math.abs(s.exportDeltaUsd100m).toLocaleString("ko-KR")}억 달러`,
          monthsText: months === null ? null : `9월 반도체 수출의 약 ${months.toFixed(2)}개월분`,
          gdpText,
          badge,
          footnotes,
          barRatio: maxDelta === 0 ? 0 : Math.abs(s.exportDeltaUsd100m) / maxDelta,
        } satisfies AcsScenarioView,
      ];
    }),
  ) as Record<AcsScenario["id"], AcsScenarioView>;
}
