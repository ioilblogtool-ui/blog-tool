# 구글 SEO · AdSense 주의사항

> **이 문서는 실제 구글 Search Console 오류 분석을 바탕으로 작성됨**
> 새 페이지 추가 또는 기존 페이지 수정 시 반드시 확인할 것

---

## 1. SeoContent 텍스트 최소 기준

구글 AdSense 심사봇과 크롤러는 **JS 렌더링 결과를 읽지 않음**.
계산기·차트·동적 테이블은 봇 입장에서 빈 영역. **SeoContent만이 실질 텍스트 콘텐츠**.

### ✅ 지켜야 할 기준

| 항목 | 기준 |
|------|------|
| `intro` 단락 수 | **최소 5개** (각 단락 2~4문장) |
| `intro` 총 글자 수 | **최소 800자** 이상 |
| `faq` 개수 | **최소 5개** (각 답변 3문장 이상) |
| 수치·팩트 포함 | intro에 **구체적 금액·비율·사례** 반드시 포함 |

### ❌ 금지 사항

```
# 나쁜 예 — 구글이 "가치 없음"으로 판단
intro={[
  "이 리포트는 도시별 여행 비용을 비교합니다.",
  "항공권, 숙박, 식비를 모두 포함했습니다.",
  "시뮬레이터를 사용해보세요.",
]}

# 좋은 예 — 구체적 수치와 맥락 포함
intro={[
  "2026년 기준 일본·동남아·유럽 8개 도시의 2인 여행 총비용을 항목별로 분해합니다. 스탠다드 4박 5일 기준 도시별 격차가 최대 100만원 이상 벌어집니다.",
  ...
]}
```

---

## 2. sitemap.xml 작성 규칙

### ✅ changefreq 유효값만 사용

```xml
<!-- ✅ 올바른 값 -->
<changefreq>always</changefreq>
<changefreq>hourly</changefreq>
<changefreq>daily</changefreq>
<changefreq>weekly</changefreq>
<changefreq>monthly</changefreq>
<changefreq>yearly</changefreq>
<changefreq>never</changefreq>

<!-- ❌ 잘못된 값 — 구글 sitemap 오류 발생 -->
<changefreq>quarterly</changefreq>  <!-- 사용 금지 -->
```

### ✅ 새 페이지 추가 시 sitemap 등록 필수

```xml
<url>
  <loc>https://bigyocalc.com/tools/새-슬러그/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 3. URL 트레일링 슬래시 규칙

**모든 URL은 반드시 슬래시(/)로 끝나야 함**

```
✅ 올바름: /tools/salary/
❌ 잘못됨: /tools/salary
```

- `astro.config.mjs`에 `trailingSlash: "always"` 설정됨
- `public/_redirects`에 슬래시 없는 URL → 있는 URL 301 리다이렉트 등록됨
- **새 페이지 URL 작성 시 항상 트레일링 슬래시 포함**

---

## 4. SeoContent 슬롯 위치

**반드시 `<Fragment slot="seo">` 안에 넣을 것**

```astro
<!-- ✅ 올바른 위치 -->
<SimpleToolShell ...>
  ...
  <Fragment slot="seo">
    <SeoContent introTitle="..." intro={[...]} faq={[...]} />
  </Fragment>
</SimpleToolShell>

<!-- ❌ 잘못된 위치 — 레이아웃 깨짐 -->
</SimpleToolShell>
<SeoContent ... />  ← SimpleToolShell 밖에 배치 금지
```

---

## 5. 페이지 신규 생성 체크리스트

새 페이지 (`/tools/` 또는 `/reports/`) 만들 때 확인:

- [ ] `SeoContent` intro **5단락 이상, 800자 이상**
- [ ] `SeoContent` faq **5개 이상**
- [ ] `SeoContent`를 `<Fragment slot="seo">` 안에 배치
- [ ] `sitemap.xml`에 URL 추가 (`changefreq`는 유효값만)
- [ ] URL에 트레일링 슬래시 포함
- [ ] `tools.ts` 또는 `reports.ts`에 메타 등록
- [ ] `app.scss`에 SCSS import 추가

---

## 6. 구글 색인 실패 유형별 대응

| 유형 | 원인 | 대응 |
|------|------|------|
| 크롤링됨 - 색인 미생성 | SeoContent 텍스트 얇음 | intro 단락 및 글자수 보강 |
| 리디렉션 오류 | 트레일링 슬래시 불일치 | `_redirects`에 301 추가 |
| 발견됨 - 색인 미생성 | sitemap 오류 or 크롤 대기 | sitemap 정상 여부 확인 후 URL 검사 요청 |
| 표준 태그 포함 대체 페이지 | URL 파라미터 버전 존재 | 정상 동작 (canonical 태그 작동 중) |

---

## 7. AdSense 관련

- AdSense 스크립트(`pagead2.googlesyndication.com`)는 `BaseLayout.astro`에 이미 포함됨 → **삭제하거나 이동하지 말 것**
- `meta name="google-adsense-account"` 태그도 유지 필수
- 콘텐츠 품질 향상 = AdSense 심사 통과 가능성 향상

---

_최종 업데이트: 2026-06-04_
_근거: 구글 Search Console 오류 분석 및 수정 이력_
