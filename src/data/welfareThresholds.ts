export type CriteriaYear = 2026 | 2027;
export type BenefitKey = 'livelihood' | 'medical' | 'housing' | 'education';
export type MetricKey = 'median' | BenefitKey;
export type SourceBadge = '공식' | '참고' | '시뮬레이션' | '추정';
export interface AmountCell { amount: number | null; badge: SourceBadge; sourceId: string; verified: boolean; pendingReason?: string }
export type ExpansionRule = { kind: 'difference_7_6'; verified: true; sourceId: string } | { kind: 'fixed_increment'; increment: number; verified: true; sourceId: string } | { kind: 'unavailable'; verified: false; sourceId: string };
export interface YearCriteria { year: CriteriaYear; effectiveFrom: string; checkedAt: string; ratios: Record<BenefitKey, number>; rows: Record<number, Record<MetricKey, AmountCell>>; expansion: Record<MetricKey, ExpansionRule> }

export const WELFARE_SOURCES = {
  median: { organization: '보건복지부', title: '급여 선정기준 및 최저보장수준', url: 'https://www.mohw.go.kr/menu.es?mid=a10708010900', publishedAt: null, effectiveFrom: '2027-01-01', checkedAt: '2026-10-07', locator: '2026·2027년 기준 중위소득 1~7인 표', verificationNote: '기준 중위소득 원표 확인' },
  release: { organization: '보건복지부·정책브리핑', title: '2027년도 기준 중위소득 및 급여별 선정기준', url: 'https://www.korea.kr/briefing/pressReleaseView.do?newsId=156772464', publishedAt: '2026-07-28', effectiveFrom: '2027-01-01', checkedAt: '2026-10-07', locator: '1~6인 선정기준 표 및 선정비율', verificationNote: '4인 6,929,885원·전년 대비 6.70%, 32·40·48·50% 확인' },
  notice2027: { organization: '보건복지부·국가법령정보센터', title: '2027년 기준 중위소득 및 생계·의료급여 선정기준과 최저보장수준 (고시 제2026-157호)', url: 'https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000283464', publishedAt: '2026-07-29', effectiveFrom: '2027-01-01', checkedAt: '2026-10-07', locator: '8인 이상: 7인과 6인 차액 가산', verificationNote: '7인 생계·의료 원표 금액은 재확인 필요. 해당 결과 차단' },
  notice2026: { organization: '보건복지부·국가법령정보센터', title: '2026년 기준 중위소득 및 생계·의료급여 선정기준', url: 'https://www.law.go.kr/admRulInfoP.do?admRulSeq=2100000262584', publishedAt: '2025-07-31', effectiveFrom: '2026-01-01', checkedAt: '2026-10-07', locator: '8인 이상 중위소득 959,198원·생계 306,943원 가산', verificationNote: '기존 1~6인 값 유지. 7인 급여 원표 및 나머지 가산규칙 재확인 필요' },
  housing2027: { organization: '국토교통부', title: '2027년 주거급여 선정기준 및 최저보장수준 (고시 제2026-455호)', url: 'https://police.molit.go.kr/USR/I0204/m_14993/dtl.jsp?gubun=4&idx=18946&lcmspage=2&old_search_dept_nm=&psize=10&search=&search_dept_id=&search_dept_nm=&search_regdate_e=&search_regdate_s=&srch_usr_ctnt=&srch_usr_nm=&srch_usr_num=&srch_usr_titl=&srch_usr_year=', publishedAt: '2026-08-31', effectiveFrom: '2027-01-01', checkedAt: '2026-10-07', locator: '선정기준 1~7인 및 8인 이상 차액 가산', verificationNote: '7인 4,873,279원, 가산 487,263원 확인' },
  education2027: { organization: '교육부', title: '2027년 교육급여 선정기준 및 최저보장수준 (고시 제2026-21호)', url: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=107233&lev=0&m=040401&opType=N&s=moe', publishedAt: '2026-09-18', effectiveFrom: '2027-01-01', checkedAt: '2026-10-07', locator: '교육급여 고시 첨부 원표', verificationNote: '7인 금액·8인 이상 산식은 재확인 필요. 해당 결과 차단' },
};
const keys: MetricKey[] = ['median', 'livelihood', 'medical', 'housing', 'education'];
const raw2026 = [
  [2564238,820556,1025695,1230834,1282119], [4199292,1343773,1679717,2015660,2099646],
  [5359036,1714892,2143614,2572337,2679518], [6494738,2078316,2597895,3117474,3247369],
  [7556719,2418150,3022688,3627225,3778360], [8555952,2737905,3422381,4106857,4277976],
  [9515150,null,null,null,null],
];
const raw2027 = [
  [2736042,875533,1094417,1313300,1368021], [4480645,1433806,1792258,2150710,2240323],
  [5718091,1829789,2287236,2744684,2859046], [6929885,2217563,2771954,3326345,3464943],
  [8063019,2580166,3225208,3870249,4031510], [9129201,2921344,3651680,4382016,4564601],
  [10152665,null,null,4873279,null],
];
function makeRows(raw: (number | null)[][], year: CriteriaYear): YearCriteria['rows'] {
  return Object.fromEntries(raw.map((values, i) => [i + 1, Object.fromEntries(keys.map((key, j) => {
    const amount = values[j];
    const sourceId = key === 'median' ? 'median' : year === 2026 ? 'notice2026' : i !== 6 ? 'release' : key === 'housing' ? 'housing2027' : key === 'education' ? 'education2027' : 'notice2027';
    return [key, { amount, badge: amount === null ? '참고' : '공식', sourceId, verified: amount !== null, ...(amount === null ? { pendingReason: '공식 기준표 확인 후 안내 예정' } : {}) }];
  }))])) as YearCriteria['rows'];
}
const unavailable = (sourceId: string): ExpansionRule => ({kind: 'unavailable', verified: false, sourceId});
const difference = (sourceId: string): ExpansionRule => ({kind: 'difference_7_6', verified: true, sourceId});
export const WELFARE_YEARS: Record<CriteriaYear, YearCriteria> = {
  2026: {year: 2026, effectiveFrom: '2026-01-01', checkedAt: '2026-10-07', ratios: {livelihood:32,medical:40,housing:48,education:50}, rows:makeRows(raw2026,2026), expansion: {
    median: {kind:'fixed_increment',increment:959198,verified:true,sourceId:'notice2026'}, livelihood:{kind:'fixed_increment',increment:306943,verified:true,sourceId:'notice2026'}, medical:unavailable('notice2026'), housing:unavailable('notice2026'), education:unavailable('notice2026'),
  }},
  2027: {year:2027,effectiveFrom:'2027-01-01',checkedAt:'2026-10-07',ratios:{livelihood:32,medical:40,housing:48,education:50},rows:makeRows(raw2027,2027),expansion:{median:difference('notice2027'),livelihood:difference('notice2027'),medical:difference('notice2027'),housing:difference('housing2027'),education:unavailable('education2027')}},
};
export const WELFARE_CONFIG = {
  schemaVersion:2, defaults:{year:2027,hh:4,mode:'recognized'}, limits:{minHousehold:1,maxHousehold:20,maxAmount:1000000000},
  years:WELFARE_YEARS,sources:WELFARE_SOURCES,benefitLabels:{livelihood:'생계급여',medical:'의료급여',housing:'주거급여',education:'교육급여'},modeLabels:{recognized:'소득인정액',monthly:'월 소득 단순 비교'},
};
