# SECURITY.md — 보안 규칙

> 비교계산소 운영 시 지켜야 할 보안 기준입니다.
> 모든 기여자(인간·AI 에이전트 포함)에게 적용됩니다.

---

## 1. 절대 금지 (hard rules)

| 금지 항목 | 이유 |
|---|---|
| API 키·시크릿을 코드·문서에 하드코딩 | 공개 저장소 노출 위험 |
| `.env` 파일 git commit | 인증 정보 유출 |
| 사용자 입력값을 `innerHTML`에 직접 삽입 | XSS 취약점 |
| `eval()` 사용 | 코드 인젝션 위험 |
| 외부 스크립트를 SRI 없이 로드 | 공급망 공격 위험 |
| `git push --force` to `main` | 히스토리 파괴, 배포 위험 |

---

## 2. 환경변수 관리

### 사용 방법

```bash
# .env.local (git ignore 처리됨)
SITE_URL=https://bigyocalc.com
```

```astro
// Astro에서 접근
const siteUrl = import.meta.env.SITE_URL;
```

### 규칙

- `.env.local` — 로컬 개발 전용, **절대 commit 금지**
- `.env.example` — 키 이름만 나열, 값 없음 (commit 허용)
- Cloudflare Pages 환경변수 — 대시보드에서만 설정

---

## 3. 외부 리소스 로드 정책

### CDN 스크립트 허용 목록

| 리소스 | URL 패턴 | 비고 |
|---|---|---|
| Chart.js | `cdn.jsdelivr.net/npm/chart.js@4/` | 버전 고정 필수 |
| Google AdSense | `pagead2.googlesyndication.com` | BaseLayout에서만 |
| Cloudflare Analytics | `static.cloudflareinsights.com` | BaseLayout에서만 |

### 외부 링크 처리

```html
<!-- 외부 링크는 항상 noopener noreferrer -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
```

### 이미지 출처

- 외부 이미지 `<img>` 직접 로드 금지 → `public/` 에 다운로드 후 사용
- OG 이미지는 자체 생성 (`scripts/generate-og-tools.py`)

---

## 4. 사용자 입력 처리

이 사이트는 서버리스 정적 사이트로, 서버에 데이터를 전송하지 않습니다.
모든 계산은 클라이언트 브라우저에서만 실행됩니다.

```js
// ✅ 올바른 방법: textContent 사용
element.textContent = userInput;

// ❌ 금지: innerHTML에 외부 데이터 직접 삽입
element.innerHTML = userInput; // XSS 위험
```

URL 파라미터 복원 시:

```js
// ✅ 숫자 파라미터는 parseFloat/parseInt + 범위 검증
const rate = Math.min(Math.max(parseFloat(params.get('rate') || '0'), 0), 100);

// ✅ 문자열 파라미터는 허용 목록(allowlist) 검증
const allowed = ['planning', 'development', 'design'];
const stage = allowed.includes(params.get('stage')) ? params.get('stage') : 'planning';
```

---

## 5. 제휴·광고 링크 처리

```html
<!-- 쿠팡 파트너스 등 제휴 링크 -->
<a
  href="https://link.coupang.com/..."
  target="_blank"
  rel="noopener noreferrer"
  class="affiliate-link"
>
  상품명
</a>
<!-- 근처에 반드시 광고 고지 문구 표시 -->
<p class="affiliate-notice">이 포스팅은 쿠팡 파트너스 활동의 일환으로...</p>
```

**규칙:**
- 제휴 링크 고지 문구 필수 (법적 의무)
- `rel="sponsored"` 또는 `rel="nofollow"` 중 하나 추가 권장
- 제휴 링크를 공식 데이터 출처처럼 위장 금지

---

## 6. 개인정보 처리

- 사용자가 입력한 연봉·나이·자산 등 수치는 서버로 전송하지 않음
- URL 파라미터에 저장되는 값은 계산 입력값만 (개인 식별 정보 없음)
- Google Analytics / Clarity 등 트래킹 도구는 개인정보처리방침 페이지(`/privacy/`)에 명시

---

## 7. 보안 사고 대응

| 상황 | 즉시 조치 |
|---|---|
| API 키 노출 | 즉시 키 폐기 → GitHub secret scanning 알림 확인 |
| 악성 코드 의심 PR | PR 병합 차단 → 코드 수동 검토 |
| CDN 스크립트 변조 | 해당 스크립트 제거 → 자체 호스팅으로 전환 |
| 사용자 민원 (개인정보) | 48시간 내 답변 → `/contact/` 페이지 통해 접수 |
