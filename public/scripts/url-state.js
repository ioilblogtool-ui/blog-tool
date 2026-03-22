/**
 * url-state.js — URL 파라미터 읽기/쓰기 헬퍼
 * history.replaceState 로 URL을 갱신해 계산기 상태를 공유할 수 있게 합니다.
 */

/**
 * URL 파라미터에서 문자열 값을 읽습니다.
 * @param {string} key  파라미터 이름
 * @param {string} fallback  값이 없을 때 반환할 기본값
 * @returns {string}
 */
export function readParam(key, fallback) {
  const params = new URLSearchParams(window.location.search);
  const val = params.get(key);
  return val !== null && val !== "" ? val : fallback;
}

/**
 * URL 파라미터에서 불리언 값을 읽습니다.
 * "0" 또는 "false" 이면 false, 나머지는 true.
 * @param {string} key
 * @param {boolean} fallback
 * @returns {boolean}
 */
export function readBool(key, fallback = true) {
  const params = new URLSearchParams(window.location.search);
  const val = params.get(key);
  if (val === null) return fallback;
  return val !== "0" && val !== "false";
}

/**
 * 현재 URL의 파라미터를 갱신합니다 (pushState 없이 조용히).
 * @param {Record<string, string|number|boolean>} map  { key: value } 형태
 */
export function writeParams(map) {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(map)) {
    params.set(key, String(value));
  }
  history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}
