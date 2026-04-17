# design-docs/ — 설계 문서 인덱스

> 실제 설계 문서는 `docs/design/YYYYMM/` 에 저장됩니다.
> 이 폴더는 설계 프로세스 가이드, 패턴 모음, 설계 인덱스를 관리합니다.

---

## 폴더 구조

```
docs/design-docs/
├── README.md              ← 지금 이 파일
└── PATTERNS.md            ← 반복 사용되는 설계 패턴 모음
```

실제 설계 문서 위치:
```
docs/design/
└── 202604/
    ├── ai-stack-cost-calculator-design.md
    ├── national-pension-generational-comparison-2026-design.md
    └── ...
```

---

## 설계 문서 구성 기준

Claude/Codex가 설계 문서만 보고 바로 구현에 착수할 수 있어야 합니다.
아래 항목을 반드시 포함합니다.

| 섹션 | 필수 여부 | 내용 |
|---|---|---|
| 문서 개요 | 필수 | slug, URL, 콘텐츠 유형, 레이아웃 |
| 파일 구조 | 필수 | 생성할 파일 목록 |
| 데이터 파일 설계 | 필수 | TypeScript 타입 + 실제 데이터 |
| 페이지 섹션 구성 | 필수 | Astro 마크업 스케치 |
| JS 인터랙션 | 필수 | 상태 객체, 함수 목록, 핵심 로직 |
| SCSS 설계 | 필수 | prefix, 주요 컴포넌트 |
| 등록 작업 | 필수 | tools.ts, app.scss, sitemap.xml |
| 구현 순서 | 권장 | 1~N 순서 |
| QA 포인트 | 권장 | 테스트 체크리스트 |

---

## 최근 설계 완료 목록

| slug | 유형 | 설계 문서 |
|---|---|---|
| ai-stack-cost-calculator | 계산기 | [링크](../design/202604/ai-stack-cost-calculator-design.md) |
| national-pension-generational-comparison-2026 | 리포트 | [링크](../design/202604/national-pension-generational-comparison-2026-design.md) |
| postpartum-center-cost-2026 | 리포트 | [링크](../design/202604/postpartum-center-cost-2026-design.md) |
| semiconductor-etf-2026 | 리포트 | [링크](../design/202604/semiconductor-etf-report-design.md) |
| police-salary-2026 | 리포트 | [링크](../design/202604/police-salary-2026-design.md) |
