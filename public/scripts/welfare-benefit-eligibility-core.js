export const BENEFITS = ['livelihood', 'medical', 'housing', 'education'];
const METRICS = ['median', ...BENEFITS];
const LEGACY = ['region','house','child','single','special','earned','biz','prop','public','private','wd','hasset','gasset','fasset','debt','car','cartype','obligor','obligorLevel','crisis'];
export function parseAmount(raw, limits = {maxAmount:1000000000}) {
  const value = String(raw ?? '').trim();
  if (!value) return {status:'empty',amount:null};
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value)) return {status:'invalid',amount:null};
  const amount = Number(value.replaceAll(',',''));
  return Number.isSafeInteger(amount) && amount >= 0 && amount <= limits.maxAmount ? {status:'valid',amount} : {status:'invalid',amount:null};
}
export function validateConfig(config) {
  if (config?.schemaVersion !== 2 || !config.sources || !config.years) throw new Error('기준 데이터 형식 오류');
  for (const year of [2026,2027]) {
    const data = config.years[year];
    if (!data) throw new Error('연도 기준 누락');
    for (let hh=1; hh<=7; hh++) for (const metric of METRICS) {
      const cell = data.rows?.[hh]?.[metric];
      if (!cell || !config.sources[cell.sourceId] || (cell.verified && (!Number.isSafeInteger(cell.amount) || cell.amount <= 0))) throw new Error('기준표 또는 출처 오류');
    }
    for (const metric of METRICS) {
      const rule = data.expansion?.[metric];
      if (!rule || !config.sources[rule.sourceId] || !['difference_7_6','fixed_increment','unavailable'].includes(rule.kind) || (rule.kind==='fixed_increment' && (!Number.isSafeInteger(rule.increment) || rule.increment<=0))) throw new Error('가산 규칙 오류');
    }
  }
  return true;
}
const unavailable = () => ({amount:null,badge:'참고',verified:false,pendingReason:'공식 기준표 확인 후 안내 예정'});
export function resolveThreshold(config, year, hh, metric) {
  const data = config.years[year];
  if (!data || !METRICS.includes(metric) || !Number.isInteger(hh) || hh<config.limits.minHousehold || hh>config.limits.maxHousehold) return unavailable();
  if (hh<=7) { const cell=data.rows[hh]?.[metric]; return cell?.verified && Number.isSafeInteger(cell.amount) ? {...cell} : unavailable(); }
  const rule=data.expansion[metric], seven=data.rows[7][metric], six=data.rows[6][metric];
  if (!rule.verified || !seven.verified || !six.verified || rule.kind==='unavailable') return unavailable();
  const increment = rule.kind==='fixed_increment' ? rule.increment : seven.amount-six.amount;
  const amount=seven.amount+(hh-7)*increment;
  return Number.isSafeInteger(amount) && increment>0 ? {amount,badge:'시뮬레이션',verified:true,sourceId:rule.sourceId} : unavailable();
}
export function compareBenefit(parsed, threshold) {
  if (parsed.status!=='valid') return {status:parsed.status,gap:null};
  if (!threshold.verified || threshold.amount===null) return {status:'unavailable',gap:null};
  const gap=threshold.amount-parsed.amount;
  return {status:gap>0?'below':gap===0?'equal':'above',gap};
}
export function calculateComparison(config,state,parsed) {
  const years=Object.fromEntries([2026,2027].map(year => {
    const median=resolveThreshold(config,year,state.hh,'median');
    return [year,{median,ratio:parsed.status==='valid'&&median.verified ? 100*parsed.amount/median.amount : null,benefits:Object.fromEntries(BENEFITS.map(key=>{const threshold=resolveThreshold(config,year,state.hh,key);return [key,{threshold,...compareBenefit(parsed,threshold)}];}))}];
  }));
  return {...years[state.year],years};
}
export function restoreState(input,config) {
  const url=new URL(input,'https://bigyocalc.com'), params=url.searchParams;
  const defaults={...config.defaults,amount:'',notice:''};
  const own=['v','year','hh','mode'];
  if (!params.has('v')) {
    if (params.has('hh') || LEGACY.some(k=>params.has(k))) {
      const raw=params.get('hh'), hh=/^\d+$/.test(raw??'')?Number(raw):4;
      return {...defaults,year:2026,hh:hh>=1&&hh<=20&&params.getAll('hh').length===1?hh:4,notice:'이전 링크의 소득·재산 값은 복원하지 않았습니다. 2026 기준으로 금액을 다시 입력하세요.'};
    }
    return defaults;
  }
  const rawHH=params.get('hh'),hh=Number(rawHH),year=Number(params.get('year')),mode=params.get('mode');
  if (own.some(k=>params.getAll(k).length!==1) || params.get('v')!=='2' || !['2026','2027'].includes(params.get('year')) || !/^\d+$/.test(rawHH??'') || hh<1 || hh>20 || !['recognized','monthly'].includes(mode)) return {...defaults,notice:'유효하지 않은 링크 설정을 초기화했습니다.'};
  let amount='',notice=LEGACY.some(k=>params.has(k))||params.has('amount')?'링크의 소득·재산 파라미터를 제거했습니다.':'';
  if (url.hash && !['#overview','#highlights','#criteria','#faq','#related'].includes(url.hash)) {
    const hash=new URLSearchParams(url.hash.slice(1)),raw=hash.get('amount');
    if (hash.getAll('amount').length===1 && [...hash.keys()].every(k=>k==='amount') && parseAmount(raw,config.limits).status==='valid') { amount=raw;notice='공유된 금액을 복원하고 주소에서 제거했습니다. 금액을 다시 공유하려면 직접 선택하세요.'; }
    else notice='유효하지 않은 공유 금액을 제거했습니다.';
  }
  return {year,hh,mode,amount,notice};
}
export function serializePublicState(state) { return new URLSearchParams({v:'2',year:String(state.year),hh:String(state.hh),mode:state.mode}); }
export function buildShareURL(input,state,parsed,includeAmount=false) {
  const url=new URL(input);url.search=serializePublicState(state).toString();url.hash=includeAmount&&parsed.status==='valid'?`amount=${parsed.amount}`:'';return url.href;
}
